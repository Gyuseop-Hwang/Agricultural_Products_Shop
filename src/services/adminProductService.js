import { productModel, categoryModel } from '../db';
import { BadRequestError } from '../utils'
import { cloudinary } from '../cloudinary';

class AdminProductService {

  constructor(productModel) {
    this.productModel = productModel;
  }

  async createProduct(productInfo) {

    const { category: categoryId } = productInfo
    const category = await categoryModel.findCategory(categoryId);

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
    const categoryDoc = await categoryModel.findCategory(category)

    if (!categoryDoc) {
      throw new BadRequestError("존재하지 않는 카테고리입니다.")
    }

    if (update.image && product.image.filename) {
      await cloudinary.uploader.destroy(product.image.filename);
    }

    const oldCategory = await categoryModel.findCategory(product.category._id);
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

    const category = await categoryModel.findCategory(product.category._id);
    category.total--;
    await category.save();

    return await this.productModel.deleteProduct(productId);
  }

}

const adminProductService = new AdminProductService(productModel);

export { adminProductService };