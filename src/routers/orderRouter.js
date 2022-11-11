import { Router } from 'express';
import { orderService } from '../services/index.js';
import { wrapAsync } from '../utils/index.js';
import {
  orderCreateValidator,
  orderStatusUpdateValidator,
  orderShippingAddressUpdateValidator,
  authRequired,
} from '../middlewares/index.js';

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
  '/orders',
  wrapAsync(async (req, res) => {
    const userId = req.currentUserId;

    const orders = await orderService.findOrdersByUserId(userId);

    res.status(200).send(orders);
  })
);

orderRouter.get(
  '/orders/:orderId',
  wrapAsync(async (req, res) => {
    const { orderId } = req.params;
    console.log(orderId);

    const orders = await orderService.findOrder(orderId);

    res.status(200).send(orders);
  })
);

orderRouter.post(
  '/orders',
  orderCreateValidator,
  wrapAsync(async (req, res) => {
    const { products } = req.body;
    const userId = req.currentUserId;

    const totalPrice = await orderService.calculateTotalPrice(products);
    console.log(products);
    const result = await orderService.createOrder({
      ...req.body,
      user: userId,
      totalPrice,
    });

    res.status(201).send(result);
  })
);

orderRouter.put(
  '/admin/orders/:orderId',
  authRequired,
  orderStatusUpdateValidator,
  wrapAsync(async (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body;

    const updatedOrder = await orderService.updateOrderStatus(orderId, {
      status,
    });

    return res.status(201).send(updatedOrder);
  })
);

orderRouter.put(
  '/orders/:orderId',
  orderShippingAddressUpdateValidator,
  wrapAsync(async (req, res) => {
    const { orderId } = req.params;
    const { shippingAddress } = req.body;

    const updatedOrder = await orderService.updateOrderShippingAddress(
      orderId,
      { shippingAddress }
    );

    return res.status(201).send(updatedOrder);
  })
);

orderRouter.delete(
  '/admin/orders/:orderId',
  wrapAsync(async (req, res) => {
    const { orderId } = req.params;
    const deletedOrder = await orderService.deleteOrderByAdmin(orderId);

    res.status(201).send(deletedOrder);
  })
);

orderRouter.delete(
  '/orders/:orderId',
  wrapAsync(async (req, res) => {
    const { orderId } = req.params;
    const userId = req.currentUserId;
    const deletedOrder = await orderService.deleteOrderByUser(userId, orderId);

    res.status(201).send(deletedOrder);
  })
);

export { orderRouter };
