<<<<<<< HEAD
import { orderModel, userModel } from '../db';
import { productModel } from '../db';
import { BadRequestError } from '../utils';
=======
import { orderModel, productModel } from '../db/index.js';
import { BadRequestError, NotFoundError } from '../utils/index.js';
>>>>>>> dev

class OrderService {
  constructor(orderModel) {
    this.orderModel = orderModel;
  }

  async findAllOrders() {
    const allOrders = await this.orderModel.findAll();

<<<<<<< HEAD
    if (allOrders.length < 1) return '주문 내역이 존재하지 않습니다.';
=======
    if (allOrders.length < 1) return [];
>>>>>>> dev

    return allOrders;
  }

  async findOrder(orderId) {
    const foundOrder = await this.orderModel.find(orderId);

    if (!foundOrder) throw new BadRequestError('해당 주문을 찾을 수 없습니다.');

    return foundOrder;
  }

  async findOrdersByUserId(userId) {
    const foundOrderArr = await this.orderModel.findByUserId(userId);

<<<<<<< HEAD
    if (foundOrderArr.length < 1) return '주문 내역이 존재하지 않습니다.';
=======
    if (foundOrderArr.length < 1) return [];
>>>>>>> dev

    return foundOrderArr;
  }

  async createOrder(orderInfo) {
    const { userId } = orderInfo;
    const user = await userModel.findById(userId);
    orderInfo.user = user;
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

  async deleteOrderByAdmin(orderId) {
    const deletedOrder = await this.orderModel.delete(orderId);

    if (!deletedOrder)
      throw new BadRequestError('삭제 요청을 실행할 수 없습니다.');

    return deletedOrder;
  }

  async deleteOrderByUser(userId, orderId) {
    const foundOrder = await this.findOrder(orderId);

    if (String(foundOrder.user._id) !== userId)
      throw new BadRequestError('다른 사람의 주문입니다. 삭제할 수 없습니다.');

    const deletedOrder = await this.orderModel.delete(orderId);

    if (!deletedOrder)
      throw new BadRequestError('삭제 요청을 실행할 수 없습니다.');

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
