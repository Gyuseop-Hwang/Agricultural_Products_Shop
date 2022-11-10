import { Schema } from 'mongoose';
import { CommentSchema } from './commentSchema.js';

const {
  Types: { ObjectId },
} = Schema;

const ProductSchema = new Schema(
  {
    title: String,
    image: {
      path: String,
      filename: String,
    },
    price: Number,
    quantity: Number,
    description: String,
    sale: {
      onSale: {
        type: Boolean,
        default: false,
      },
      discountedPrice: Number,
    },
    comments: [CommentSchema],
    category: {
      type: ObjectId,
      ref: 'Category',
    },
  },
  {
    timestamps: true,
  }
);

export { ProductSchema };
