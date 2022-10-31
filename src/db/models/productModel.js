import { model } from 'mongoose';
import { ProductSchema } from '../schemas/productSchema';

const Product = model('products', ProductSchema);

export class ProductModel {
    async create(productInfo) {
        const createdProduct = await Product.create(productInfo);
        return createdProduct;
    }

    async findAll() {
        const products = await Product.find({});
        return products;
    }

    async find(productId) {
        const filter = { _id: productId };
        const findedProduct = await Product.findOne(filter);

        return findedProduct;
    }

    async update(productId, productInfo) {
        const filter = { _id: productId };
        const option = { ...productInfo };
        const updatedProducts = await Product.findOneAndUpdate(filter, option, {
            new: true,
        });

        return updatedProducts;
    }

    async delete(productId) {
        const filter = { _id: productId };
        const deletedProduct = await Product.findOneAndDelete(filter);
        return deletedProduct;
    }
}

const productModel = new ProductModel();

export { productModel };
