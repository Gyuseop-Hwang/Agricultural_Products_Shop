import { Router } from 'express';
import { orderService } from '../services';
import { wrapAsync } from '../utils';
import {
  orderValidator,
  orderUpdateValidator,
  authRequired,
} from '../middlewares';

const orderRouter = Router();

orderRouter.get(
  '/admin/orders',
  authRequired,
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
    const { products } = req.body;

    const totalPrice = await orderService.calculateTotalPrice(products);

    const result = await orderService.createOrder({
      ...req.body,
      totalPrice,
    });

    res.status(201).send(result);
  })
);

orderRouter.put(
  '/admin/orders/:orderId',
  orderUpdateValidator,
  wrapAsync(async (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body;

    const updatedOrder = await orderService.updateOrderStatus(orderId, {
      status,
    });

    return res.status(200).send(updatedOrder);
  })
);

orderRouter.put(
  '/orders/:orderId',
  orderUpdateValidator,
  wrapAsync(async (req, res) => {
    const { orderId } = req.params;
    const { shippingAddress } = req.body;

    const updatedOrder = await orderService.updateOrderShippingAddress(
      orderId,
      {
        shippingAddress,
      }
    );

    return res.status(200).send(updatedOrder);
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
