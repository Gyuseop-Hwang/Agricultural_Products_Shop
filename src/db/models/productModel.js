import { model } from 'mongoose';
import { ProductSchema } from '../schemas/productSchema.js';

const Product = model('Product', ProductSchema);

export class ProductModel {
  async findProducts(param = {}) {
    return await Product.find(param).populate('category');
  }

  async findOneProduct(productId) {
    return await Product.findById(productId)
      .populate('category')
      .populate({
        path: 'comments',
        populate: { path: 'user', select: 'fullName' },
      });
  }

  async findProductsByTitle(title) {
    const $regex = new RegExp(title);

    return await Product.find({ title: { $regex } });
  }

  async createProduct(productInfo) {
    return await Product.create(productInfo);
  }

  async updateProduct(productId, update) {
    return await Product.findByIdAndUpdate(productId, update, { new: true });
  }

  async deleteProduct(productId) {
    return await Product.findByIdAndDelete(productId);
  }
}

const productModel = new ProductModel();

export { productModel };
