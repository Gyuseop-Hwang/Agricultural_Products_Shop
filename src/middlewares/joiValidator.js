import Joi from 'joi';
import { BadRequestError } from '../utils/index.js';
import { cloudinary } from '../cloudinary/index.js';

async function productValidator(req, res, next) {
  const productSchema = Joi.object({
    title: Joi.string().required().min(3).max(20),
    image: [Joi.object().optional(), Joi.allow(null)],
    price: Joi.number().required().min(0),
    quantity: Joi.number().required().min(0),
    description: Joi.string().required().min(5),
    category: Joi.string().required(),
  });

  const { error } = productSchema.validate(req.body);

  if (error) {
    if (req.file) {
      await cloudinary.uploader.destroy(req.file.filename);
    }

    const message = error.details.map((el) => el.message).join(', ');

    return next(new BadRequestError(message));
  }

  next();
}

function orderCreateValidator(req, res, next) {
  const postSchema = Joi.object({
    recipient: Joi.string().required(),
    phoneNumber: Joi.string().required(),
    shippingAddress: Joi.object({
      postalCode: Joi.string().required(),
      address1: Joi.string().required(),
      address2: Joi.string().required(),
    }).required(),
    products: Joi.array().items(
      Joi.object({
        product: Joi.string().required(),
        count: Joi.number().integer().min(1).required(),
      })
    ),
  });

  const { error } = postSchema.validate(req.body);

  if (error) {
    const message = error.details.map((el) => el.message).join(', ');
    return next(new BadRequestError(message));
  }
  next();
}

function orderStatusUpdateValidator(req, res, next) {
  const statusSchema = Joi.object({
    status: Joi.string().required(),
  });
  const { error } = statusSchema.validate(req.body);
  if (error) {
    const message = error.details.map((el) => el.message).join(', ');
    return next(new BadRequestError(message));
  }
  next();
}

function orderShippingAddressUpdateValidator(req, res, next) {
  const shippingAddressSchema = Joi.object({
    shippingAddress: Joi.object({
      postalCode: Joi.string().required(),
      address1: Joi.string().required(),
      address2: Joi.string().required(),
    }).required(),
  });
  const { error } = shippingAddressSchema.validate(req.body);
  if (error) {
    const message = error.details.map((el) => el.message).join(', ');
    return next(new BadRequestError(message));
  }
  next();
}

export {
  productValidator,
  orderCreateValidator,
  orderStatusUpdateValidator,
  orderShippingAddressUpdateValidator,
};
