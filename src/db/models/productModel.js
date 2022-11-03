import { model } from 'mongoose';
import { ProductSchema } from '../schemas/productSchema';
import { CategorySchema } from '../schemas/categorySchema';


const Product = model('Product', ProductSchema);
const Category = model('Category', CategorySchema);

export class ProductModel {

  async findProducts(param = {}) {
    const products = await Product.find(param).populate('category')
    return products;
  }

  async findOneProduct(productId) {
    const product = await Product.findById(productId).populate('category');
    return product;
  }

  async findCategory(id) {
    const category = await Category.findById(id);
    return category;
  }

  async findProductsByTitle(title) {
    const $regex = new RegExp(title);
    const products = await Product.find({ title: { $regex } })
    return products;
  }

  async createProduct(productInfo) {
    const product = new Product(productInfo);
    const createdProduct = await product.save();
    return createdProduct;
  }

  async updateProduct(productId, update) {
    const newProduct = await Product.findByIdAndUpdate(productId, update, { new: true });
    return newProduct;
  }

  async deleteProduct(productId) {
    await Product.findByIdAndDelete(productId);
  }

  async findAllCategories() {
    const categories = await Category.find({});
    return categories;
  }

  async createCategory(name) {
    const createdCategory = await Category.create({ name });
    return createdCategory;
  }

  async updateCategory(name, update) {
    const newCategory = await Category.findOneAndUpdate({ name }, update, { returnOriginal: false });
    return newCategory;
  }

  async deleteCategory(id) {
    await Category.findByIdAndDelete(id)
  }

};

const productModel = new ProductModel();

export { productModel };

