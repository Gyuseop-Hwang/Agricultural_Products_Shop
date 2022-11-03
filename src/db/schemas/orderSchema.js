import { Schema } from "mongoose";

const {
  Types: { ObjectId },
} = Schema;

const OrderSchema = new Schema(
  {
    status: {
      type: String,
      default: "주문 완료",
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
        productId: { type: ObjectId, ref: "Product", required: true },
        quantity: Number,
      },
    ],

    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
  },
  {
    timestamps: true,
  }
);

export { OrderSchema };
