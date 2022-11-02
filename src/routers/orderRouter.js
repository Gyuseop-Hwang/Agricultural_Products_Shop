import { Router } from 'express';
import { orderService } from '../services';
import { wrapAsync } from '../utils';
import { orderValidator, orderUpdateValidator } from '../middlewares'

const orderRouter = Router();

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
  orderValidator,
  wrapAsync(async (req, res) => {
    const { recipient, phoneNumber, products, userId, shippingAddress } =
      req.body;

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
  orderUpdateValidator,
  wrapAsync(async (req, res) => {
    const { orderId } = req.params;
    const { status, shippingAddress } = req.body;

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
