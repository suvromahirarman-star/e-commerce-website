import { productRepository } from '../repositories/product.repository.js';
import { BadRequestError, NotFoundError } from '../utils/errors.js';

export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  image: string;
}

export class InventoryService {
  /**
   * Get all products formatted for the inventory tracker
   */
  async getInventory(filterType = 'all', searchQuery = ''): Promise<InventoryItem[]> {
    const products = await productRepository.findAll({ status: 'all', limit: 200 });

    let items: InventoryItem[] = products.map((p) => {
      const stock = Number(p.stock ?? (p as any).stock_quantity ?? 0);
      let status: 'In Stock' | 'Low Stock' | 'Out of Stock' = 'In Stock';
      if (stock === 0) {
        status = 'Out of Stock';
      } else if (stock <= 10) {
        status = 'Low Stock';
      }

      const image =
        Array.isArray(p.images) && p.images.length > 0
          ? typeof p.images[0] === 'string'
            ? p.images[0]
            : (p.images[0] as any).url || ''
          : '';

      return {
        id: p.id,
        name: p.name,
        sku: p.sku || `SKU-${p.id}`,
        category: p.category || 'Atelier Collection',
        price: p.price,
        stock,
        status,
        image,
      };
    });

    if (searchQuery && searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      items = items.filter(
        (i) => i.name.toLowerCase().includes(q) || i.sku.toLowerCase().includes(q)
      );
    }

    if (filterType && filterType !== 'all') {
      if (filterType === 'critical') {
        items = items.filter((i) => i.stock <= 5);
      } else if (filterType === 'low') {
        items = items.filter((i) => i.stock <= 10);
      } else if (filterType === 'normal') {
        items = items.filter((i) => i.stock > 10);
      }
    }

    return items;
  }

  /**
   * Adjust or set stock quantity
   */
  async updateStock(productId: string, stock: number): Promise<InventoryItem> {
    if (stock < 0) {
      throw new BadRequestError('Stock level cannot be negative.');
    }

    const existing = await productRepository.findById(productId);
    if (!existing) {
      throw new NotFoundError(`Product "${productId}" not found.`);
    }

    const updated = await productRepository.update(productId, { stock });
    const currentStock = updated.stock ?? stock;

    let status: 'In Stock' | 'Low Stock' | 'Out of Stock' = 'In Stock';
    if (currentStock === 0) {
      status = 'Out of Stock';
    } else if (currentStock <= 10) {
      status = 'Low Stock';
    }

    const image =
      Array.isArray(updated.images) && updated.images.length > 0
        ? typeof updated.images[0] === 'string'
          ? updated.images[0]
          : (updated.images[0] as any).url || ''
        : '';

    return {
      id: updated.id,
      name: updated.name,
      sku: updated.sku || `SKU-${updated.id}`,
      category: updated.category || 'Atelier Collection',
      price: updated.price,
      stock: currentStock,
      status,
      image,
    };
  }
}

export const inventoryService = new InventoryService();
