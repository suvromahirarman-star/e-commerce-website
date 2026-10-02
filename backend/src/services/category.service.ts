import { categoryRepository } from '../repositories/category.repository.js';
import { NotFoundError } from '../utils/errors.js';

export class CategoryService {
  async getCategories(activeOnly = true) {
    return await categoryRepository.findAll(activeOnly);
  }

  async getCategoryBySlug(slug: string) {
    const category = await categoryRepository.findBySlug(slug);
    if (!category) {
      throw new NotFoundError(`Category with slug '${slug}' not found`);
    }
    return category;
  }

  // --- Admin Methods ---

  async createCategory(categoryData: any) {
    return await categoryRepository.create(categoryData);
  }

  async updateCategory(id: string, updateData: any) {
    const existing = await categoryRepository.findById(id);
    if (!existing) {
      throw new NotFoundError(`Category with ID '${id}' not found`);
    }
    return await categoryRepository.update(id, updateData);
  }

  async deleteCategory(id: string) {
    const existing = await categoryRepository.findById(id);
    if (!existing) {
      throw new NotFoundError(`Category with ID '${id}' not found`);
    }
    return await categoryRepository.delete(id);
  }
}

export const categoryService = new CategoryService();
