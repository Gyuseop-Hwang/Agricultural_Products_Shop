import { model } from 'mongoose';
import { OrderSchema } from '../schemas/orderSchema';

const Order = model('Order', OrderSchema);

export class OrderModel {
  async findAll() {
    return await Order.find({});
  }

  async findByUserId(userId) {
    const findedOrder = await Order.find({ userId });

    return findedOrder.length >= 1 ? findedOrder : null;
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
