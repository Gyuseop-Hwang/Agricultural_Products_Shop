import { productModel } from '../db';
import { AppError } from '../utils'

class ProductService {
  constructor(productModel) {
    this.productModel = productModel;
  }

  async getAllProducts() {
    const products = await this.productModel.findAllProducts();
    return products;
  }

  async getProduct(productId) {
    const product = await this.productModel.findProduct(productId);
    if (!product) {
      throw new AppError(404, "상품을 찾을 수 없습니다.")
    }
    return product;
  }

  async getProductsByCategory(name) {
    const productsByCategory = await this.productModel.findByCategory(name);
    if (!productsByCategory) {
      throw new AppError(404, '존재하지 않는 카테고리입니다.')
    };
    return productsByCategory;
  }

  async createProduct(name, productInfo) {
    const createdProduct = await this.productModel.addProduct(name, productInfo);
    if (!createdProduct) {
      throw new AppError(404, '존재하지 않는 카테고리입니다.')
    }
    return createdProduct;
  }

  async renewProduct(productId, update) {
    const newProduct = await this.productModel.updateProduct(productId, update);
    if (!newProduct) {
      throw new AppError(404, "존재하지 않는 상품입니다.")
    }
    return newProduct;
  }

  async removeProduct(productId) {
    const res = await this.productModel.deleteProduct(productId);
    if (!res) {
      throw new AppError(404, "존재하지 않는 상품입니다.")
    }
    return res;
  }

  async getAllCategories() {
    const categories = await this.productModel.findAllCategories();
    return categories;
  }

  async createCategory(name) {
    const createdCategory = await this.productModel.addCategory(name);
    return createdCategory;
  }

  async renewCategory(name, update) {
    const newCategory = await this.productModel.updateCategory(name, update);
    if (!newCategory) {
      throw new AppError(404, "존재하지 않는 카테고리입니다.")
    }
    return newCategory;
  }

  async removeCategory(name) {
    const res = await this.productModel.deleteCategory(name)
    if (res === 404) {
      throw new AppError(404, "존재하지 않는 카테고리입니다.")
    }
    else if (res === 403) {
      throw new AppError(403, "이미 카테고리가 등록된 상품이 존재하여 현재 대상 카테고리를 삭제할 수 없습니다.")
    }
    return res;
  }
}

const productService = new ProductService(productModel)

export { productService };


