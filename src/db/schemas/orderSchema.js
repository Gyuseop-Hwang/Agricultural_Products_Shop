import { Schema } from 'mongoose';

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
      type: new Schema(
        {
          postalCode: String,
          address1: String,
          address2: String,
        },
        {
          _id: false,
        }
      ),
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
