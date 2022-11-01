import { Router } from 'express';
import { productService } from '../services';

const productRouter = Router();

productRouter.get('/products', async (req, res, next) => {
    try {
        const products = await productService.getProductAll();

        res.status(201).json(products);
    } catch (err) {
        next(err);
    }
});

productRouter.get('/products/:productId', async (req, res, next) => {
    try {
        const { productId } = req.params;
        const findedProduct = await productService.getProductOne(productId);

        res.status(201).json(findedProduct);
    } catch (err) {
        next(err);
    }
});

productRouter.post('/products', async (req, res, next) => {
    try {
        const { name, price, image, category } = req.body;

        const newProduct = await productService.addProduct({
            name,
            price,
            image,
            category,
        });

        res.status(201).json(newProduct);
    } catch (err) {
        next(err);
    }
});

productRouter.put('/products/:productId', async (req, res, next) => {
    try {
        const { productId } = req.params;
        const { name, price, image, category } = req.body;

        const updatedProduct = await productService.setProduct(productId, {
            name,
            price,
            image,
            category,
        });

        res.status(201).json(updatedProduct);
    } catch (err) {
        next(err);
    }
});

productRouter.delete('/products/:productId', async (req, res, next) => {
    try {
        const { productId } = req.params;

        const deletedProduct = await productService.removeProduct(productId);

        res.status(201).json(deletedProduct);
    } catch (err) {
        next(err);
    }
});

export { productRouter };
