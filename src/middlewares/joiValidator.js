import Joi from 'joi';
<<<<<<< HEAD
import { BadRequestError } from '../utils';

function productValidator(req, res, next) {
=======
import { BadRequestError } from '../utils/index.js';
import { cloudinary } from '../cloudinary/index.js';

async function productValidator(req, res, next) {
>>>>>>> dev
  const productSchema = Joi.object({
    title: Joi.string().required().min(5).max(20),
    imageUrl: Joi.string().required(),
    price: Joi.number().required().min(0),
    quantity: Joi.number().required().min(0),
<<<<<<< HEAD
    description: Joi.string().required().min(10).max(50),
=======
    description: Joi.string().required().min(5),
>>>>>>> dev
    category: Joi.string().required(),
  });
  const { error } = productSchema.validate(req.body);
  if (error) {
<<<<<<< HEAD
=======
    if (req.file) {
      await cloudinary.uploader.destroy(req.file.filename);
    }

>>>>>>> dev
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
