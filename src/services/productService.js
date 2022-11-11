<<<<<<< HEAD
import { productModel } from '../db';
import { BadRequestError } from '../utils'
=======
import { productModel, categoryModel } from '../db/index.js';
import { BadRequestError } from '../utils/index.js';
>>>>>>> dev

class ProductService {
  constructor(productModel) {
    this.productModel = productModel;
  }

  async getAllProducts() {
<<<<<<< HEAD
    const products = await this.productModel.findProducts();
    return products;
=======
    return await this.productModel.findProducts();
>>>>>>> dev
  }

  async getProduct(productId) {
    const product = await this.productModel.findOneProduct(productId);
    if (!product) {
      throw new BadRequestError('존재하지 않는 상품입니다.');
    }
    return product;
  }

  async getProductsByCategory(id) {
    const category = await this.productModel.findCategory(id);
    if (!category) {
      throw new BadRequestError('존재하지 않는 카테고리입니다.');
    }
<<<<<<< HEAD
    const productsByCategory = await productModel.findProducts({ category })
    return productsByCategory;
  }

  async searchProducts(title) {
    const searchedProducts = await this.productModel.findProductsByTitle(decodeURI(decodeURIComponent(title)));
    return searchedProducts
=======
    return await this.productModel.findProducts({ category });
  }

  async searchProducts(title) {
    return await this.productModel.findProductsByTitle(
      decodeURI(decodeURIComponent(title))
    );
  }

  async createComment(productId, comment) {
    // await this.productModel.updateProduct(id, { $push: { comments: comment } })
    const product = await this.productModel.findOneProduct(productId);

    if (!product) {
      throw new BadRequestError('존재하지 않는 상품입니다.');
    }

    if (product.comments) {
      product.comments.push(comment);
    } else {
      product.comments = [comment];
    }

    return await product.save();
  }

  async updateComment(productId, commentId, comment) {
    const product = await this.productModel.findOneProduct(productId);

    if (!product) {
      throw new BadRequestError('존재하지 않는 상품입니다.');
    }

    const foundedComment = product.comments.find(
      (comment) => comment._id == commentId
    );

    if (!foundedComment) {
      throw new BadRequestError('존재하지 않는 리뷰입니다.');
    }

    const { content, rating } = comment;
    foundedComment.content = content;
    foundedComment.rating = rating;

    return await product.save();
  }

  async deleteComment(productId, commentId) {
    const product = await this.productModel.findOneProduct(productId);

    if (!product) {
      throw new BadRequestError('존재하지 않는 상품입니다.');
    }

    const foundedCommentIndex = product.comments.findIndex(
      (comment) => comment._id == commentId
    );

    if (foundedCommentIndex < 0) {
      throw new BadRequestError('존재하지 않는 리뷰입니다.');
    }

    product.comments.splice(foundedCommentIndex, 1);

    await product.save();
>>>>>>> dev
  }
}

const productService = new ProductService(productModel);

export { productService };
