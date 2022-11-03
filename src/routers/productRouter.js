import { Router } from "express";
import { productService } from '../services';
import { wrapAsync, AppError } from '../utils';
import { body, validationResult } from 'express-validator';


const productRouter = Router();

productRouter.get('/products', wrapAsync(async (req, res) => {
  const products = await productService.getAllProducts();
  const categories = [...new Set(products.map(product => product.category))]
  res.status(200).json({ products, categories });
}))

productRouter.get('/products/search', body('title').isLength({ min: 2 }), async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError(400, errors);
  }
  const { title } = req.body;
  const searchedProducts = await productService.searchProducts(title);
  res.status(200).json(searchedProducts);
})

productRouter.get('/products/:productId', wrapAsync(async (req, res) => {
  const { productId } = req.params;
  const product = await productService.getProduct(productId)
  res.status(200).json(product)
}))

productRouter.get('/products/categorization/:categoryId', wrapAsync(async (req, res) => {
  const { categoryId } = req.params;
  const productsByCategory = await productService.getProductsByCategory(categoryId);
  res.status(200).json(productsByCategory)
}))



export { productRouter };
