import { Router } from "express";
import { adminProductService } from '../services';
import { wrapAsync, AppError } from '../utils';
import { productValidator } from '../middlewares'
import { body, validationResult } from 'express-validator'

const adminProductRouter = Router();

adminProductRouter.get('/products/categories', wrapAsync(async (req, res) => {
  const categories = await adminProductService.getAllCategories();
  res.status(200).json(categories);
}))

adminProductRouter.post('/products', productValidator, wrapAsync(async (req, res) => {
  const createInfo = req.body;
  const { category } = req.body;
  const createdProduct = await adminProductService.createProduct(category, createInfo);
  res.status(201).json(createdProduct);
}))

adminProductRouter.put('/products/:productId', productValidator, wrapAsync(async (req, res) => {
  const { productId } = req.params;
  const updateInfo = req.body;
  const newProduct = await adminProductService.updateProduct(productId, updateInfo)
  res.status(201).json(newProduct);
}))

adminProductRouter.delete('/products/:productId', wrapAsync(async (req, res) => {
  const { productId } = req.params;
  await adminProductService.deleteProduct(productId);
  res.status(200).json({ result: 'success', message: "상품이 삭제되었습니다." });
}))

adminProductRouter.post('/products/categories', body('name').isLength({ min: 2 }), wrapAsync(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError(400, errors);
  }
  const { name } = req.body;
  const createdCategory = await adminProductService.createCategory(name);
  res.status(201).json(createdCategory);
}))

adminProductRouter.put('/products/categories/:categoryId', body('name').isLength({ min: 2 }), wrapAsync(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError(400, errors);
  }
  const { categoryId } = req.params;
  const update = req.body;
  const newCategory = await adminProductService.updateCategory(categoryId, update);
  res.status(201).json(newCategory);
}))

adminProductRouter.delete('/products/categories/:categoryId', wrapAsync(async (req, res) => {
  const { categoryId } = req.params;
  await adminProductService.deleteCategory(categoryId);
  res.status(200).json({ result: 'success', message: "카테고리가 삭제되었습니다." });
}))

export { adminProductRouter };