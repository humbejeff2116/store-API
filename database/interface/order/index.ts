import { Types } from 'mongoose';
import OrderModel from '../../models/order/index.js';

const orderDbInterface = {
    async create(orderDetails) { 
        try {
            const order = await OrderModel.createOrder(orderDetails);
            return order;
        } catch (err) {
            console.error(err);
            throw err;
        } 
    },
    async getAll() {
        try {
            const products = await OrderModel.getAll();
            return products;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    async get(orderId: Types.ObjectId | string) {
        try {
            const order = await OrderModel.get(orderId);
            return order;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    async getUserOrders(userId: Types.ObjectId | string) {
        try {
            const order = await OrderModel.getUserOrders(userId);
            return order;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    async getWithLimitAndSkip(limit: number, skip: number) {
        try {
            const orders = await OrderModel.getWithLimitAndSkip(limit, skip);
            return orders;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    async update<Type>(
        orderId: Types.ObjectId | string, 
        userId: Types.ObjectId | string, 
        key: string, 
        newValue: Type
    ) {
        try {
            const updateResponse = await OrderModel.update(orderId, userId, key, newValue);
            return updateResponse;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    async remove(
        orderId: Types.ObjectId | string, 
        userId: Types.ObjectId | string
    ) {
        try {
            const removeResponse = await OrderModel.remove(orderId, userId);
            return removeResponse;
        } catch (err) {
            console.error(err);
            throw err;
        }
    }
    
}

export default orderDbInterface;