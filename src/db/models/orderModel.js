import { model } from 'mongoose';
import { OrderSchema } from '../schemas/orderSchema';


const Order = model('Order', OrderSchema);

export class OrderModel {

  async findAllOrders() {
    const orders = await Order.find({});
    return orders;
  }

  async findOrder(userId) {
    const order = await Order.findOne({ userId });
    if (!order) return null;
    // throw new AppError(404, "해당 주문을 찾을 수 없습니다.")
    return order;
  }

  async createOrder(userId, orderInfo) {
    const createdOrder = new Order(orderInfo);
    createdOrder.userId = userId;
    await createOrder.save();
    return createdOrder;
  }

  // async updateShippingStatus(userId, shippingStatus) {
  //   const order = await Order.findById(userId);
  //   if (!order) return null;
  //   // throw new AppError(404, "해당 주문이 존재하지 않습니다.");
  //   const updatedOrder = await Order.findByIdAndUpdate({ userId }, shippingStatus, { new: true })
  //   return updatedOrder;
  // }

  async updateShippingInfo(userId, shippingInfo) {
    const order = await Order.findById(userId);
    if (!order) return null;
    // throw new AppError(404, "해당 주문이 존재하지 않습니다.");
    const updatedOrder = await Order.findByIdAndUpdate({ userId }, shippingInfo, { new: true })
    return updatedOrder;
  }

  async deleteOrder(userId) {
    const order = await Order.findById(userId);
    if (!order) return null;
    // throw new AppError(404, "해당 주문이 존재하지 않습니다.");
    const res = await Order.findByIdAndDelete({ userId })
    return res;
  }

}


const orderModel = new OrderModel();
export { orderModel };



