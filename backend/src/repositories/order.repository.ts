import { dbQuery, dbTransaction, getIsPgConnected, memoryStore } from '../database/index.js';
import { OrderRecord, OrderStatus, PaymentStatus } from '../types/index.js';
import { ConflictError, NotFoundError } from '../utils/errors.js';

export class OrderRepository {
  async findById(orderIdOrNumber: string): Promise<OrderRecord | null> {
    if (getIsPgConnected()) {
      const orders = await dbQuery<any>(
        `SELECT * FROM orders WHERE id = $1 OR order_number = $1 LIMIT 1`,
        [orderIdOrNumber]
      );
      if (orders.length === 0) return null;

      const orderRow = orders[0];
      const items = await dbQuery<any>(
        `SELECT * FROM order_items WHERE order_id = $1`,
        [orderRow.id]
      );

      return this.formatPgOrder(orderRow, items);
    }

    const found = memoryStore.orders.find(
      (o) =>
        o.id === orderIdOrNumber ||
        o.orderNumber === orderIdOrNumber ||
        o.id.toLowerCase() === orderIdOrNumber.toLowerCase()
    );

    return found ? (this.normalizeOrderRecord(found) as OrderRecord) : null;
  }

  async findAll(filters: {
    search?: string;
    status?: string;
    paymentMethod?: string;
    page?: number;
    limit?: number;
  }): Promise<{ orders: OrderRecord[]; total: number; page: number; limit: number; totalPages: number }> {
    const page = filters.page && filters.page > 0 ? filters.page : 1;
    const limit = filters.limit && filters.limit > 0 ? filters.limit : 50;
    const offset = (page - 1) * limit;

    if (getIsPgConnected()) {
      const conditions: string[] = [];
      const params: any[] = [];
      let idx = 1;

      if (filters.status && filters.status.toLowerCase() !== 'all') {
        conditions.push(`LOWER(order_status) = $${idx++}`);
        params.push(filters.status.toLowerCase());
      }

      if (filters.paymentMethod && filters.paymentMethod.toLowerCase() !== 'all') {
        conditions.push(`LOWER(payment_method) = $${idx++}`);
        params.push(filters.paymentMethod.toLowerCase());
      }

      if (filters.search) {
        conditions.push(
          `(id ILIKE $${idx} OR order_number ILIKE $${idx} OR customer_name ILIKE $${idx} OR customer_phone ILIKE $${idx} OR customer_email ILIKE $${idx})`
        );
        params.push(`%${filters.search}%`);
        idx++;
      }

      const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
      const countRes = await dbQuery<{ count: string }>(
        `SELECT COUNT(*) as count FROM orders ${whereClause}`,
        params
      );
      const total = parseInt(countRes[0]?.count || '0', 10);

      const rows = await dbQuery<any>(
        `SELECT * FROM orders ${whereClause} ORDER BY created_at DESC LIMIT $${idx++} OFFSET $${idx++}`,
        [...params, limit, offset]
      );

      const orderList: OrderRecord[] = [];
      for (const row of rows) {
        const items = await dbQuery<any>(
          `SELECT * FROM order_items WHERE order_id = $1`,
          [row.id]
        );
        orderList.push(this.formatPgOrder(row, items));
      }

      return {
        orders: orderList,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      };
    }

    let filtered = [...memoryStore.orders];

    if (filters.status && filters.status.toLowerCase() !== 'all') {
      filtered = filtered.filter(
        (o) =>
          o.orderStatus?.toLowerCase() === filters.status?.toLowerCase() ||
          o.order_status?.toLowerCase() === filters.status?.toLowerCase()
      );
    }

    if (filters.paymentMethod && filters.paymentMethod.toLowerCase() !== 'all') {
      filtered = filtered.filter(
        (o) =>
          o.paymentMethod?.toLowerCase() === filters.paymentMethod?.toLowerCase() ||
          o.payment_method?.toLowerCase() === filters.paymentMethod?.toLowerCase()
      );
    }

    if (filters.search) {
      const q = filters.search.toLowerCase().trim();
      filtered = filtered.filter((o) => {
        const customerName = o.customer?.fullName || o.customerName || '';
        const phone = o.customer?.phone || o.customerPhone || '';
        const email = o.customer?.email || o.customerEmail || '';
        return (
          o.id.toLowerCase().includes(q) ||
          (o.orderNumber && o.orderNumber.toLowerCase().includes(q)) ||
          customerName.toLowerCase().includes(q) ||
          phone.toLowerCase().includes(q) ||
          email.toLowerCase().includes(q)
        );
      });
    }

    filtered.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());

    const total = filtered.length;
    const paginated = filtered.slice(offset, offset + limit).map((o) => this.normalizeOrderRecord(o));

