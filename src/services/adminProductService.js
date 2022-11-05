import { productModel } from '../db';
import { BadRequestError } from '../utils'
import { cloudinary } from '../cloudinary';

class AdminProductService {

  constructor(productModel) {
    this.productModel = productModel;
  }

  async createProduct(id, productInfo) {
    const category = await this.productModel.findCategory(id);
    if (!category) {
      throw new BadRequestError('존재하지 않는 카테고리입니다.')
    }
    category.total++;
    await category.save();
    return await this.productModel.createProduct(productInfo)
  }

  async updateProduct(productId, update) {
    const product = await this.productModel.findOneProduct(productId);
    if (!product) {
      throw new BadRequestError("존재하지 않는 상품입니다.")
    }
    const { category } = update;
    const categoryDoc = await this.productModel.findCategory(category)
    if (!categoryDoc) {
      throw new BadRequestError("존재하지 않는 카테고리입니다.")
    }
    if (update.image && product.image.filename) {
      await cloudinary.uploader.destroy(product.image.filename);
    }
    const oldCategory = await this.productModel.findCategory(product.category._id);
    oldCategory.total--;
    await oldCategory.save();
    categoryDoc.total++;
    await categoryDoc.save();
    update.category = categoryDoc;
    return await this.productModel.updateProduct(productId, update)
  }

  async deleteProduct(productId) {
    const product = await this.productModel.findOneProduct(productId);
    if (!product) {
      throw new BadRequestError('존재하지 않는 상품입니다.')
    }
    if (product.image.filename) {
      await cloudinary.uploader.destroy(product.image.filename);
    }
    const category = await this.productModel.findCategory(product.category._id);
    category.total--;
    await category.save();
    await this.productModel.deleteProduct(productId);
  }

  async getAllCategories() {
    return await this.productModel.findAllCategories();
  }

  async createCategory(name) {
    const categorieDocs = await this.productModel.findAllCategories()
    const categories = categorieDocs.map(category => category.name)
    if (categories.includes(name)) {
      throw new BadRequestError("이미 존재하고 있는 카테고리입니다.")
    }
    return await this.productModel.createCategory(name);
  }

  async updateCategory(id, update) {
    const category = await this.productModel.findCategory(id);
    if (!category) {
      throw new BadRequestError("존재하지 않는 카테고리입니다.")
    }
    const { name } = update;
    const categorieDocs = await this.productModel.findAllCategories()
    const categories = categorieDocs.map(category => category.name)
    if (categories.includes(name)) {
      throw new BadRequestError("이미 존재하고 있는 카테고리입니다.")
    }
    return await this.productModel.updateCategory(category.name, update);
  }

  async deleteCategory(id) {
    const category = await this.productModel.findCategory(id);
    if (!category) {
      throw new BadRequestError("존재하지 않는 카테고리입니다.")
    }
    const products = await this.productModel.findProducts({ category });
    if (products.length > 0) {
      throw new BadRequestError('이미 카테고리가 등록된 상품이 존재하여 현재 대상 카테고리를 삭제할 수 없습니다.')
    }
    await this.productModel.deleteCategory(id)
  }
}

const adminProductService = new AdminProductService(productModel);

export { adminProductService };