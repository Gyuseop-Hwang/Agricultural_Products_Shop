import mongoose, { Schema } from 'mongoose';

const {
  Types: { ObjectId },
} = Schema;

const OrderSchema = new Schema(
  {
    status: {
      type: String,
      default: '주문 완료',
    },
    recipient: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    shippingAddress: {
      type: String,
      required: true,
    },

    totalPrice: Number,

    products: [
      {
        product: { type: ObjectId, ref: 'Product', required: true },
        count: { type: Number, required: true },
      },
    ],

    user: {
      type: ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export { OrderSchema };
