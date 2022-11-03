import Joi from 'joi';
import { AppError } from '../utils';

function productValidator(req, res, next) {
  const productSchema = Joi.object({
    title: Joi.string().required().min(5).max(20),
    imageUrl: Joi.string().required(),
    price: Joi.number().required().min(0),
    quantity: Joi.number().required().min(0),
    description: Joi.string().required().min(10).max(50),
    category: Joi.string().required()
  })
  const { error } = productSchema.validate(req.body);
  if (error) {
    const message = error.details.map(el => el.message).join(', ')
    return next(new AppError(400, message))
  }
  next();
}

function orderValidator(req, res, next) {
  const postSchema = Joi.object({
    recipient: Joi.string().required(),
    phoneNumber: Joi.string().required(),
    shippingAddress: Joi.string().required(),
    products: Joi.array().items(
      Joi.object({
        productId: Joi.string().required(),
        quantity: Joi.number().integer().min(1).required(),
      })
    ),
    userId: Joi.string().required(),
  });
  const { error } = postSchema.validate(req.body);
  if (error) {
    const message = error.details.map(el => el.message).join(', ')
    return next(new AppError(400, message))
  }
  next();
}

function orderUpdateValidator(req, res, next) {
  const putSchema = Joi.object({
    status: Joi.string(),
    shippingAddress: Joi.string(),
  }).or('status', 'shippingAddress');
  const { error } = putSchema.validate(req.body);
  if (error) {
    const message = error.details.map(el => el.message).join(', ')
    return next(new AppError(400, message))
  }
  next();
}




export { productValidator, orderValidator, orderUpdateValidator };