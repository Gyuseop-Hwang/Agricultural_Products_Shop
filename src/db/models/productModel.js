import { model } from 'mongoose';
import { ProductSchema } from '../schemas/productSchema';
import { CategorySchema } from '../schemas/categorySchema';

const Product = model('Product', ProductSchema);
const Category = model('Category', CategorySchema);

export class ProductModel {
  // user 가능, 모든 상품 조회
  async findAllProducts() {
    const products = await Product.find({})
    return products;
  }
  // user 가능, 특정 상품 조회
  async findProduct(id) {
    const product = await Product.find(id);
    if (!product) throw new Error('상품을 찾을 수 없습니다.')
    return product;
  }
  // user 가능, category별 상품 조회
  async findByCategory(category) {
    const productsByCateogry = await Product.find({ category });
    return productsByCateogry;
  }

  // user가능, 카테고리 목록 화면에서 확인
  async findAllCategories() {
    const categories = await Category.find({});
    return categories;
  }

  // 관리자가 상품 생성
  async createProduct(product) {
    const newProduct = await Product.create(product);
    return newProduct
  }
  // 관리자만 상품 업데이트
  async upateProduct(id, update) {
    const product = await Product.findById(id);
    if (!product) throw new Error('해당 상품이 없습니다.')
    const newProduct = await Product.findByIdAndUpdate(id, update, { new: true });

    return newProduct;
  }
  // 관리자만 상품 삭제
  async deleteProduct(id) {
    const product = await Product.findById(id);
    if (!product) throw new Error('해당 상품이 없습니다.')
    const res = await Product.deleteOne({ _id: id })
    return res;
  }
  // 관리자만 카테고리 추가
  async addCategory(category) {
    const newCategory = await Category.create(category);
    return newCategory;
  }
  // 관리자만 카테고리 업데이트
  async updateCategory(id, update) {
    const category = await Category.findById(id);
    if (!category) {
      throw new Error('해당 카테고리가 없습니다.')
    }
    // const products = await Product.find({ category });
    // if (!products) {
    //   throw new Error('이미 카테고리가 등록된 상품이 존재하여 현재 대상 카테고리를 업데이트 할 수 없습니다.')
    // }
    const newCategory = await Category.findByIdAndUpdate(id, update, { new: true });

    return newCategory;
  }
  // 관리자만 카테고리 삭제
  async deleteCategory(id) {
    const category = await Category.findById(id);
    if (!category) throw new Error('해당 카테고리가 없습니다.')
    const products = await Product.find({ category });
    if (!products) {
      throw new Error('이미 카테고리가 등록된 상품이 존재하여 현재 대상 카테고리를 삭제할 수 없습니다.')
    }
    const res = await Category.deleteOne({ _id: id })
    return res;
  }

};

const productModel = new ProductModel();

export { productModel };