import { dbQuery, memoryStore, getIsPgConnected } from '../database/index.js';
import { NotFoundError } from '../utils/errors.js';

export interface CouponRecord {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minSpend: number;
  expiryDate: string;
  usageLimit: number | null;
  timesUsed: number;
  active: boolean;
}

export class CouponRepository {
  async findAll(): Promise<CouponRecord[]> {
    if (getIsPgConnected()) {
      const rows = await dbQuery(`SELECT * FROM coupons ORDER BY created_at DESC`);
      return rows.map(this.formatPgCoupon);
    }
    return memoryStore.coupons.map((c) => ({ ...c }));
  }

  async findById(id: string): Promise<CouponRecord | null> {
    if (getIsPgConnected()) {
      const rows = await dbQuery(`SELECT * FROM coupons WHERE id = $1 LIMIT 1`, [id]);
      return rows.length > 0 ? this.formatPgCoupon(rows[0]) : null;
    }
    const found = memoryStore.coupons.find((c) => c.id === id);
    return found ? { ...found } : null;
  }

  async findByCode(code: string): Promise<CouponRecord | null> {
    const cleanCode = code.trim().toUpperCase();

    if (getIsPgConnected()) {
      const rows = await dbQuery(
        `SELECT * FROM coupons WHERE UPPER(code) = $1 LIMIT 1`,
        [cleanCode]
      );
      return rows.length > 0 ? this.formatPgCoupon(rows[0]) : null;
    }

    const found = memoryStore.coupons.find(
      (c) => c.code.toUpperCase() === cleanCode
    );
    return found ? { ...found } : null;
  }

  async create(data: {
    code: string;
    type: 'percentage' | 'fixed';
    value: number;
    minSpend?: number;
    expiryDate: string;
    usageLimit?: number | null;
    active?: boolean;
  }): Promise<CouponRecord> {
    const id = `coup-${Date.now()}`;
    const cleanCode = data.code.trim().toUpperCase();
    const minSpend = data.minSpend !== undefined ? data.minSpend : 0;
    const usageLimit = data.usageLimit !== undefined ? data.usageLimit : null;
    const active = data.active !== undefined ? data.active : true;

    if (getIsPgConnected()) {
      const rows = await dbQuery(
        `INSERT INTO coupons (
          id, code, discount_type, discount_value, minimum_order, expiry_date, usage_limit, is_active
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *`,
        [id, cleanCode, data.type, data.value, minSpend, data.expiryDate, usageLimit, active]
      );
      return this.formatPgCoupon(rows[0]);
    }

    const newCoupon: CouponRecord = {
      id,
      code: cleanCode,
      type: data.type,
      value: data.value,
      minSpend,
      expiryDate: data.expiryDate,
      usageLimit,
      timesUsed: 0,
      active,
    };
    memoryStore.coupons.unshift(newCoupon);
    return newCoupon;
  }

  async update(id: string, updates: Partial<CouponRecord>): Promise<CouponRecord> {
    if (getIsPgConnected()) {
      const existing = await this.findById(id);
      if (!existing) {
        throw new NotFoundError(`Coupon with ID "${id}" not found`);
      }

      const fields: string[] = [];
      const params: any[] = [];
      let idx = 1;

      if (updates.code !== undefined) {
        fields.push(`code = $${idx++}`);
        params.push(updates.code.trim().toUpperCase());
      }
      if (updates.type !== undefined) {
        fields.push(`discount_type = $${idx++}`);
        params.push(updates.type);
      }
      if (updates.value !== undefined) {
        fields.push(`discount_value = $${idx++}`);
        params.push(updates.value);
      }
      if (updates.minSpend !== undefined) {
        fields.push(`minimum_order = $${idx++}`);
        params.push(updates.minSpend);
      }
      if (updates.expiryDate !== undefined) {
        fields.push(`expiry_date = $${idx++}`);
        params.push(updates.expiryDate);
      }
      if (updates.usageLimit !== undefined) {
        fields.push(`usage_limit = $${idx++}`);
        params.push(updates.usageLimit);
      }
      if (updates.active !== undefined) {
        fields.push(`is_active = $${idx++}`);
        params.push(updates.active);
      }

      fields.push(`updated_at = CURRENT_TIMESTAMP`);
      params.push(id);

      const rows = await dbQuery(
        `UPDATE coupons SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`,
        params
      );
      return this.formatPgCoupon(rows[0]);
    }

    const index = memoryStore.coupons.findIndex((c) => c.id === id);
    if (index === -1) {
      throw new NotFoundError(`Coupon with ID "${id}" not found`);
    }

    const updated = {
      ...memoryStore.coupons[index],
      ...updates,
      ...(updates.code ? { code: updates.code.trim().toUpperCase() } : {}),
    };
    memoryStore.coupons[index] = updated;
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    if (getIsPgConnected()) {
      const rows = await dbQuery(`DELETE FROM coupons WHERE id = $1 RETURNING id`, [id]);
      return rows.length > 0;
    }

    const initialLength = memoryStore.coupons.length;
    memoryStore.coupons = memoryStore.coupons.filter((c) => c.id !== id);
    return memoryStore.coupons.length < initialLength;
  }

  async incrementUsage(code: string) {
    const cleanCode = code.trim().toUpperCase();

    if (getIsPgConnected()) {
      await dbQuery(
        `UPDATE coupons SET times_used = times_used + 1 WHERE UPPER(code) = $1`,
        [cleanCode]
      );
      return;
    }

    const coupon = memoryStore.coupons.find((c) => c.code.toUpperCase() === cleanCode);
    if (coupon) {
      coupon.timesUsed = (coupon.timesUsed || 0) + 1;
    }
  }

  private formatPgCoupon(row: any): CouponRecord {
    return {
      id: row.id,
      code: row.code,
      type: row.discount_type,
      value: parseFloat(row.discount_value),
      minSpend: parseFloat(row.minimum_order || '0'),
      expiryDate: row.expiry_date,
      usageLimit: row.usage_limit ? parseInt(row.usage_limit, 10) : null,
      timesUsed: parseInt(row.times_used || row.usage_count || '0', 10),
      active: Boolean(row.is_active),
    };
  }
}

export const couponRepository = new CouponRepository();
