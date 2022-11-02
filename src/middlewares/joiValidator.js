import Joi from 'joi';
import { AppError } from '../utils';

function joiValidator(req, res, next) {
  const productSchema = Joi.object({
    title: Joi.string().required().min(5).max(20),
    imageUrl: Joi.string().required(),
    price: Joi.number().required().min(0),
    quantity: Joi.number().required().min(0),
    description: Joi.string().required().min(10).max(50)
  })
  const { error } = productSchema.validate(req.body);
  if (error) {
    const message = error.details.map(el => el.message).join(', ')
    return next(new AppError(400, message))
  }
  next();
}

export { joiValidator };