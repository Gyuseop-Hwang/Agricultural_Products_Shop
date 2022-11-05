import { model } from 'mongoose';
import { CategorySchema } from '../schemas/categorySchema';

class CategoryModel {
  constructor(Category) {
    this.Category = Category;
  }

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
}

const categoryModel = new CategoryModel(model('Category', CategorySchema));

export { categoryModel };