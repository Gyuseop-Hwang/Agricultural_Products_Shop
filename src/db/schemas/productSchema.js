import { Schema } from 'mongoose';

const { Types: { ObjectId } } = Schema;

const ProductSchema = new Schema(
  {
    title: String,
    imageUrl: String,
    price: Number,
    quantity: Number,
    description: String,
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
