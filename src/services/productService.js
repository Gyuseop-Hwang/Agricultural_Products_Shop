import { productModel } from '../db';
import { AppError } from '../utils'

class ProductService {
  constructor(productModel) {
    this.productModel = productModel;
  }

  async getAllProducts() {
    const products = await this.productModel.findProducts();
    return products;
  }

  async getProduct(productId) {
    const product = await this.productModel.findOneProduct(productId);
    if (!product) {
      throw new AppError(404, "상품을 찾을 수 없습니다.")
    }
    return product;
  }

  async getProductsByCategory(id) {
    const category = await this.productModel.findCategory(id);
    if (!category) {
      throw new AppError(404, '존재하지 않는 카테고리입니다.')
    }
    const productsByCategory = await productModel.findProducts({ category })
    return productsByCategory;
  }

  async searchProducts(title) {
    const searchedProducts = await this.productModel.findProductsByTitle(title);
    return searchedProducts
  }

}

const productService = new ProductService(productModel);

export { productService };


