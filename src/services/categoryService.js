import { categoryModel } from '../db';

class CategoryService {
    constructor(categoryModel) {
        this.categoryModel = categoryModel;
    }

    async addCategory(categoryInfo) {
        const createdCategory = await this.categoryModel.create(categoryInfo);
        return createdCategory;
    }
}

const categoryService = new CategoryService(categoryModel);

export { categoryService };
