import { Router } from 'express';
import { orderService } from '../services';
import { AppError } from '../utils';
import { wrapAsync } from '../utils/wrapAsync';
import Joi from 'joi';

const orderRouter = Router();

const postSchema = Joi.object({
  recipient: Joi.string().required(),
  phoneNumber: Joi.string().required(),
  shippingAddress: Joi.string().required(),
  products: Joi.array().items(
    Joi.object({
      productId: Joi.string().required(),
      quantity: Joi.number().integer().min(1).required(),
    })
  ),
  userId: Joi.string().required(),
});

const putSchema = Joi.object({
  status: Joi.string(),
  shippingAddress: Joi.string(),
}).or('status', 'shippingAddress');

orderRouter.get(
  '/orders',
  // 이 부분에서 관리자인지 권한 확인 필요
  wrapAsync(async (req, res) => {
    const orders = await orderService.findAllOrders({});

    res.status(200).send(orders);
  })
);

orderRouter.get(
  '/orders/:userId',
  wrapAsync(async (req, res) => {
    const { userId } = req.params;

    const orders = await orderService.findOrdersByUserId(userId);

    res.status(200).send(orders);
  })
);

orderRouter.post(
  '/orders',
  wrapAsync(async (req, res) => {
    const { recipient, phoneNumber, products, userId, shippingAddress } =
      req.body;

    const resultJoi = postSchema.validate({
      recipient,
      phoneNumber,
      products,
      userId,
      shippingAddress,
    });

    if (resultJoi.error) {
      throw new AppError(400, '유효성 검사에서 실패했습니다!.');
    }

    const totalPrice = await orderService.calculateTotalPrice(products);

    const result = await orderService.addOrder({
      recipient,
      phoneNumber,
      totalPrice,
      products,
      shippingAddress,
      userId,
    });

    res.status(201).send(result);
  })
);

orderRouter.put(
  '/orders/:orderId',
  wrapAsync(async (req, res) => {
    const { orderId } = req.params;
    const { status, shippingAddress } = req.body;

    const result = putSchema.validate({ status, shippingAddress });

    if (result.error) {
      throw new AppError(400, '정보를 다 채워서 주세요!');
    }

    if (status) {
      const updatedOrder = await orderService.updateOrderStatus(orderId, {
        status,
      });

      return res.status(200).send(updatedOrder);
    } else if (shippingAddress) {
      const updatedOrder = await orderService.updateOrderShippingAddress(
        orderId,
        {
          shippingAddress,
        }
      );
      return res.status(200).send(updatedOrder);
    }

    res.status(200).send(orders);
  })
);

orderRouter.delete(
  '/orders/:orderId',
  wrapAsync(async (req, res) => {
    const { orderId } = req.params;
    const deletedOrder = await orderService.deleteOrder(orderId);

    res.status(201).send(deletedOrder);
  })
);

export { orderRouter };
