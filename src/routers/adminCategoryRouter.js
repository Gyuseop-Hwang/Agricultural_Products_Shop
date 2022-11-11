import { Router } from 'express';
import { adminCategoryService } from '../services/index.js';
import { wrapAsync, BadRequestError } from '../utils/index.js';
import { body, validationResult } from 'express-validator';

const adminCategoryRouter = Router();

adminCategoryRouter.get(
  '/categories',
  wrapAsync(async (req, res) => {
    const categories = await adminCategoryService.getAllCategories();

    res.status(200).json(categories);
  })
);

adminCategoryRouter.post(
  '/categories',
  body('name')
    .isString()
    .isLength({ min: 2 })
    .trim()
    .withMessage('카테고리는 최소 2자 이상이어야 합니다.'),
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

    const createdCategory = await adminCategoryService.createCategory(
      req.body.name
    );

    res.status(201).json(createdCategory);
  })
);

adminCategoryRouter.put(
  '/categories/:categoryId',
  body('name')
    .isString()
    .isLength({ min: 2 })
    .trim()
    .withMessage('카테고리는 최소 2자 이상이어야 합니다.'),
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

    const newCategory = await adminCategoryService.updateCategory(
      req.params.categoryId,
      req.body
    );

    res.status(201).json(newCategory);
  })
);

adminCategoryRouter.delete(
  '/categories/:categoryId',
  wrapAsync(async (req, res) => {
    const deletedCategory = await adminCategoryService.deleteCategory(
      req.params.categoryId
    );

    res
      .status(200)
      .json({
        result: 'success',
        message: `${deletedCategory.name} 카테고리가 삭제되었습니다.`,
      });
  })
);

export { adminCategoryRouter };
