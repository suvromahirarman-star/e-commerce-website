import { dbQuery, memoryStore, getIsPgConnected } from '../database/index.js';
import { NotFoundError } from '../utils/errors.js';

export interface ReviewRecord {
  id: string;
  productId: string;
  productName?: string;
  author: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  verified: boolean;
  status: 'Pending' | 'Approved' | 'Rejected';
}

export class ReviewRepository {
  async findAll(options: { status?: string; search?: string; rating?: number } = {}): Promise<ReviewRecord[]> {
    if (getIsPgConnected()) {
      let query = `
        SELECT r.*, p.name as product_name
        FROM reviews r
        LEFT JOIN products p ON r.product_id = p.id
        WHERE 1=1
      `;
      const params: any[] = [];
      let idx = 1;

      if (options.status && options.status.toLowerCase() !== 'all') {
        query += ` AND LOWER(r.status) = $${idx++}`;
        params.push(options.status.toLowerCase());
      }

      if (options.rating) {
        query += ` AND r.rating = $${idx++}`;
        params.push(options.rating);
      }

      if (options.search) {
        query += ` AND (r.author ILIKE $${idx} OR r.title ILIKE $${idx} OR r.comment ILIKE $${idx} OR p.name ILIKE $${idx})`;
        params.push(`%${options.search}%`);
        idx++;
      }

      query += ` ORDER BY r.created_at DESC`;
      const rows = await dbQuery(query, params);
      return rows.map(this.formatPgReview);
    }

    let list = [...memoryStore.reviews];

    if (options.status && options.status.toLowerCase() !== 'all') {
      list = list.filter((r) => (r.status || 'Approved').toLowerCase() === options.status?.toLowerCase());
    }

    if (options.rating) {
      list = list.filter((r) => r.rating === options.rating);
    }

    if (options.search) {
      const q = options.search.toLowerCase();
      list = list.filter((r) => {
        const prod = memoryStore.products.find((p) => p.id === r.productId);
        const prodName = prod?.name || r.productName || '';
        return (
          r.author.toLowerCase().includes(q) ||
          r.title.toLowerCase().includes(q) ||
          r.comment.toLowerCase().includes(q) ||
          prodName.toLowerCase().includes(q)
        );
      });
    }

    // Attach product names for rich rendering
    return list.map((r) => {
      const prod = memoryStore.products.find((p) => p.id === r.productId);
      return {
        ...r,
        productName: prod?.name || r.productName || 'Atelier Product',
        status: (r.status || 'Approved') as any,
      };
    });
  }

  async findById(id: string): Promise<ReviewRecord | null> {
    if (getIsPgConnected()) {
      const rows = await dbQuery(
        `SELECT r.*, p.name as product_name
         FROM reviews r
         LEFT JOIN products p ON r.product_id = p.id
         WHERE r.id = $1 LIMIT 1`,
        [id]
      );
      return rows.length > 0 ? this.formatPgReview(rows[0]) : null;
    }

    const found = memoryStore.reviews.find((r) => r.id === id);
    if (!found) return null;
    const prod = memoryStore.products.find((p) => p.id === found.productId);
    return {
      ...found,
      productName: prod?.name || found.productName || 'Atelier Product',
      status: (found.status || 'Approved') as any,
    };
  }

  async findByProductId(productId: string, onlyApproved = true): Promise<ReviewRecord[]> {
    if (getIsPgConnected()) {
      let query = `
        SELECT r.*, p.name as product_name
        FROM reviews r
        LEFT JOIN products p ON r.product_id = p.id
        WHERE r.product_id = $1
      `;
      const params: any[] = [productId];

      if (onlyApproved) {
        query += ` AND LOWER(r.status) = 'approved'`;
      }
      query += ` ORDER BY r.created_at DESC`;

      const rows = await dbQuery(query, params);
      return rows.map(this.formatPgReview);
    }

    return memoryStore.reviews
      .filter(
        (r) =>
          r.productId === productId &&
          (!onlyApproved || (r.status || 'Approved').toLowerCase() === 'approved')
      )
      .map((r) => {
        const prod = memoryStore.products.find((p) => p.id === r.productId);
        return {
          ...r,
          productName: prod?.name || r.productName || 'Atelier Product',
          status: (r.status || 'Approved') as any,
        };
      })
      .sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime());
  }

  async create(data: {
    productId: string;
    author: string;
    rating: number;
    title: string;
    comment: string;
    status?: 'Pending' | 'Approved' | 'Rejected';
  }): Promise<ReviewRecord> {
    const id = `rev-${Date.now()}`;
    const date = new Date().toISOString().slice(0, 10);
    const initialStatus = data.status || 'Approved';

    if (getIsPgConnected()) {
      const rows = await dbQuery(
        `INSERT INTO reviews (id, product_id, author, rating, title, comment, verified, status)
         VALUES ($1, $2, $3, $4, $5, $6, TRUE, $7)
         RETURNING *`,
        [id, data.productId, data.author, data.rating, data.title, data.comment, initialStatus.toLowerCase()]
      );
      return this.formatPgReview(rows[0]);
    }

    const prod = memoryStore.products.find((p) => p.id === data.productId);
    const newReview: ReviewRecord = {
      id,
      productId: data.productId,
      productName: prod?.name || 'Atelier Product',
      author: data.author,
      rating: data.rating,
      title: data.title,
      comment: data.comment,
      date,
      verified: true,
      status: initialStatus,
    };
    memoryStore.reviews.unshift(newReview);
    return newReview;
  }

  async updateStatus(id: string, status: 'Pending' | 'Approved' | 'Rejected'): Promise<ReviewRecord> {
    if (getIsPgConnected()) {
      const rows = await dbQuery(
        `UPDATE reviews SET status = $1 WHERE id = $2 RETURNING *`,
        [status.toLowerCase(), id]
      );
      if (rows.length === 0) {
        throw new NotFoundError(`Review with ID "${id}" not found`);
      }
      return this.formatPgReview(rows[0]);
    }

    const review = memoryStore.reviews.find((r) => r.id === id);
    if (!review) {
      throw new NotFoundError(`Review with ID "${id}" not found`);
    }
    review.status = status;
    return { ...review };
  }

  async delete(id: string): Promise<boolean> {
    if (getIsPgConnected()) {
      const rows = await dbQuery(`DELETE FROM reviews WHERE id = $1 RETURNING id`, [id]);
      return rows.length > 0;
    }

    const initialLen = memoryStore.reviews.length;
    memoryStore.reviews = memoryStore.reviews.filter((r) => r.id !== id);
    return memoryStore.reviews.length < initialLen;
  }

  private formatPgReview(row: any): ReviewRecord {
    const rawStatus = row.status || 'approved';
    const status =
      rawStatus.charAt(0).toUpperCase() + rawStatus.slice(1).toLowerCase();

    return {
      id: row.id,
      productId: row.product_id,
      productName: row.product_name,
      author: row.author,
      rating: parseInt(row.rating, 10),
      title: row.title,
      comment: row.comment,
      date: row.created_at ? new Date(row.created_at).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
      verified: Boolean(row.verified),
      status: status as any,
    };
  }
}

export const reviewRepository = new ReviewRepository();
