import { dbQuery, memoryStore, getIsPgConnected } from '../database/index.js';

export interface ProductFilterOptions {
  category?: string;
  categorySlug?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  inStock?: boolean;
  size?: string;
  color?: string;
  tag?: string;
  search?: string;
  isFeatured?: boolean;
  isBestseller?: boolean;
  isNewArrival?: boolean;
  isFlashSale?: boolean;
  status?: string;
  sort?: string;
  page?: number;
  limit?: number;
}

export class ProductRepository {
  async findAll(options: ProductFilterOptions = {}) {
    const {
      category,
      categorySlug,
      brand,
      minPrice,
      maxPrice,
      rating,
      inStock,
      size,
      color,
      search,
      isFeatured,
      isBestseller,
      isNewArrival,
      isFlashSale,
      status = 'published',
      sort = 'newest',
      page = 1,
      limit = 24,
    } = options;

    if (getIsPgConnected()) {
      let query = `
        SELECT p.*,
               COALESCE(
                 json_agg(json_build_object('url', pi.url, 'is_primary', pi.is_primary, 'display_order', pi.display_order)
                 ORDER BY pi.display_order ASC) FILTER (WHERE pi.url IS NOT NULL),
                 '[]'
               ) as image_records
        FROM products p
        LEFT JOIN product_images pi ON p.id = pi.product_id
        WHERE 1=1
      `;
      const params: any[] = [];
      let idx = 1;

      if (status && status !== 'all') {
        query += ` AND p.status = $${idx++}`;
        params.push(status);
      }

      if (categorySlug) {
        query += ` AND p.category_slug = $${idx++}`;
        params.push(categorySlug);
      } else if (category && category !== 'all') {
        query += ` AND (p.category_name ILIKE $${idx} OR p.category_slug ILIKE $${idx})`;
        params.push(`%${category}%`);
        idx++;
      }

      if (brand) {
        query += ` AND p.brand ILIKE $${idx++}`;
        params.push(`%${brand}%`);
      }

      if (minPrice !== undefined) {
        query += ` AND p.price >= $${idx++}`;
        params.push(minPrice);
      }

      if (maxPrice !== undefined) {
        query += ` AND p.price <= $${idx++}`;
        params.push(maxPrice);
      }

      if (rating !== undefined) {
        query += ` AND p.rating >= $${idx++}`;
        params.push(rating);
      }

      if (inStock) {
        query += ` AND p.stock_quantity > 0`;
      }

      if (isFeatured !== undefined) {
        query += ` AND p.is_featured = $${idx++}`;
        params.push(isFeatured);
      }

      if (isBestseller !== undefined) {
        query += ` AND p.is_bestseller = $${idx++}`;
        params.push(isBestseller);
      }

      if (isNewArrival !== undefined) {
        query += ` AND p.is_new_arrival = $${idx++}`;
        params.push(isNewArrival);
      }

      if (isFlashSale !== undefined) {
        query += ` AND p.is_flash_sale = $${idx++}`;
        params.push(isFlashSale);
      }

      if (search) {
        query += ` AND (p.name ILIKE $${idx} OR p.brand ILIKE $${idx} OR p.description ILIKE $${idx} OR p.sku ILIKE $${idx})`;
        params.push(`%${search}%`);
        idx++;
      }

      query += ` GROUP BY p.id`;

      // Sorting
      switch (sort) {
        case 'price-asc':
          query += ` ORDER BY p.price ASC`;
          break;
        case 'price-desc':
          query += ` ORDER BY p.price DESC`;
          break;
        case 'rating':
          query += ` ORDER BY p.rating DESC`;
          break;
        case 'popular':
          query += ` ORDER BY p.review_count DESC`;
          break;
        case 'newest':
        default:
          query += ` ORDER BY p.created_at DESC`;
          break;
      }

      const offset = (page - 1) * limit;
      query += ` LIMIT $${idx++} OFFSET $${idx++}`;
      params.push(limit, offset);

      const rows = await dbQuery(query, params);
      return rows.map(this.formatPgProduct);
    }

    // In-memory fallback
    let list = [...memoryStore.products];

    if (status && status !== 'all') {
      list = list.filter((p) => (p.status || 'published').toLowerCase() === status.toLowerCase());
    }

    if (categorySlug) {
      list = list.filter((p) => p.categorySlug === categorySlug);
    } else if (category && category !== 'all') {
      list = list.filter(
        (p) =>
          p.category?.toLowerCase().includes(category.toLowerCase()) ||
          p.categorySlug?.toLowerCase().includes(category.toLowerCase())
      );
    }

    if (brand) {
      list = list.filter((p) => p.brand?.toLowerCase().includes(brand.toLowerCase()));
    }

    if (minPrice !== undefined) {
      list = list.filter((p) => p.price >= minPrice);
    }

    if (maxPrice !== undefined) {
      list = list.filter((p) => p.price <= maxPrice);
    }

    if (rating !== undefined) {
      list = list.filter((p) => (p.rating || 5) >= rating);
    }

    if (inStock) {
      list = list.filter((p) => (p.stock || 0) > 0);
    }

    if (size) {
      list = list.filter((p) => p.sizes && p.sizes.includes(size));
    }

    if (color) {
      list = list.filter(
        (p) => p.colors && p.colors.some((c: any) => c.name.toLowerCase() === color.toLowerCase())
      );
    }

    if (isFeatured !== undefined) {
      list = list.filter((p) => Boolean(p.isFeatured) === isFeatured);
    }

    if (isBestseller !== undefined) {
      list = list.filter((p) => Boolean(p.isBestseller) === isBestseller);
    }

    if (isNewArrival !== undefined) {
      list = list.filter((p) => Boolean(p.isNewArrival) === isNewArrival);
    }

    if (isFlashSale !== undefined) {
      list = list.filter((p) => Boolean(p.isFlashSale) === isFlashSale);
    }

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.sku?.toLowerCase().includes(q)
      );
    }

    switch (sort) {
      case 'price-asc':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'popular':
        list.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
        break;
      case 'newest':
      default:
        // maintain stable default order
        break;
    }

    const startIndex = (page - 1) * limit;
    return list.slice(startIndex, startIndex + limit);
  }

  async findById(id: string) {
    if (getIsPgConnected()) {
      const rows = await dbQuery(
        `SELECT p.*,
                COALESCE(
                  json_agg(json_build_object('url', pi.url, 'is_primary', pi.is_primary, 'display_order', pi.display_order)
                  ORDER BY pi.display_order ASC) FILTER (WHERE pi.url IS NOT NULL),
                  '[]'
                ) as image_records
         FROM products p
         LEFT JOIN product_images pi ON p.id = pi.product_id
         WHERE p.id = $1
         GROUP BY p.id`,
        [id]
      );
      return rows.length > 0 ? this.formatPgProduct(rows[0]) : null;
    }

    return memoryStore.products.find((p) => p.id === id) || null;
  }

  async findBySlug(slug: string) {
    if (getIsPgConnected()) {
      const rows = await dbQuery(
        `SELECT p.*,
                COALESCE(
                  json_agg(json_build_object('url', pi.url, 'is_primary', pi.is_primary, 'display_order', pi.display_order)
                  ORDER BY pi.display_order ASC) FILTER (WHERE pi.url IS NOT NULL),
                  '[]'
                ) as image_records
         FROM products p
         LEFT JOIN product_images pi ON p.id = pi.product_id
         WHERE p.slug = $1
         GROUP BY p.id`,
        [slug]
      );
      return rows.length > 0 ? this.formatPgProduct(rows[0]) : null;
    }

    return memoryStore.products.find((p) => p.slug === slug) || null;
  }

  async create(data: any) {
    const id = data.id || `prod-${Date.now()}`;
    const slug =
      data.slug ||
      data.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    const sku = data.sku || `AUR-ATL-${Math.floor(1000 + Math.random() * 9000)}`;

    if (getIsPgConnected()) {
      const rows = await dbQuery(
        `INSERT INTO products (
          id, name, slug, brand, sku, category_name, category_slug, price, original_price,
          stock_quantity, badge, description, overview, specifications, colors, sizes,
          is_featured, is_bestseller, is_new_arrival, is_flash_sale, status, rating, review_count
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23
        ) RETURNING *`,
        [
          id,
          data.name,
          slug,
          data.brand || 'AURA Atelier',
          sku,
          data.category,
          data.categorySlug,
          data.price,
          data.originalPrice || null,
          data.stock || 0,
          data.badge || null,
          data.description || '',
          data.overview || '',
          JSON.stringify(data.specifications || {}),
          JSON.stringify(data.colors || []),
          JSON.stringify(data.sizes || []),
          Boolean(data.isFeatured),
          Boolean(data.isBestseller),
          Boolean(data.isNewArrival),
          Boolean(data.isFlashSale),
          data.status || 'published',
          5.0,
          0,
        ]
      );

      const images = Array.isArray(data.images) ? data.images : [];
      for (let i = 0; i < images.length; i++) {
        await dbQuery(
          `INSERT INTO product_images (product_id, url, is_primary, display_order)
           VALUES ($1, $2, $3, $4)`,
          [id, images[i], i === 0, i]
        );
      }

      return await this.findById(id);
    }

    const newProd = {
      ...data,
      id,
      slug,
      sku,
      brand: data.brand || 'AURA Atelier',
      images: Array.isArray(data.images) && data.images.length > 0 ? data.images : [],
      colors: data.colors || [],
      sizes: data.sizes || [],
      specifications: data.specifications || {},
      isFeatured: Boolean(data.isFeatured),
      isBestseller: Boolean(data.isBestseller),
      isNewArrival: Boolean(data.isNewArrival),
      isFlashSale: Boolean(data.isFlashSale),
      status: data.status || 'published',
      rating: 5.0,
      reviewCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    memoryStore.products.unshift(newProd);
    return newProd;
  }

  async update(id: string, updateData: any) {
    if (getIsPgConnected()) {
      const existing = await this.findById(id);
      if (!existing) return null;

      const fields: string[] = [];
      const values: any[] = [];
      let idx = 1;

      if (updateData.name !== undefined) {
        fields.push(`name = $${idx++}`);
        values.push(updateData.name);
      }
      if (updateData.slug !== undefined) {
        fields.push(`slug = $${idx++}`);
        values.push(updateData.slug);
      }
      if (updateData.brand !== undefined) {
        fields.push(`brand = $${idx++}`);
        values.push(updateData.brand);
      }
      if (updateData.sku !== undefined) {
        fields.push(`sku = $${idx++}`);
        values.push(updateData.sku);
      }
      if (updateData.category !== undefined) {
        fields.push(`category_name = $${idx++}`);
        values.push(updateData.category);
      }
      if (updateData.categorySlug !== undefined) {
        fields.push(`category_slug = $${idx++}`);
        values.push(updateData.categorySlug);
      }
      if (updateData.price !== undefined) {
        fields.push(`price = $${idx++}`);
        values.push(updateData.price);
      }
      if (updateData.originalPrice !== undefined) {
        fields.push(`original_price = $${idx++}`);
        values.push(updateData.originalPrice);
      }
      if (updateData.stock !== undefined) {
        fields.push(`stock_quantity = $${idx++}`);
        values.push(updateData.stock);
      }
      if (updateData.badge !== undefined) {
        fields.push(`badge = $${idx++}`);
        values.push(updateData.badge);
      }
      if (updateData.description !== undefined) {
        fields.push(`description = $${idx++}`);
        values.push(updateData.description);
      }
      if (updateData.overview !== undefined) {
        fields.push(`overview = $${idx++}`);
        values.push(updateData.overview);
      }
      if (updateData.specifications !== undefined) {
        fields.push(`specifications = $${idx++}`);
        values.push(JSON.stringify(updateData.specifications));
      }
      if (updateData.colors !== undefined) {
        fields.push(`colors = $${idx++}`);
        values.push(JSON.stringify(updateData.colors));
      }
      if (updateData.sizes !== undefined) {
        fields.push(`sizes = $${idx++}`);
        values.push(JSON.stringify(updateData.sizes));
      }
      if (updateData.isFeatured !== undefined) {
        fields.push(`is_featured = $${idx++}`);
        values.push(Boolean(updateData.isFeatured));
      }
      if (updateData.isBestseller !== undefined) {
        fields.push(`is_bestseller = $${idx++}`);
        values.push(Boolean(updateData.isBestseller));
      }
      if (updateData.isNewArrival !== undefined) {
        fields.push(`is_new_arrival = $${idx++}`);
        values.push(Boolean(updateData.isNewArrival));
      }
      if (updateData.isFlashSale !== undefined) {
        fields.push(`is_flash_sale = $${idx++}`);
        values.push(Boolean(updateData.isFlashSale));
      }
      if (updateData.status !== undefined) {
        fields.push(`status = $${idx++}`);
        values.push(updateData.status);
      }

      fields.push(`updated_at = CURRENT_TIMESTAMP`);

      if (fields.length > 1) {
        values.push(id);
        await dbQuery(
          `UPDATE products SET ${fields.join(', ')} WHERE id = $${idx}`,
          values
        );
      }

      if (Array.isArray(updateData.images)) {
        await dbQuery(`DELETE FROM product_images WHERE product_id = $1`, [id]);
        for (let i = 0; i < updateData.images.length; i++) {
          await dbQuery(
            `INSERT INTO product_images (product_id, url, is_primary, display_order)
             VALUES ($1, $2, $3, $4)`,
            [id, updateData.images[i], i === 0, i]
          );
        }
      }

      return await this.findById(id);
    }

    const index = memoryStore.products.findIndex((p) => p.id === id);
    if (index === -1) return null;

    const existing = memoryStore.products[index];
    const updated = {
      ...existing,
      ...updateData,
      updatedAt: new Date().toISOString(),
    };
    memoryStore.products[index] = updated;
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    if (getIsPgConnected()) {
      const res = await dbQuery(`DELETE FROM products WHERE id = $1 RETURNING id`, [id]);
      return res.length > 0;
    }

    const initialLength = memoryStore.products.length;
    memoryStore.products = memoryStore.products.filter((p) => p.id !== id);
    return memoryStore.products.length < initialLength;
  }

  async addImage(productId: string, url: string, storagePath?: string) {
    if (getIsPgConnected()) {
      const countRows = await dbQuery(
        `SELECT COUNT(*)::int as count FROM product_images WHERE product_id = $1`,
        [productId]
      );
      const displayOrder = countRows[0]?.count || 0;
      const isPrimary = displayOrder === 0;

      await dbQuery(
        `INSERT INTO product_images (product_id, url, storage_path, is_primary, display_order)
         VALUES ($1, $2, $3, $4, $5)`,
        [productId, url, storagePath || null, isPrimary, displayOrder]
      );

      return await this.findById(productId);
    }

    const product = memoryStore.products.find((p) => p.id === productId);
    if (product) {
      product.images = product.images || [];
      product.images.push(url);
    }
    return product;
  }

  async reorderImages(productId: string, imageUrls: string[]) {
    if (getIsPgConnected()) {
      for (let i = 0; i < imageUrls.length; i++) {
        await dbQuery(
          `UPDATE product_images
           SET display_order = $1, is_primary = $2
           WHERE product_id = $3 AND url = $4`,
          [i, i === 0, productId, imageUrls[i]]
        );
      }
      return await this.findById(productId);
    }

    const product = memoryStore.products.find((p) => p.id === productId);
    if (product) {
      product.images = imageUrls;
    }
    return product;
  }

  async removeImage(productId: string, imageUrl: string) {
    if (getIsPgConnected()) {
      await dbQuery(
        `DELETE FROM product_images WHERE product_id = $1 AND url = $2`,
        [productId, imageUrl]
      );
      return await this.findById(productId);
    }

    const product = memoryStore.products.find((p) => p.id === productId);
    if (product && product.images) {
      product.images = product.images.filter((img: string) => img !== imageUrl);
    }
    return product;
  }

  private formatPgProduct(row: any) {
    const images = Array.isArray(row.image_records) && row.image_records.length > 0
      ? row.image_records.map((img: any) => img.url)
      : (row.images || []);

    return {
      id: row.id,
      name: row.name,
      slug: row.slug,
      brand: row.brand,
      sku: row.sku,
      category: row.category_name,
      categorySlug: row.category_slug,
      price: parseFloat(row.price),
      originalPrice: row.original_price ? parseFloat(row.original_price) : null,
      stock: parseInt(row.stock_quantity, 10),
      badge: row.badge,
      description: row.description,
      overview: row.overview,
      specifications: typeof row.specifications === 'string' ? JSON.parse(row.specifications) : row.specifications,
      colors: typeof row.colors === 'string' ? JSON.parse(row.colors) : row.colors,
      sizes: typeof row.sizes === 'string' ? JSON.parse(row.sizes) : row.sizes,
      isFeatured: row.is_featured,
      isBestseller: row.is_bestseller,
      isNewArrival: row.is_new_arrival,
      isFlashSale: row.is_flash_sale,
      status: row.status,
      rating: parseFloat(row.rating),
      reviewCount: parseInt(row.review_count, 10),
      images,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}

export const productRepository = new ProductRepository();
