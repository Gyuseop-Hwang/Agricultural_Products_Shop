import { model } from 'mongoose';
import { OrderSchema } from '../schemas/orderSchema';

const Order = model('Order', OrderSchema);

export class OrderModel {
    async findAll() {
        const orders = await Order.find({});
        return orders;
    }

    async findByUserId(userId) {
        const findedOrder = await Order.find({ userId });
        if (findedOrder.length < 1) return null;

        return findedOrder;
    }

    async create(orderInfo) {
        const createdOrder = new Order(orderInfo);
        await createdOrder.save();
        return createdOrder;
    }

    async update(orderId, updateInfo) {
        const filter = { _id: orderId };
        const option = { ...updateInfo };

        const updatedOrder = await Order.findOneAndUpdate(filter, option, {
            new: true,
        });

        return updatedOrder;
    }

    async delete(orderId) {
        const deletedOrder = await Order.findOneAndDelete({ _id: orderId });
        return deletedOrder;
    }
}

const orderModel = new OrderModel();
export { orderModel };
