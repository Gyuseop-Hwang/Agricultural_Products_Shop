import { model } from 'mongoose';
import { CategorySchema } from '../schemas/categorySchema.js';

class CategoryModel {
    constructor(Category) {
        this.Category = Category;
    }

<<<<<<< HEAD
    async create(catetoryInfo) {
        const createdCategory = await this.Category.create(catetoryInfo);
        return createdCategory;
    }

    async findAll() {
        const categories = await Category.find({});
        return categories;
    }

    async update(categoryId, catetoryInfo) {
        const filter = { _id: categoryId };
        const option = { ...catetoryInfo };

        const updatedCategory = await Category.findOneAndUpdate(
            filter,
            option,
            { new: true }
        );
        return updatedCategory;
    }

    async delete(categoryId) {
        const filter = { _id: categoryId };
        const deletedCategory = await Category.findOneAndDelete(filter);
        return deletedCategory;
    }
=======
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
>>>>>>> dev
}

const categoryModel = new CategoryModel(model('Category', CategorySchema));

export { categoryModel };
