import { dbQuery, memoryStore, getIsPgConnected } from '../database/index.js';

export class CategoryRepository {
  async findAll(activeOnly = true) {
    if (getIsPgConnected()) {
      let query = `
        SELECT c.*,
               COUNT(p.id)::int as item_count
        FROM categories c
        LEFT JOIN products p ON c.id = p.category_id AND p.status = 'published'
      `;
      if (activeOnly) {
        query += ` WHERE c.is_active = TRUE`;
      }
      query += ` GROUP BY c.id ORDER BY c.display_order ASC, c.name ASC`;
      const rows = await dbQuery(query);
      return rows.map(this.formatPgCategory);
    }

    let list = [...memoryStore.categories];
    if (activeOnly) {
      list = list.filter((c) => c.isActive !== false);
    }
    // Calculate itemCount dynamically from products
    return list.map((c) => {
      const count = memoryStore.products.filter(
        (p) => (p.categorySlug === c.slug || p.category === c.name) && p.status === 'published'
      ).length;
      return {
        ...c,
        itemCount: count || c.itemCount || 0,
      };
    });
  }

  async findBySlug(slug: string) {
    if (getIsPgConnected()) {
      const rows = await dbQuery(
        `SELECT c.*, COUNT(p.id)::int as item_count
         FROM categories c
         LEFT JOIN products p ON c.id = p.category_id AND p.status = 'published'
         WHERE c.slug = $1
         GROUP BY c.id`,
        [slug]
      );
      return rows.length > 0 ? this.formatPgCategory(rows[0]) : null;
    }

    const found = memoryStore.categories.find((c) => c.slug === slug);
    if (!found) return null;
    const count = memoryStore.products.filter(
      (p) => (p.categorySlug === found.slug || p.category === found.name) && p.status === 'published'
    ).length;
    return { ...found, itemCount: count || found.itemCount || 0 };
  }

  async findById(id: string) {
    if (getIsPgConnected()) {
      const rows = await dbQuery(
        `SELECT c.*, COUNT(p.id)::int as item_count
         FROM categories c
         LEFT JOIN products p ON c.id = p.category_id AND p.status = 'published'
         WHERE c.id = $1
         GROUP BY c.id`,
        [id]
      );
      return rows.length > 0 ? this.formatPgCategory(rows[0]) : null;
    }
    return memoryStore.categories.find((c) => c.id === id) || null;
  }

  async create(data: any) {
    const id = data.id || `cat-${Date.now()}`;
    const slug =
      data.slug ||
      data.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    if (getIsPgConnected()) {
      const rows = await dbQuery(
        `INSERT INTO categories (id, name, slug, tagline, description, image, is_active, featured, display_order)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         RETURNING *`,
        [
          id,
          data.name,
          slug,
          data.tagline || '',
          data.description || '',
          data.image || null,
          data.isActive !== false,
          Boolean(data.featured),
          data.displayOrder || 0,
        ]
      );
      return this.formatPgCategory(rows[0]);
    }

    const newCategory = {
      ...data,
      id,
      slug,
      tagline: data.tagline || '',
      description: data.description || '',
      image: data.image || '',
      isActive: data.isActive !== false,
      featured: Boolean(data.featured),
      displayOrder: data.displayOrder || 0,
      itemCount: 0,
    };
    memoryStore.categories.push(newCategory);
    return newCategory;
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
      if (updateData.tagline !== undefined) {
        fields.push(`tagline = $${idx++}`);
        values.push(updateData.tagline);
      }
      if (updateData.description !== undefined) {
        fields.push(`description = $${idx++}`);
        values.push(updateData.description);
      }
      if (updateData.image !== undefined) {
        fields.push(`image = $${idx++}`);
        values.push(updateData.image);
      }
      if (updateData.isActive !== undefined) {
        fields.push(`is_active = $${idx++}`);
        values.push(updateData.isActive);
      }
      if (updateData.featured !== undefined) {
        fields.push(`featured = $${idx++}`);
        values.push(Boolean(updateData.featured));
      }
      if (updateData.displayOrder !== undefined) {
        fields.push(`display_order = $${idx++}`);
        values.push(updateData.displayOrder);
      }

      fields.push(`updated_at = CURRENT_TIMESTAMP`);
      values.push(id);

      await dbQuery(
        `UPDATE categories SET ${fields.join(', ')} WHERE id = $${idx}`,
        values
      );
      return await this.findById(id);
    }

    const index = memoryStore.categories.findIndex((c) => c.id === id);
    if (index === -1) return null;
    const updated = { ...memoryStore.categories[index], ...updateData };
    memoryStore.categories[index] = updated;
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    if (getIsPgConnected()) {
      const res = await dbQuery(`DELETE FROM categories WHERE id = $1 RETURNING id`, [id]);
      return res.length > 0;
    }

    const initialLen = memoryStore.categories.length;
    memoryStore.categories = memoryStore.categories.filter((c) => c.id !== id);
    return memoryStore.categories.length < initialLen;
  }

  private formatPgCategory(row: any) {
    return {
      id: row.id,
      name: row.name,
      slug: row.slug,
      tagline: row.tagline,
      description: row.description,
      image: row.image,
      itemCount: parseInt(row.item_count, 10) || 0,
      featured: row.featured,
      isActive: row.is_active,
      displayOrder: row.display_order,
    };
  }
}

export const categoryRepository = new CategoryRepository();