    return {
      orders: paginated,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  async createOrderWithItems(data: {
    order: any;
    items: any[];
    customer: any;
    shippingAddress: any;
    couponUsage?: any;
  }): Promise<OrderRecord> {
    return await dbTransaction(async (client) => {
      if (getIsPgConnected() && client) {
        for (const item of data.items) {
          const updateStockRes = await client.query(
            `UPDATE products 
             SET stock_quantity = stock_quantity - $1,
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = $2 AND stock_quantity >= $1
             RETURNING id, name, stock_quantity`,
            [item.quantity, item.productId]
          );

          if (updateStockRes.rowCount === 0) {
            throw new ConflictError(
              `Insufficient stock available for product "${item.name || item.productId}". Order cannot be completed.`
            );
          }
        }

        const orderInsert = await client.query(
          `INSERT INTO orders (
            id, order_number, customer_name, customer_phone, customer_email,
            customer_address, customer_apartment, customer_city, customer_division, customer_postal_code,
            delivery_notes, subtotal, discount_amount, delivery_fee, total_amount,
            coupon_id, coupon_code, payment_method, payment_status, order_status,
            payment_details, created_at, updated_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
          RETURNING *`,
          [
            data.order.id,
            data.order.orderNumber,
            data.customer.fullName,
            data.customer.phone,
            data.customer.email,
            data.shippingAddress.street,
            data.shippingAddress.apartment || null,
            data.shippingAddress.city,
            data.shippingAddress.division || null,
            data.shippingAddress.postalCode || null,
            data.shippingAddress.notes || null,
            data.order.subtotal,
            data.order.discountAmount,
            data.order.deliveryFee,
            data.order.totalAmount,
            data.order.couponId || null,
            data.order.couponCode || null,
            data.order.paymentMethod,
            data.order.paymentStatus || 'Pending',
            data.order.orderStatus || 'Pending',
            data.order.paymentDetails ? JSON.stringify(data.order.paymentDetails) : null,
          ]
        );

        for (const item of data.items) {
          await client.query(
            `INSERT INTO order_items (
              order_id, product_id, product_name_snapshot, sku_snapshot,
              selected_color, selected_size, image_snapshot, unit_price, quantity, line_total
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
            [
              data.order.id,
              item.productId,
              item.name,
              item.sku || 'SKU-GEN',
              item.selectedColor || null,
              item.selectedSize || null,
              item.image || null,
              item.unitPrice,
              item.quantity,
              item.lineTotal,
            ]
          );
        }

        await client.query(
          `INSERT INTO customers (
            email, full_name, phone, address, city, order_count, total_spent, last_order_date
          ) VALUES ($1, $2, $3, $4, $5, 1, $6, CURRENT_TIMESTAMP)
          ON CONFLICT (email) DO UPDATE SET
            order_count = customers.order_count + 1,
            total_spent = customers.total_spent + EXCLUDED.total_spent,
            last_order_date = CURRENT_TIMESTAMP,
            full_name = EXCLUDED.full_name,
            phone = EXCLUDED.phone,
            address = EXCLUDED.address,
            city = EXCLUDED.city,
            updated_at = CURRENT_TIMESTAMP`,
          [
            data.customer.email,
            data.customer.fullName,
            data.customer.phone,
            data.shippingAddress.street,
            data.shippingAddress.city,
            data.order.totalAmount,
          ]
        );

        if (data.couponUsage && data.order.couponCode) {
          await client.query(
            `INSERT INTO coupon_usages (
              coupon_id, order_id, customer_email, discount_applied
            ) VALUES ($1, $2, $3, $4)`,
            [
              data.couponUsage.couponId,
              data.order.id,
              data.customer.email,
              data.order.discountAmount,
            ]
          );

          await client.query(
            `UPDATE coupons SET usage_count = usage_count + 1, updated_at = CURRENT_TIMESTAMP WHERE id = $1`,
            [data.couponUsage.couponId]
          );
        }

        const itemsRes = await client.query(
          `SELECT * FROM order_items WHERE order_id = $1`,
          [data.order.id]
        );
        return this.formatPgOrder(orderInsert.rows[0], itemsRes.rows);
      }

      // MemoryStore fallback
      for (const item of data.items) {
        const prod = memoryStore.products.find((p) => p.id === item.productId);
        if (!prod) {
          throw new NotFoundError(`Product "${item.productId}" not found.`);
        }
        const currentStock = prod.stock ?? prod.stock_quantity ?? 0;
        if (currentStock < item.quantity) {
          throw new ConflictError(
            `Insufficient stock for "${prod.name}". Available: ${currentStock}, Requested: ${item.quantity}`
          );
        }
        prod.stock = currentStock - item.quantity;
        prod.stock_quantity = prod.stock;
      }

      const fullOrder: OrderRecord = {
        id: data.order.id,
        orderNumber: data.order.orderNumber,
        customerName: data.customer.fullName,
        customerPhone: data.customer.phone,
        customerEmail: data.customer.email,
        customerAddress: data.shippingAddress.street,
        customerApartment: data.shippingAddress.apartment || null,
        customerCity: data.shippingAddress.city,
        customerDivision: data.shippingAddress.division || null,
        customerPostalCode: data.shippingAddress.postalCode || null,
        deliveryNotes: data.shippingAddress.notes || null,
        subtotal: data.order.subtotal,
        discountAmount: data.order.discountAmount,
        deliveryFee: data.order.deliveryFee,
        totalAmount: data.order.totalAmount,
        couponId: data.order.couponId || null,
        couponCode: data.order.couponCode || null,
        paymentMethod: data.order.paymentMethod,
        paymentStatus: data.order.paymentStatus || 'Pending',
        orderStatus: data.order.orderStatus || 'Pending',
        paymentDetails: data.order.paymentDetails || null,
        deliveredAt: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        customer: {
          fullName: data.customer.fullName,
          phone: data.customer.phone,
          email: data.customer.email,
          address: data.shippingAddress.street,
          city: data.shippingAddress.city,
          postalCode: data.shippingAddress.postalCode,
        },
        shippingAddress: data.shippingAddress,
        items: data.items.map((i) => ({
          productId: i.productId,
          productNameSnapshot: i.name,
          skuSnapshot: i.sku || 'SKU-001',
          name: i.name,
          price: i.unitPrice,
          unitPrice: i.unitPrice,
          quantity: i.quantity,
          lineTotal: i.lineTotal,
          color: i.selectedColor,
          size: i.selectedSize,
          image: i.image,
        })),
        pricing: {
          subtotal: data.order.subtotal,
          shippingFee: data.order.deliveryFee,
          discount: data.order.discountAmount,
          total: data.order.totalAmount,
          couponCode: data.order.couponCode || null,
        },
        total: data.order.totalAmount,
        shippingFee: data.order.deliveryFee,
      };

      memoryStore.orders.unshift(fullOrder);

      let customer = memoryStore.customers.find(
        (c) => c.email.toLowerCase() === data.customer.email.toLowerCase()
      );
      if (customer) {
        customer.orderCount = (customer.orderCount || 1) + 1;
        customer.totalSpent = (customer.totalSpent || 0) + data.order.totalAmount;
        customer.lastOrderDate = new Date().toISOString();
        customer.fullName = data.customer.fullName;
        customer.phone = data.customer.phone;
        customer.address = data.shippingAddress.street;
        customer.city = data.shippingAddress.city;
      } else {
        memoryStore.customers.push({
          id: `cust-${Date.now()}`,
          email: data.customer.email,
          fullName: data.customer.fullName,
          phone: data.customer.phone,
          address: data.shippingAddress.street,
          city: data.shippingAddress.city,
          orderCount: 1,
          totalSpent: data.order.totalAmount,
          lastOrderDate: new Date().toISOString(),
        });
      }

      if (data.order.couponCode) {
        const coupon = memoryStore.coupons.find(
          (c) => c.code.toUpperCase() === data.order.couponCode.toUpperCase()
        );
        if (coupon) {
          coupon.timesUsed = (coupon.timesUsed || 0) + 1;
        }
      }

      return fullOrder;
    });
  }

  async updateStatus(
    orderId: string,
    newStatus: OrderStatus,
    paymentStatus?: PaymentStatus
  ): Promise<OrderRecord> {
    const existing = await this.findById(orderId);
    if (!existing) {
      throw new NotFoundError(`Order with ID "${orderId}" not found.`);
    }

    const previousStatus = existing.orderStatus;
    const isNowCancelled = newStatus === 'Cancelled' && previousStatus !== 'Cancelled';
    const isNowDelivered = newStatus === 'Delivered';
    const deliveredAt = isNowDelivered ? new Date().toISOString() : existing.deliveredAt;

    if (getIsPgConnected()) {
      return await dbTransaction(async (client) => {
        if (isNowCancelled && existing.items) {
          for (const item of existing.items) {
            await client.query(
              `UPDATE products SET stock_quantity = stock_quantity + $1 WHERE id = $2`,
              [item.quantity, item.productId]
            );
          }
        }

        const updates: string[] = ['order_status = $1', 'updated_at = CURRENT_TIMESTAMP'];
        const params: any[] = [newStatus];
        let idx = 2;

        if (paymentStatus) {
          updates.push(`payment_status = $${idx++}`);
          params.push(paymentStatus);
        }
        if (isNowDelivered) {
          updates.push(`delivered_at = CURRENT_TIMESTAMP`);
        }

        params.push(orderId);
        const res = await client.query(
          `UPDATE orders SET ${updates.join(', ')} WHERE id = $${idx} OR order_number = $${idx} RETURNING *`,
          params
        );

        const items = await client.query(
          `SELECT * FROM order_items WHERE order_id = $1`,
          [res.rows[0].id]
        );
        return this.formatPgOrder(res.rows[0], items.rows);
      });
    }

    if (isNowCancelled && existing.items) {
      for (const item of existing.items) {
        const prod = memoryStore.products.find((p) => p.id === item.productId);
        if (prod) {
          prod.stock = (prod.stock ?? prod.stock_quantity ?? 0) + item.quantity;
          prod.stock_quantity = prod.stock;
        }
      }
    }

    existing.orderStatus = newStatus;
    if (paymentStatus) {
      existing.paymentStatus = paymentStatus;
    }
    if (isNowDelivered) {
      existing.deliveredAt = deliveredAt;
    }
    existing.updatedAt = new Date().toISOString();

    return existing;
  }

  private normalizeOrderRecord(order: any): OrderRecord {
    const customer = order.customer || {
      fullName: order.customerName || order.customer_name || 'Guest Patron',
      phone: order.customerPhone || order.customer_phone || '',
      email: order.customerEmail || order.customer_email || '',
      address: order.customerAddress || order.customer_address || '',
      city: order.customerCity || order.customer_city || '',
      postalCode: order.customerPostalCode || order.customer_postal_code || '',
    };

    const shippingAddress = order.shippingAddress || {
      street: order.customerAddress || order.customer_address || '',
      apartment: order.customerApartment || order.customer_apartment,
      city: order.customerCity || order.customer_city || '',
      division: order.customerDivision || order.customer_division,
      postalCode: order.customerPostalCode || order.customer_postal_code,
      notes: order.deliveryNotes || order.delivery_notes,
    };

    const items = (order.items || []).map((i: any) => ({
      productId: i.productId || i.product_id || i.id,
      name: i.name || i.productNameSnapshot || i.product_name_snapshot,
      productNameSnapshot: i.productNameSnapshot || i.product_name_snapshot || i.name,
      skuSnapshot: i.skuSnapshot || i.sku_snapshot || i.sku || 'SKU-001',
      unitPrice: Number(i.unitPrice || i.unit_price || i.price || 0),
      price: Number(i.unitPrice || i.unit_price || i.price || 0),
      quantity: Number(i.quantity || 1),
      lineTotal: Number(i.lineTotal || i.line_total || (i.price || 0) * (i.quantity || 1)),
      color: i.color || i.selectedColor || i.selected_color,
      size: i.size || i.selectedSize || i.selected_size,
      image: i.image || i.imageSnapshot || i.image_snapshot,
    }));

    const subtotal = Number(order.subtotal || 0);
    const shippingFee = Number(order.shippingFee ?? order.deliveryFee ?? order.delivery_fee ?? 0);
    const discount = Number(order.discountAmount ?? order.discount_amount ?? order.discount ?? 0);
    const total = Number(order.totalAmount ?? order.total_amount ?? order.total ?? subtotal + shippingFee - discount);

    return {
      id: order.id,
      orderNumber: order.orderNumber || order.order_number || order.id,
      customerName: customer.fullName,
      customerPhone: customer.phone,
      customerEmail: customer.email,
      customerAddress: shippingAddress.street,
      customerApartment: shippingAddress.apartment,
      customerCity: shippingAddress.city,
      customerDivision: shippingAddress.division,
      customerPostalCode: shippingAddress.postalCode,
      deliveryNotes: shippingAddress.notes,
      subtotal,
      discountAmount: discount,
      deliveryFee: shippingFee,
      totalAmount: total,
      total,
      shippingFee,
      couponId: order.couponId || order.coupon_id,
      couponCode: order.couponCode || order.coupon_code,
      paymentMethod: order.paymentMethod || order.payment_method || 'Cash on Delivery',
      paymentStatus: (order.paymentStatus || order.payment_status || 'Pending') as PaymentStatus,
      orderStatus: (order.orderStatus || order.order_status || 'Pending') as OrderStatus,
      paymentDetails: order.paymentDetails || order.payment_details,
      deliveredAt: order.deliveredAt || order.delivered_at,
      createdAt: order.createdAt || order.created_at || new Date().toISOString(),
      updatedAt: order.updatedAt || order.updated_at || new Date().toISOString(),
      customer,
      shippingAddress,
      items,
      pricing: {
        subtotal,
        shippingFee,
        discount,
        total,
        couponCode: order.couponCode || order.coupon_code || null,
      },
    };
  }

  private formatPgOrder(orderRow: any, itemRows: any[]): OrderRecord {
    return this.normalizeOrderRecord({
      ...orderRow,
      items: itemRows,
    });
  }
}

export const orderRepository = new OrderRepository();

