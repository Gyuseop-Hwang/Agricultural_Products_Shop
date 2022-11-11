import { Schema } from 'mongoose';
<<<<<<< HEAD
=======
import { CommentSchema } from './commentSchema.js';
>>>>>>> dev

const {
  Types: { ObjectId },
} = Schema;

const ProductSchema = new Schema(
  {
    title: String,
    imageUrl: String,
    price: Number,
    quantity: Number,
    description: String,
<<<<<<< HEAD
=======
    sale: {
      onSale: {
        type: Boolean,
        default: false,
      },
      discountedPrice: Number,
    },
    comments: [CommentSchema],
>>>>>>> dev
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
