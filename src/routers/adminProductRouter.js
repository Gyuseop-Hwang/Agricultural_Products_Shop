import { Router } from "express";
import { adminProductService } from '../services';
import { wrapAsync } from '../utils';
import { productValidator } from '../middlewares'
import { storage } from '../cloudinary'
import multer from 'multer';

const upload = multer({ storage });

const adminProductRouter = Router();

adminProductRouter.post(
  '/products',
  upload.single('image'),
  productValidator,
  wrapAsync(async (req, res) => {

    if (req.file) {
      const { path, filename } = req.file;
      req.body.image = { path, filename }
    } else {
      req.body.image = { path: "" }
    }
    const createdProduct = await adminProductService.createProduct(req.body);

    res.status(201).json(createdProduct);
  }))

adminProductRouter.put(
  '/products/:productId',
  upload.single('image'),
  productValidator,
  wrapAsync(async (req, res) => {

    if (req.file) {
      const { path, filename } = req.file;
      req.body.image = { path, filename }
    } else {
      delete req.body['image'];
    }
    const newProduct = await adminProductService.updateProduct(req.params.productId, req.body)

    res.status(201).json(newProduct);
  }))

adminProductRouter.delete('/products/:productId', wrapAsync(async (req, res) => {

  const deletedProduct = await adminProductService.deleteProduct(req.params.productId);

  res.status(200).json({ result: 'success', message: `${deletedProduct.title} 상품이 삭제되었습니다.` });
}))

export { adminProductRouter };