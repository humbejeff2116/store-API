import { Types } from "mongoose";
import { productService } from "../../services/index.js";
import { orderDbInterface } from "../../../database/index.js";

class OrderService {
    async create(orderDetails) { 
        try {
            const order = await orderDbInterface.create(orderDetails);
            return order;
        } catch (err) {
            console.error(err);
            throw err;
        } 
    }
    async getAll() {
        try {
            const orders = await orderDbInterface.getAll();
            return orders;
        } catch (err) {
            console.error(err);
            throw err;
        }
    }
    async get(orderId: Types.ObjectId | string) {
        try {
            const order = await orderDbInterface.get(orderId);
            return order;
        } catch (err) {
            console.error(err);
            throw err;
        }
    }
    async getUserOrders(userId: Types.ObjectId | string) {
        try {
            const order = await orderDbInterface.getUserOrders(userId);
            return order;
        } catch (err) {
            console.error(err);
            throw err;
        }
    }
    async getWithLimitAndSkip(limit: number, skip: number) {
        try {
            const orders = await orderDbInterface.getWithLimitAndSkip(limit, skip);
            return orders;
        } catch (err) {
            console.error(err);
            throw err;
        }
    }
    async update<Type>(
        orderId: Types.ObjectId | string, 
        userId: Types.ObjectId | string, 
        key: string, 
        newValue: Type
    ) {
        try {
            const updateResponse = await orderDbInterface.update(orderId, userId, key, newValue);
            return updateResponse;
        } catch (err) {
            console.error(err);
            throw err;
        }
    }
    async remove(orderId: Types.ObjectId | string, userId: Types.ObjectId | string) {
        try {
            const removeResponse = await orderDbInterface.remove(orderId, userId);
            return removeResponse;
        } catch (err) {
            console.error(err);
            throw err;
        }
    }
    async patch(orders) {
        for (let i = 0; i < orders.length; i++) {
            const order = orders[i];
            const prodDetails = await this.#getProductsDetails(order.products);
            order.products = prodDetails;
        }
        return orders;
    }
    async #getProductsDetails(products) {
        const newProds = [];
    
        for (let i = 0; i < products.length; i++) {
            const product = await productService.get(products[i].id)
            newProds.push({...product, ...products[i]})
        } 
        return newProds;
    }

    async #getProductsDetails2(products) {
        const newProds = [];

        return new Promise((res, rej) => {
            for (let i = 0; i < products.length; i++) {
                try {
                    productService.get(products[i].id)
                    .then(product => {
                        newProds.push({...product, ...products[i]});
    
                        if (newProds.length === products.length) {
                            res(newProds);
                        }
                    })  
                } catch (err) {
                    rej(err);
                }
            }
        })
    }
}

const orderService = new OrderService();
export default orderService;