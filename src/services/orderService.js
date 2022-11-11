import { orderModel, productModel } from '../db/index.js';
import { BadRequestError, NotFoundError } from '../utils/index.js';

class OrderService {
  constructor(orderModel) {
    this.orderModel = orderModel;
  }

  async findAllOrders() {
    const allOrders = await this.orderModel.findAll();

    if (allOrders.length < 1) return [];

    return allOrders;
  }

  async findOrder(orderId) {
    const foundOrder = await this.orderModel.find(orderId);

    if (!foundOrder) throw new NotFoundError('해당 주문을 찾을 수 없습니다.');

    return foundOrder;
  }

  async findOrdersByUserId(userId) {
    const foundOrderArr = await this.orderModel.findByUserId(userId);

    if (foundOrderArr.length < 1) return [];

    return foundOrderArr;
  }

  async createOrder(orderInfo) {
    const createdOrder = await this.orderModel.create(orderInfo);

    const createdOrderInDB = await this.orderModel.find(createdOrder._id);

    if (!createdOrderInDB) throw new Error('서버에서 처리할 수 없었습니다.');

    return createdOrder;
  }

  async updateOrderStatus(orderId, orderStatus) {
    const beforeUpdatedOrder = await this.findOrder(orderId);
    const updatedOrder = await this.orderModel.update(orderId, orderStatus);

    if (!updatedOrder) throw new Error('서버에서 처리할 수 없었습니다.');

    if (beforeUpdatedOrder.status === updatedOrder.status)
      throw new BadRequestError('변경된 주문 상태 값을 입력해주세요!');

    return updatedOrder;
  }

  async updateOrderShippingAddress(orderId, orderShippingAddress) {
    await this.findOrder(orderId);

    const updatedOrder = await this.orderModel.update(
      orderId,
      orderShippingAddress
    );

    if (!updatedOrder) throw new Error('서버에서 처리할 수 없었습니다.');

    return updatedOrder;
  }

  async deleteOrderByAdmin(orderId) {
    await this.findOrder(orderId);

    const deletedOrder = await this.orderModel.delete(orderId);

    if (!deletedOrder) throw new Error('서버에서 처리할 수 없었습니다.');

    return deletedOrder;
  }

  async deleteOrderByUser(userId, orderId) {
    const foundOrder = await this.findOrder(orderId);

    if (String(foundOrder.user._id) !== userId)
      throw new BadRequestError('다른 사람의 주문입니다. 삭제할 수 없습니다.');

    const deletedOrder = await this.orderModel.delete(orderId);

    if (!deletedOrder) throw new Error('서버에서 처리할 수 없었습니다.');

    return deletedOrder;
  }

  async calculateTotalPrice(requestedProducts) {
    const allProducts = await productModel.findProducts();
    const totalPrice = requestedProducts.reduce((acc, { product, count }) => {
      const pickedProduct = allProducts.find((v) => String(v._id) === product);
      let price = pickedProduct.price;
      if (pickedProduct.sale.onSale) {
        price = pickedProduct.sale.discountedPrice;
      }
      return acc + price * count;
    }, 0);
    return totalPrice;
  }
}

const orderService = new OrderService(orderModel);
export { orderService };
