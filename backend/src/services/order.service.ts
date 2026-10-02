import { orderRepository } from '../repositories/order.repository.js';
import { productRepository } from '../repositories/product.repository.js';
import { couponRepository } from '../repositories/coupon.repository.js';
import { OrderRecord, OrderStatus, PaymentStatus } from '../types/index.js';
import { BadRequestError, ConflictError, NotFoundError } from '../utils/errors.js';
import { logger } from '../utils/logger.js';

export interface CreateOrderDTO {
  customer: {
    fullName: string;
    email: string;
    phone: string;
    address?: string;
  };
  shippingAddress?: {
    street?: string;
    apartment?: string;
    city?: string;
    division?: string;
    postalCode?: string;
    notes?: string;
  };
  streetAddress?: string;
  city?: string;
  division?: string;
  postalCode?: string;
  deliveryNotes?: string;

  items: Array<{
    productId: string;
    quantity: number;
    selectedColor?: string;
    selectedSize?: string;
  }>;
  couponCode?: string | null;
  paymentMethod?: string;
  paymentDetails?: any;
}

export class OrderService {
  async createGuestOrder(dto: CreateOrderDTO): Promise<OrderRecord> {
    if (!dto.items || !Array.isArray(dto.items) || dto.items.length === 0) {
      throw new BadRequestError('Cannot create an order with an empty shopping bag.');
    }

    if (!dto.customer || !dto.customer.fullName || !dto.customer.email || !dto.customer.phone) {
      throw new BadRequestError('Customer full name, email, and phone number are required.');
    }

    const street = (
      dto.shippingAddress?.street ||
      dto.streetAddress ||
      dto.customer.address ||
      ''
    ).trim();
    const city = (dto.shippingAddress?.city || dto.city || 'Dhaka').trim();
    const division = (dto.shippingAddress?.division || dto.division || 'Dhaka').trim();
    const postalCode = (dto.shippingAddress?.postalCode || dto.postalCode || '1212').trim();
    const apartment = (dto.shippingAddress?.apartment || '').trim();
    const notes = (dto.shippingAddress?.notes || dto.deliveryNotes || '').trim();

    if (!street) {
      throw new BadRequestError('Shipping delivery street address is required.');
    }

    const resolvedItems: Array<{
      productId: string;
      name: string;
      sku: string;
      unitPrice: number;
      quantity: number;
      lineTotal: number;
      selectedColor?: string;
      selectedSize?: string;
      image?: string;
    }> = [];

    let calculatedSubtotal = 0;

    for (const rawItem of dto.items) {
      const quantity = Math.floor(Number(rawItem.quantity));
      if (!quantity || quantity <= 0) {
        throw new BadRequestError(`Invalid quantity for item ${rawItem.productId}`);
      }

      const product = await productRepository.findById(rawItem.productId);
      if (!product) {
        throw new NotFoundError(`Product "${rawItem.productId}" was not found.`);
      }

      if (product.status && product.status !== 'published') {
        throw new BadRequestError(
          `Product "${product.name}" is currently unavailable for purchase.`
        );
      }

      const currentStock = Number(product.stock ?? (product as any).stock_quantity ?? 0);
      if (currentStock < quantity) {
        throw new ConflictError(
          `Insufficient stock for "${product.name}". Available: ${currentStock}, Requested: ${quantity}.`
        );
      }

      const authoritativeUnitPrice = Number(
        product.discountPrice ?? (product as any).discount_price ?? product.price
      );
      const lineTotal = authoritativeUnitPrice * quantity;

      calculatedSubtotal += lineTotal;

      resolvedItems.push({
        productId: product.id,
        name: product.name,
        sku: product.sku || `AUR-SKU-${product.id}`,
        unitPrice: authoritativeUnitPrice,
        quantity,
        lineTotal,
        selectedColor: rawItem.selectedColor,
        selectedSize: rawItem.selectedSize,
        image: Array.isArray(product.images) && product.images.length > 0 ? (typeof product.images[0] === 'string' ? product.images[0] : (product.images[0] as any).url) : undefined,
      });
    }

    let discountAmount = 0;
    let couponRecord: any = null;

    if (dto.couponCode && dto.couponCode.trim()) {
      const cleanCode = dto.couponCode.trim().toUpperCase();
      couponRecord = await couponRepository.findByCode(cleanCode);

      if (!couponRecord) {
        throw new BadRequestError(`Coupon code "${cleanCode}" is invalid.`);
      }

      if (!couponRecord.active) {
        throw new BadRequestError(`Coupon code "${cleanCode}" is no longer active.`);
      }

      if (couponRecord.expiryDate && new Date(couponRecord.expiryDate) < new Date()) {
        throw new BadRequestError(`Coupon code "${cleanCode}" has expired.`);
      }

      if (couponRecord.minSpend && calculatedSubtotal < couponRecord.minSpend) {
        throw new BadRequestError(
          `Coupon "${cleanCode}" requires a minimum order of ৳${couponRecord.minSpend}.`
        );
      }

      if (
        couponRecord.usageLimit !== null &&
        couponRecord.usageLimit !== undefined &&
        couponRecord.timesUsed >= couponRecord.usageLimit
      ) {
        throw new BadRequestError(`Coupon code "${cleanCode}" has reached its maximum usage limit.`);
      }

      if (couponRecord.type === 'percentage') {
        discountAmount = Math.round(calculatedSubtotal * (Number(couponRecord.value) / 100));
      } else {
        discountAmount = Math.min(calculatedSubtotal, Number(couponRecord.value));
      }
    }

    let deliveryFee = 0;
    if (calculatedSubtotal < 3000) {
      const isDhaka =
        city.toLowerCase().includes('dhaka') || division.toLowerCase().includes('dhaka');
      deliveryFee = isDhaka ? 60 : 120;
    }

    const finalTotal = Math.max(0, calculatedSubtotal - discountAmount + deliveryFee);

    const year = new Date().getFullYear();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `AUR-${year}-${randomSuffix}`;
    const orderId = orderNumber;

    const paymentMethod = dto.paymentMethod || 'Cash on Delivery';
    const isCod = paymentMethod.toLowerCase().includes('cash');
    const paymentStatus: PaymentStatus = isCod ? 'Pending' : 'Paid';
    const orderStatus: OrderStatus = 'Pending';

    logger.info(
      `🛒 Initiating atomic checkout for order ${orderNumber} (Subtotal: ${calculatedSubtotal}, Discount: ${discountAmount}, Total: ${finalTotal})`
    );

    const createdOrder = await orderRepository.createOrderWithItems({
      order: {
        id: orderId,
        orderNumber,
        subtotal: calculatedSubtotal,
        discountAmount,
        deliveryFee,
        totalAmount: finalTotal,
        couponId: couponRecord?.id || null,
        couponCode: couponRecord?.code || null,
        paymentMethod,
        paymentStatus,
        orderStatus,
        paymentDetails: dto.paymentDetails || null,
      },
      items: resolvedItems,
      customer: {
        fullName: dto.customer.fullName.trim(),
        email: dto.customer.email.trim(),
        phone: dto.customer.phone.trim(),
      },
      shippingAddress: {
        street,
        apartment,
        city,
        division,
        postalCode,
        notes,
      },
      couponUsage: couponRecord ? { couponId: couponRecord.id } : undefined,
    });

    return createdOrder;
  }

