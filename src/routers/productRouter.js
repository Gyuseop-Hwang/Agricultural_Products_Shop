import { Router } from 'express';
import { loginRequired } from '../middlewares/index.js';
import { productService } from '../services/index.js';
import { wrapAsync } from '../utils/index.js';
import { BadRequestError } from '../utils/index.js';
import { body, validationResult } from 'express-validator';

const productRouter = Router();

productRouter.get(
  '/products',
  wrapAsync(async (req, res) => {
    const products = await productService.getAllProducts();

    const categories = [
      ...new Set(products.map((product) => product.category)),
    ];

    res.status(200).json({ products, categories });
  })
);

productRouter.get('/products/search', async (req, res) => {
  const searchedProducts = await productService.searchProducts(req.query.title);

  res.status(200).json(searchedProducts);
});

productRouter.get(
  '/products/:productId',
  wrapAsync(async (req, res) => {
    const product = await productService.getProduct(req.params.productId);

    res.status(200).json(product);
  })
);

productRouter.get(
  '/products/categorization/:categoryId',
  wrapAsync(async (req, res) => {
    const productsByCategory = await productService.getProductsByCategory(
      req.params.categoryId
    );

    res.status(200).json(productsByCategory);
  })
);

productRouter.post(
  '/products/:productId/comments',
  loginRequired,
  body('content')
    .isString()
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('리뷰는 5글자 이상 100자 이내여야 합니다.'),
  body('rating').isInt().withMessage('별점은 1 이상 5 이하 정수여야 합니다.'),
  body('user')
    .isString()
    .withMessage('user는 userId 값으로 string 형태이어야 합니다.'),
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

    const product = await productService.createComment(
      req.params.productId,
      req.body
    );

    res.status(201).json(product);
  })
);

productRouter.put(
  '/products/:productId/comments/:commentId',
  loginRequired,
  body('content')
    .isString()
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('리뷰는 5글자 이상 100자 이내여야 합니다.'),
  body('rating').isInt().withMessage('별점은 1 이상 5 이하 정수여야 합니다.'),
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

    const { productId, commentId } = req.params;

    const product = await productService.updateComment(
      productId,
      commentId,
      req.body
    );

    res.status(201).json(product);
  })
);

productRouter.delete(
  '/products/:productId/comments/:commentId',
  loginRequired,
  wrapAsync(async (req, res) => {
    const { productId, commentId } = req.params;
    await productService.deleteComment(productId, commentId);

    res.status(200).json({
      result: 'success',
      message: '리뷰가 성공적으로 삭제되었습니다.',
    });
  })
);

export { productRouter };
