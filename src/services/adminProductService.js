import { productModel, categoryModel } from '../db/index.js';
import { BadRequestError } from '../utils/index.js';
import { cloudinary } from '../cloudinary/index.js';

class AdminProductService {
  constructor(productModel) {
    this.productModel = productModel;
  }

  async createProduct(productInfo) {
    const { category: categoryId } = productInfo;
    const category = await categoryModel.findCategory(categoryId);

    if (!category) {
      throw new BadRequestError('존재하지 않는 카테고리입니다.');
    }

    category.total++;
    await category.save();

    return await this.productModel.createProduct(productInfo);
  }

  async updateProduct(productId, update) {
    const product = await this.productModel.findOneProduct(productId);

    if (!product) {
      throw new BadRequestError('존재하지 않는 상품입니다.');
    }

    const { category } = update;
    const categoryDoc = await categoryModel.findCategory(category);

    if (!categoryDoc) {
      throw new BadRequestError('존재하지 않는 카테고리입니다.');
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

    return await this.productModel.updateProduct(productId, update);
  }

  async deleteProduct(productId) {
    const product = await this.productModel.findOneProduct(productId);

    if (!product) {
      throw new BadRequestError('존재하지 않는 상품입니다.');
    }

    if (product.image.filename) {
      await cloudinary.uploader.destroy(product.image.filename);
    }

    const category = await categoryModel.findCategory(product.category._id);
    category.total--;
    await category.save();

    return await this.productModel.deleteProduct(productId);
  }

  async toggleSale(productId, discountedPrice) {
    const product = await this.productModel.findOneProduct(productId);

    if (!product) {
      throw new BadRequestError('존재하지 않는 상품입니다.');
    }

    if (!isNaN(discountedPrice)) {
      if (discountedPrice >= product.price) {
        throw new BadRequestError(
          '할인 가격은 현재 상품의 가격보다 낮아야 합니다.'
        );
      }

      product.sale.onSale = true;
      product.sale.discountedPrice = discountedPrice;
      return await product.save();
    }
    if (discountedPrice === 'cancel') {
      product.sale.onSale = false;
      return await product.save();
    } else {
      throw new BadRequestError(
        '가격을 올바른 숫자 string이나 "cancel"로 입력해주세요.'
      );
    }
  }
}

const adminProductService = new AdminProductService(productModel);

export { adminProductService };
