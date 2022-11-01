import { Schema } from 'mongoose';


const {
  types: { ObjectId },
} = Schema;
const OrderSchema = new Schema(
  {
    status: {
      type: String,
      required: true,
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
        productId: { type: ObjectId, ref: 'Product' },
        quantity: Number,
      },
    ],

    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'user',
    },
  },
  {
    timestamps: true,
  }
);

export { OrderSchema };

