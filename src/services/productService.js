import { categoryModel, productModel } from '../db';

class ProductService {
    constructor(productModel) {
        this.productModel = productModel;
    }

    async getProductAll() {
        const products = await this.productModel.findAll();

        return products;
    }

    async getProductOne(productId) {
        const findedProduct = await this.productModel.find(productId);
        return findedProduct;
    }

    async addProduct(productInfo) {
        const createdNewProduct = await this.productModel.create(productInfo);
        return createdNewProduct;
    }

    async setProduct(productId, productInfo) {
        const updatedProduct = await this.productModel.update(
            productId,
            productInfo
        );

        return updatedProduct;
    }

    async removeProduct(productId) {
        const deletedProduct = await this.productModel.delete(productId);

        return deletedProduct;
    }
}

const productService = new ProductService(productModel);

export { productService };
