import { model } from 'mongoose';
import { ProductSchema } from '../schemas/productSchema';

import { CategorySchema } from '../schemas/categorySchema';

// const { types: { ObjectId } } = Schema;
const Product = model('Product', ProductSchema);
const Category = model('Category', CategorySchema);

export class ProductModel {
  // user 가능, 모든 상품 조회
  async findAllProducts() {
    const products = await Product.find({}).populate('category')
    return products;
    // const categories = [...new Set(products.map(product => product.category.name))]
    // res.json({products, categories})
    // products : [product1, product2, ...]
    // categories : ['견과류', '과일', '야채', '건조식품']...
  }
  // user 가능, 특정 상품 조회
  async findProduct(productId) {
    const product = await Product.findById(productId).populate('category');
    // if (!product) return null;
    //throw new AppError(404, '상품을 찾을 수 없습니다.')
    return product;
  }
  // user 가능, category별 상품 조회
  async findByCategory(name) {
    const category = await Category.findOne({ name });
    if (!category) return null;
    // throw new AppError(404, "해당하는 category가 없습니다.")

    const productsByCategory = await Product.find({ category });
    return productsByCategory;
    // res.json(productsByCategory);
  }

  // 관리자가 상품 생성
  async addProduct(name, productInfo) {
    // const { title, imageUrl, price, quantity, description } = productInfo;
    const product = new Product(productInfo);
    const category = await Category.findOne({ name });
    if (!category) return null;
    product.category = category._id;
    category.total++;
    await category.save();
    // const newProduct = await Product.create(product);
    const createdProduct = await product.save();
    return createdProduct
  }
  // 관리자만 상품 업데이트
  async updateProduct(productId, update) {
    const product = await Product.findById(productId);
    if (!product) return null;
    // throw new AppError(404, '해당 상품이 없습니다.');
    const newProduct = await Product.findByIdAndUpdate(productId, update, { new: true });

    return newProduct;
  }
  // 관리자만 상품 삭제
  async deleteProduct(productId) {
    const product = await Product.findById(productId).populate('category');
    if (!product) return null;
    // throw new AppError(404, '해당 상품이 없습니다.')
    const category = await Category.findOne({ name: product.category.name });
    category.total--;
    await category.save();
    const res = await Product.findByIdAndDelete(productId)

    return res;
  }

  // 관리자는 모든 카테고리 조회 가능.
  async findAllCategories() {
    const categories = await Category.find({});
    return categories;
  }

  // 관리자만 카테고리 추가
  async addCategory(name) {
    const createdCategory = await Category.create({ name });
    return createdCategory;
  }
  // 관리자만 카테고리 업데이트
  async updateCategory(name, update) {
    const category = await Category.findOne({ name });
    if (!category) return null;
    // throw new AppError(404, '해당 카테고리가 없습니다.')
    const newCategory = await Category.findOneAndUpdate({ name }, update, { returnOriginal: false });

    return newCategory;
  }
  // 관리자만 카테고리 삭제
  async deleteCategory(name) {
    const category = await Category.findOne({ name });
    if (!category) return 404;
    //throw new AppError(404, '해당 카테고리가 없습니다.')
    const products = await Product.find({ category });
    if (products.length > 0) return 403;
    // throw new AppError(403, '이미 카테고리가 등록된 상품이 존재하여 현재 대상 카테고리를 삭제할 수 없습니다.')
    const res = await Category.deleteOne({ name })
    return res;
  }

};

const productModel = new ProductModel();

export { productModel };

