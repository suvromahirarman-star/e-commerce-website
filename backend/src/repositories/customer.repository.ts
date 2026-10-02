import { dbQuery, memoryStore, getIsPgConnected } from '../database/index.js';

export interface CustomerRecord {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  division?: string;
  orderCount: number;
  totalSpent: number;
  lastOrderDate: string;
  orders?: string[];
}

export class CustomerRepository {
  async findAll(searchQuery?: string): Promise<CustomerRecord[]> {
    if (getIsPgConnected()) {
      let query = `SELECT * FROM customers WHERE 1=1`;
      const params: any[] = [];

      if (searchQuery && searchQuery.trim()) {
        query += ` AND (full_name ILIKE $1 OR email ILIKE $1 OR phone ILIKE $1 OR city ILIKE $1)`;
        params.push(`%${searchQuery.trim()}%`);
      }

      query += ` ORDER BY last_order_date DESC`;
      const rows = await dbQuery<any>(query, params);
      return rows.map(this.formatPgCustomer);
    }

    let list = [...memoryStore.customers];
    if (searchQuery && searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter(
        (c) =>
          c.fullName?.toLowerCase().includes(q) ||
          c.email?.toLowerCase().includes(q) ||
          c.phone?.toLowerCase().includes(q) ||
          c.city?.toLowerCase().includes(q)
      );
    }

    // Sort by last order date descending
    list.sort(
      (a, b) =>
        new Date(b.lastOrderDate || 0).getTime() - new Date(a.lastOrderDate || 0).getTime()
    );

    return list.map((c) => ({
      id: c.id,
      fullName: c.fullName || c.full_name || 'Guest Customer',
      email: c.email,
      phone: c.phone || '—',
      address: c.address || '—',
      city: c.city || 'Dhaka',
      division: c.division || 'Dhaka',
      orderCount: Number(c.orderCount ?? c.order_count ?? 1),
      totalSpent: Number(c.totalSpent ?? c.total_spent ?? 0),
      lastOrderDate: c.lastOrderDate || c.last_order_date || new Date().toISOString(),
      orders: c.orders || [],
    }));
  }

  async findByEmail(email: string): Promise<CustomerRecord | null> {
    if (getIsPgConnected()) {
      const rows = await dbQuery<any>(
        `SELECT * FROM customers WHERE LOWER(email) = LOWER($1) LIMIT 1`,
        [email.trim()]
      );
      return rows.length > 0 ? this.formatPgCustomer(rows[0]) : null;
    }

    const found = memoryStore.customers.find(
      (c) => c.email.toLowerCase() === email.trim().toLowerCase()
    );
    if (!found) return null;

    return {
      id: found.id,
      fullName: found.fullName || found.full_name,
      email: found.email,
      phone: found.phone,
      address: found.address,
      city: found.city,
      division: found.division,
      orderCount: Number(found.orderCount ?? found.order_count ?? 1),
      totalSpent: Number(found.totalSpent ?? found.total_spent ?? 0),
      lastOrderDate: found.lastOrderDate || found.last_order_date,
      orders: found.orders || [],
    };
  }

  private formatPgCustomer(row: any): CustomerRecord {
    return {
      id: row.id,
      fullName: row.full_name,
      email: row.email,
      phone: row.phone,
      address: row.address,
      city: row.city,
      orderCount: parseInt(row.order_count, 10),
      totalSpent: parseFloat(row.total_spent),
      lastOrderDate: row.last_order_date,
      orders: [],
    };
  }
}

export const customerRepository = new CustomerRepository();
