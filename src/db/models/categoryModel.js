import { model } from 'mongoose';
import { CategorySchema } from '../schemas/categorySchema.js';

const Category = model('Category', CategorySchema);

export class CategoryModel {
  async findCategory(id) {
    return await Category.findById(id);
  }

  async findAllCategories() {
    return await Category.find({});
  }

  async createCategory(categoryInfo) {
    return await Category.create({ ...categoryInfo });
  }

  async updateCategory(name, update) {
    return await Category.findOneAndUpdate({ name }, update, {
      returnOriginal: false,
    });
  }

  async deleteCategory(id) {
    return await Category.findByIdAndDelete(id);
  }
}

const categoryModel = new CategoryModel();

export { categoryModel };
