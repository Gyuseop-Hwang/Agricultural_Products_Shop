import { model } from 'mongoose';
<<<<<<< HEAD
import { ProductSchema } from '../schemas/productSchema';
import { CategorySchema } from '../schemas/categorySchema';
=======
import { ProductSchema } from '../schemas/productSchema.js';
>>>>>>> dev

const Product = model('Product', ProductSchema);
const Category = model('Category', CategorySchema);

export class ProductModel {
  async findProducts(param = {}) {
    return await Product.find(param).populate('category');
  }

  async findOneProduct(productId) {
<<<<<<< HEAD
    return await Product.findById(productId).populate('category');
  }

  async findCategory(id) {
    return await Category.findById(id);
=======
    return await Product.findById(productId)
      .populate('category')
      .populate({
        path: 'comments',
        populate: { path: 'user', select: 'fullName' },
      });
>>>>>>> dev
  }

  async findProductsByTitle(title) {
    const $regex = new RegExp(title);
    return await Product.find({ title: { $regex } });
  }

  async createProduct(productInfo) {
<<<<<<< HEAD
    const product = new Product(productInfo);
    return await product.save();
=======
    return await Product.create(productInfo);
>>>>>>> dev
  }

  async updateProduct(productId, update) {
    return await Product.findByIdAndUpdate(productId, update, { new: true });
  }

  async deleteProduct(productId) {
<<<<<<< HEAD
    await Product.findByIdAndDelete(productId);
  }

  async findAllCategories() {
    return await Category.find({});
  }

  async createCategory(name) {
    return await Category.create({ name });
  }

  async updateCategory(name, update) {
    return await Category.findOneAndUpdate({ name }, update, {
      returnOriginal: false,
    });
  }

  async deleteCategory(id) {
    await Category.findByIdAndDelete(id);
  }
=======
    return await Product.findByIdAndDelete(productId);
  }
>>>>>>> dev
}

const productModel = new ProductModel();

export { productModel };
