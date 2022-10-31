import { Schema } from 'mongoose';

const { types: { ObjectId } } = Schema;
const ProductSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: ObjectId,
    ref: 'Category',
  },
}, {
  timestamps: true,
});

export { ProductSchema };