import { model } from 'mongoose';
import { OrderSchema } from '../schemas/orderSchema.js';

const Order = model('Order', OrderSchema);

export class OrderModel {
  async findAll() {
    return await Order.find({})
      .populate('user')
      .populate({
        path: 'products',
        populate: {
          path: 'product',
        },
      });
  }

  async find(orderId) {
    return await Order.findOne({ _id: orderId })
      .populate('user')
      .populate({
        path: 'products',
        populate: {
          path: 'product',
        },
      });
  }

  async findByUserId(userId) {
    return await Order.find({ user: userId })
      .populate('user')
      .populate({
        path: 'products',
        populate: {
          path: 'product',
        },
      });
  }

  async create(orderInfo) {
    return await Order.create({ ...orderInfo });
  }

  async update(orderId, updateInfo) {
    const filter = { _id: orderId };
    const update = { ...updateInfo };
    const options = { new: true };

    return await Order.findOneAndUpdate(filter, update, options);
  }

  async delete(orderId) {
    return await Order.findOneAndDelete({ _id: orderId });
  }
}

const orderModel = new OrderModel();
export { orderModel };
