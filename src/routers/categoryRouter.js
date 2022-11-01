import { Router } from 'express';
import { categoryService } from '../services/categoryService';

const categoryRouter = Router();

categoryRouter.post('/category', async (req, res, next) => {
    const createdCategory = await categoryService.addCategory({
        name: '생성됨',
    });

    res.status(201).json(createdCategory);
});

export { categoryRouter };
