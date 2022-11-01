import { Schema } from 'mongoose';

const { types: { ObjectId } } = Schema;
const OrderSchema = new Schema({
  status: String,
  recipient: String,
  phoneNumber: String,
  shippingAddress: String,
  totalPrice: Number,
  products: [
    {
      productId: { type: ObjectId, ref: 'Product' },
      quantity: Number
    }
  ],
  userId: {
    type: ObjectId,
    ref: 'User'
  },
}, {
  timestamps: true,
});

export { OrderSchema };