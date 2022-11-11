<<<<<<< HEAD
import { productModel } from '../db';
import { BadRequestError } from '../utils'
=======
import { productModel, categoryModel } from '../db/index.js';
import { BadRequestError } from '../utils/index.js';
import { cloudinary } from '../cloudinary/index.js';
>>>>>>> dev

class AdminProductService {
  constructor(productModel) {
    this.productModel = productModel;
  }

<<<<<<< HEAD
  async createProduct(id, productInfo) {
    const category = await this.productModel.findCategory(id);
=======
  async createProduct(productInfo) {
    const { category: categoryId } = productInfo;
    const category = await categoryModel.findCategory(categoryId);

>>>>>>> dev
    if (!category) {
      throw new BadRequestError('존재하지 않는 카테고리입니다.');
    }
    category.total++;
    await category.save();
<<<<<<< HEAD
    const createdProduct = await this.productModel.createProduct(productInfo)
    return createdProduct
=======

    return await this.productModel.createProduct(productInfo);
>>>>>>> dev
  }

  async updateProduct(productId, update) {
    const product = await this.productModel.findOneProduct(productId);
    if (!product) {
      throw new BadRequestError('존재하지 않는 상품입니다.');
    }
    const { category } = update;
<<<<<<< HEAD
    const categoryDoc = await this.productModel.findCategory(category)
=======
    const categoryDoc = await categoryModel.findCategory(category);

>>>>>>> dev
    if (!categoryDoc) {
      throw new BadRequestError('존재하지 않는 카테고리입니다.');
    }
    const oldCategory = await this.productModel.findCategory(product.category._id);
    oldCategory.total--;
    await oldCategory.save();
    categoryDoc.total++;
    await categoryDoc.save();
    update.category = categoryDoc;
<<<<<<< HEAD
    const newProduct = await this.productModel.updateProduct(productId, update)
    return newProduct;
=======

    return await this.productModel.updateProduct(productId, update);
>>>>>>> dev
  }

  async deleteProduct(productId) {
    const product = await this.productModel.findOneProduct(productId);
    if (!product) {
      throw new BadRequestError('존재하지 않는 상품입니다.');
    }
    const category = await this.productModel.findCategory(product.category._id);
    category.total--;
    await category.save();
    await this.productModel.deleteProduct(productId);
  }

<<<<<<< HEAD
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
=======
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
>>>>>>> dev
}

const adminProductService = new AdminProductService(productModel);

export { adminProductService };
