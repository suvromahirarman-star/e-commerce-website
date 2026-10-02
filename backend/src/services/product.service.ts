import { productRepository, ProductFilterOptions } from '../repositories/product.repository.js';
import { storageService } from '../config/supabase.js';
import { NotFoundError, BadRequestError } from '../utils/errors.js';

export class ProductService {
  async getProducts(options: ProductFilterOptions = {}) {
    return await productRepository.findAll(options);
  }

  async getProductById(id: string) {
    const product = await productRepository.findById(id);
    if (!product) {
      throw new NotFoundError(`Product with ID '${id}' not found`);
    }
    return product;
  }

  async getProductBySlug(slug: string) {
    const product = await productRepository.findBySlug(slug);
    if (!product) {
      throw new NotFoundError(`Product with slug '${slug}' not found`);
    }
    return product;
  }

  async getFeaturedProducts(limit = 8) {
    return await productRepository.findAll({ isFeatured: true, limit, status: 'published' });
  }

  async getBestsellers(limit = 8) {
    return await productRepository.findAll({ isBestseller: true, limit, status: 'published' });
  }

  async getNewArrivals(limit = 8) {
    return await productRepository.findAll({ isNewArrival: true, limit, status: 'published' });
  }

  async getFlashSaleProducts(limit = 8) {
    return await productRepository.findAll({ isFlashSale: true, limit, status: 'published' });
  }

  // --- Admin Methods ---

  async createProduct(productData: any) {
    return await productRepository.create(productData);
  }

  async updateProduct(id: string, updateData: any) {
    const existing = await productRepository.findById(id);
    if (!existing) {
      throw new NotFoundError(`Cannot update non-existent product with ID '${id}'`);
    }
    return await productRepository.update(id, updateData);
  }

  async deleteProduct(id: string) {
    const existing = await productRepository.findById(id);
    if (!existing) {
      throw new NotFoundError(`Cannot delete non-existent product with ID '${id}'`);
    }
    return await productRepository.delete(id);
  }

  async uploadProductImage(
    productId: string,
    fileBuffer: Buffer,
    fileName: string,
    mimeType: string
  ) {
    const product = await productRepository.findById(productId);
    if (!product) {
      throw new NotFoundError(`Product with ID '${productId}' not found`);
    }

    const { url, storagePath } = await storageService.uploadProductImage(
      fileBuffer,
      fileName,
      mimeType
    );

    const updatedProduct = await productRepository.addImage(productId, url, storagePath);
    return {
      product: updatedProduct,
      image: { url, storagePath },
    };
  }

  async reorderProductImages(productId: string, imageUrls: string[]) {
    const product = await productRepository.findById(productId);
    if (!product) {
      throw new NotFoundError(`Product with ID '${productId}' not found`);
    }

    if (!Array.isArray(imageUrls) || imageUrls.length === 0) {
      throw new BadRequestError('Must provide a valid array of image URLs to reorder');
    }

    return await productRepository.reorderImages(productId, imageUrls);
  }

  async deleteProductImage(productId: string, imageUrl: string, storagePath?: string) {
    const product = await productRepository.findById(productId);
    if (!product) {
      throw new NotFoundError(`Product with ID '${productId}' not found`);
    }

    if (storagePath) {
      await storageService.deleteProductImage(storagePath);
    }

    return await productRepository.removeImage(productId, imageUrl);
  }
}

export const productService = new ProductService();
