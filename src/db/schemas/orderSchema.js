import { Schema } from 'mongoose';


const OrderSchema = new Schema({
  status: String,
  recipient: String,
  phoneNumber: String,
  shippingAddress: String,
  totalPrice: Number,
  userId: String,
}, {
  timestamps: true,
});

export { OrderSchema };