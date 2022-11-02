import { Router } from "express";
import { productService } from '../services';
import { wrapAsync } from '../utils';
import { loginRequired, authRequired, productValidator } from '../middlewares'

const productRouter = Router();

productRouter.get('/products', wrapAsync(async (req, res) => {
  const products = await productService.getAllProducts();
  const categories = [...new Set(products.map(product => product.category.name))]
  res.status(200).json({ products, categories });
}))

// 관리자
productRouter.get('/products/categories', loginRequired, authRequired, wrapAsync(async (req, res) => {
  const categories = await productService.getAllCategories();
  res.status(200).json(categories);
}))

productRouter.get('/products/:productId', wrapAsync(async (req, res) => {
  const { productId } = req.params;
  const product = await productService.getProduct(productId)
  res.status(200).json(product)
}))

productRouter.get('/products/categorization/:categoryName', wrapAsync(async (req, res) => {
  const { categoryName } = req.params;
  const productsByCategory = await productService.getProductsByCategory(categoryName);
  res.status(200).json(productsByCategory)
}))

// 관리자 
productRouter.post('/products/:categoryName', loginRequired, authRequired, productValidator, wrapAsync(async (req, res) => {
  const { categoryName } = req.params;
  const update = req.body;
  const createdProduct = await productService.createProduct(categoryName, update);
  res.status(201).json(createdProduct);
}))

// 관리자
productRouter.put('/products/:productId', loginRequired, authRequired, productValidator, wrapAsync(async (req, res) => {
  const { productId } = req.params;
  const update = req.body;
  const newProduct = await productService.renewProduct(productId, update)
  res.status(201).json(newProduct);
}))

// 관리자
productRouter.delete('/products/:productId', loginRequired, authRequired, wrapAsync(async (req, res) => {
  const { productId } = req.params;
  const result = await productService.removeProduct(productId);
  res.status(200).json(result);
}))

// 관리자
productRouter.post('/products/categories/:categoryName', loginRequired, authRequired, wrapAsync(async (req, res) => {
  const { categoryName } = req.params;
  const createdCategory = await productService.createCategory(categoryName);
  res.status(201).json(createdCategory);
}))

// 관리자
productRouter.put('/products/categories/:categoryName', loginRequired, authRequired, wrapAsync(async (req, res) => {
  const { categoryName } = req.params;
  const update = req.body;
  const newCategory = await productService.renewCategory(categoryName, update);
  res.status(201).json(newCategory);
}))

// 관리자
productRouter.delete('/products/categories/:categoryName', loginRequired, authRequired, wrapAsync(async (req, res) => {
  const { categoryName } = req.params;
  const result = await productService.removeCategory(categoryName);
  res.status(200).json(result);
}))

export { productRouter };
