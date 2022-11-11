<<<<<<< HEAD
import { Router } from "express";
import { adminProductService } from '../services';
import { wrapAsync, BadRequestError } from '../utils';
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
    throw new BadRequestError(errors);
  }
  const { name } = req.body;
  const createdCategory = await adminProductService.createCategory(name);
  res.status(201).json(createdCategory);
}))

adminProductRouter.put('/products/categories/:categoryId', body('name').isLength({ min: 2 }), wrapAsync(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new BadRequestError(errors);
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
=======
import { Router } from 'express';
import { adminProductService } from '../services/index.js';
import { wrapAsync } from '../utils/index.js';
import { productValidator } from '../middlewares/index.js';
import { body, validationResult } from 'express-validator';
import { BadRequestError } from '../utils/index.js';
import { storage } from '../cloudinary/index.js';
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
      req.body.image = { path, filename };
    } else {
      req.body.image = { path: '' };
    }
    const createdProduct = await adminProductService.createProduct(req.body);

    res.status(201).json(createdProduct);
  })
);

adminProductRouter.put(
  '/products/:productId',
  upload.single('image'),
  productValidator,
  wrapAsync(async (req, res) => {
    if (req.file) {
      const { path, filename } = req.file;
      req.body.image = { path, filename };
    } else {
      delete req.body['image'];
    }
    const newProduct = await adminProductService.updateProduct(
      req.params.productId,
      req.body
    );

    res.status(201).json(newProduct);
  })
);

adminProductRouter.delete(
  '/products/:productId',
  wrapAsync(async (req, res) => {
    const deletedProduct = await adminProductService.deleteProduct(
      req.params.productId
    );

    res.status(200).json({
      result: 'success',
      message: `${deletedProduct.title} 상품이 삭제되었습니다.`,
    });
  })
);

adminProductRouter.patch(
  '/products/:productId/toggleSale',
  body('discountedPrice')
    .isString()
    .withMessage('string으로 들어와야 합니다.')
    .isLength({ min: 2 })
    .trim()
    .withMessage('상품할인 가격은 2자리 이상이어야 합니다.'),
  wrapAsync(async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new BadRequestError(
        errors
          .array()
          .map((error) => error.msg)
          .join(', ')
      );
    }

    const saleToggledProduct = await adminProductService.toggleSale(
      req.params.productId,
      req.body.discountedPrice
    );

    res.status(201).json(saleToggledProduct);
  })
);
>>>>>>> dev

export { adminProductRouter };
