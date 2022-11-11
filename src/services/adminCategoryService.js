import { productModel, categoryModel } from '../db/index.js';
import { BadRequestError } from '../utils/index.js';

class AdminCategoryService {
  constructor(categoryModel) {
    this.categoryModel = categoryModel;
  }

  async getAllCategories() {
    return await this.categoryModel.findAllCategories();
  }

  async createCategory(name) {
    const categoryDocs = await this.categoryModel.findAllCategories();
    const categories = categoryDocs.map((category) => category.name);

    if (categories.includes(name)) {
      throw new BadRequestError('이미 존재하고 있는 카테고리입니다.');
    }

    return await this.categoryModel.createCategory({ name });
  }

  async updateCategory(id, update) {
    const category = await this.categoryModel.findCategory(id);

    if (!category) {
      throw new BadRequestError('존재하지 않는 카테고리입니다.');
    }

    const categorieDocs = await this.categoryModel.findAllCategories();
    const categories = categorieDocs.map((category) => category.name);
    const { name } = update;

    if (categories.includes(name)) {
      throw new BadRequestError('이미 존재하고 있는 카테고리입니다.');
    }

    return await this.categoryModel.updateCategory(category.name, update);
  }

  async deleteCategory(id) {
    const category = await this.categoryModel.findCategory(id);

    if (!category) {
      throw new BadRequestError('존재하지 않는 카테고리입니다.');
    }

    const products = await productModel.findProducts({ category });

    if (products.length > 0) {
      throw new BadRequestError(
        '이미 카테고리가 등록된 상품이 존재하여 현재 대상 카테고리를 삭제할 수 없습니다.'
      );
    }

    return await this.categoryModel.deleteCategory(id);
  }
}

const adminCategoryService = new AdminCategoryService(categoryModel);

export { adminCategoryService };