  async getOrderByNumber(orderNumber: string): Promise<OrderRecord> {
    const order = await orderRepository.findById(orderNumber.trim());
    if (!order) {
      throw new NotFoundError(`Order "${orderNumber}" not found.`);
    }
    return order;
  }

  async getOrders(filters: {
    search?: string;
    status?: string;
    paymentMethod?: string;
    page?: number;
    limit?: number;
  }) {
    return await orderRepository.findAll(filters);
  }

  async getOrderById(orderId: string): Promise<OrderRecord> {
    const order = await orderRepository.findById(orderId);
    if (!order) {
      throw new NotFoundError(`Order "${orderId}" not found.`);
    }
    return order;
  }

  async updateOrderStatus(
    orderId: string,
    newStatus: string,
    paymentStatus?: string
  ): Promise<OrderRecord> {
    const validStatuses: OrderStatus[] = [
      'Pending',
      'Processing',
      'Shipped',
      'Delivered',
      'Cancelled',
      'Returned',
    ];

    const matchedStatus = validStatuses.find(
      (s) => s.toLowerCase() === newStatus.toLowerCase()
    );

    if (!matchedStatus) {
      throw new BadRequestError(
        `Invalid order status "${newStatus}". Must be one of: ${validStatuses.join(', ')}`
      );
    }

    let matchedPayment: PaymentStatus | undefined = undefined;
    if (paymentStatus) {
      const validPayments: PaymentStatus[] = ['Pending', 'Paid', 'Failed', 'Refunded'];
      matchedPayment = validPayments.find(
        (p) => p.toLowerCase() === paymentStatus.toLowerCase()
      );
      if (!matchedPayment) {
        throw new BadRequestError(`Invalid payment status "${paymentStatus}".`);
      }
    }

    return await orderRepository.updateStatus(orderId, matchedStatus, matchedPayment);
  }
}

export const orderService = new OrderService();

