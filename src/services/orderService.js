import { orderModel } from '../db';
import { productModel } from '../db';
import { AppError } from '../utils';

class OrderService {
  constructor(orderModel) {
    this.orderModel = orderModel;
  }

  async findAllOrders() {
    const orders = await this.orderModel.findAll();
    return orders;
  }

  async findOrdersByUserId(userId) {
    const orders = await this.orderModel.findByUserId(userId);
    return orders;
  }

  async addOrder(orderInfo) {
    const createdOrder = await this.orderModel.create(orderInfo);
    if (!createdOrder)
      throw new AppError(400, '등록 요청을 실행할 수 없습니다.');

    return createdOrder;
  }

  async updateOrderStatus(orderId, orderStatus) {
    const updatedOrder = await this.orderModel.update(orderId, orderStatus);

    if (!updatedOrder)
      throw new AppError(400, '수정 요청을 실행할 수 없습니다.');

    return updatedOrder;
  }

  async updateOrderShippingAddress(orderId, orderShippingAddress) {
    const updatedOrder = await this.orderModel.update(
      orderId,
      orderShippingAddress
    );

    if (!updatedOrder)
      throw new AppError(400, '수정 요청을 실행할 수 없습니다.');

    return updatedOrder;
  }

  async deleteOrder(orderId) {
    const deletedOrder = await this.orderModel.delete(orderId);

    if (!deletedOrder) throw new AppError(400, '삭제할 주문이 없습니다!');

    return deletedOrder;
  }

  async calculateTotalPrice(requestedProducts) {
    const allProducts = await productModel.findAllProducts();
    const totalPrice = requestedProducts.reduce(
      (acc, { productId, quantity }) => {
        const pickedProduct = allProducts.find(
          (v) => v._id.toString() === productId
        );
        return acc + pickedProduct.price * quantity;
      },
      0
    );
    return totalPrice;
  }
}

const orderService = new OrderService(orderModel);
export { orderService };
