import { Router } from "express";
import { productService } from '../services';
import { wrapAsync } from '../utils';

const productRouter = Router();

productRouter.get('/products', wrapAsync(async (req, res) => {

  const products = await productService.getAllProducts();

  const categories = [...new Set(products.map(product => product.category))]

  res.status(200).json({ products, categories });
}))

productRouter.get('/products/search', async (req, res) => {

  const searchedProducts = await productService.searchProducts(req.query.title);

  res.status(200).json(searchedProducts);
})

productRouter.get('/products/:productId', wrapAsync(async (req, res) => {

  const product = await productService.getProduct(req.params.productId);

  res.status(200).json(product);
}))

productRouter.get('/products/categorization/:categoryId', wrapAsync(async (req, res) => {

  const productsByCategory = await productService.getProductsByCategory(req.params.categoryId);

  res.status(200).json(productsByCategory)
}))



export { productRouter };
