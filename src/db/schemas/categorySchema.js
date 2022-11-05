import { Schema } from 'mongoose';

const CategorySchema = new Schema({
  name: String,
  total: {
    type: Number,
    default: 0,
  },
});

export { CategorySchema };
