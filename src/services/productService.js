import { productModel } from '../db';
import { BadRequestError } from '../utils'

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
      throw new BadRequestError("존재하지 않는 상품입니다.")
    }
    return product;
  }

  async getProductsByCategory(id) {
    const category = await this.productModel.findCategory(id);
    if (!category) {
      throw new BadRequestError('존재하지 않는 카테고리입니다.')
    }
    const productsByCategory = await productModel.findProducts({ category })
    return productsByCategory;
  }

  async searchProducts(title) {
    const searchedProducts = await this.productModel.findProductsByTitle(decodeURI(decodeURIComponent(title)));
    return searchedProducts
  }

}

const productService = new ProductService(productModel);

export { productService };


