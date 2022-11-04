import { orderModel, userModel } from '../db';
import { productModel } from '../db';
import { BadRequestError } from '../utils';

class OrderService {
  constructor(orderModel) {
    this.orderModel = orderModel;
  }

  async findAllOrders() {
    const allOrders = await this.orderModel.findAll();

    if (allOrders.length < 1) return '주문 내역이 존재하지 않습니다.';

    return allOrders;
  }

  async findOrder(orderId) {
    const foundOrder = await this.orderModel.find(orderId);

    if (!foundOrder) throw new BadRequestError('해당 주문을 찾을 수 없습니다.');

    return foundOrder;
  }

  async findOrdersByUserId(userId) {
    const foundOrderArr = await this.orderModel.findByUserId(userId);

    if (foundOrderArr.length < 1) return '주문 내역이 존재하지 않습니다.';

    return foundOrderArr;
  }

  async createOrder(orderInfo) {
    const createdOrder = await this.orderModel.create(orderInfo);

    if (!createdOrder)
      throw new BadRequestError('등록 요청을 실행할 수 없습니다.');

    return createdOrder;
  }

  async updateOrderStatus(orderId, orderStatus) {
    const updatedOrder = await this.orderModel.update(orderId, orderStatus);

    if (!updatedOrder)
      throw new BadRequestError('배송 상태 수정 요청을 실행할 수 없습니다.');

    return updatedOrder;
  }

  async updateOrderShippingAddress(orderId, orderShippingAddress) {
    const updatedOrder = await this.orderModel.update(
      orderId,
      orderShippingAddress
    );

    if (!updatedOrder)
      throw new BadRequestError('도착지 수정 요청을 실행할 수 없습니다.');

    return updatedOrder;
  }

  async deleteOrder(userId, orderId) {
    const foundOrder = await this.findOrder(orderId);
    const foundUser = await userModel.findById(String(foundOrder.userId));

    if (String(foundUser._id) !== userId)
      throw new BadRequestError('다른 사람의 주문입니다. 삭제할 수 없습니다.');

    const deletedOrder = await this.orderModel.delete(orderId);

    if (!deletedOrder)
      throw new BadRequestError('삭제 요청을 실행할 수 없습니다.');

    return deletedOrder;
  }

  async calculateTotalPrice(requestedProducts) {
    const allProducts = await productModel.findProducts();
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
