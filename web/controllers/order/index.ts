import { Request, Response } from 'express';
import logs from "../../lib/exceptions.js";
import { orderService, userService } from '../../services/index.js';
import { ResponseJSON } from '../../lib/responses.js';

class Controller {
    async create(req: Request, res: Response) {
        const { userId } =  req.params;
        const { orderDetails } = req.body
        
        try {
            if (!await userService.userExist(userId, 'id')) {
                const response: ResponseJSON = {
                    status: 400,
                    error: true,
                    message: "No user found",
                    data: null
                }
                return res.status(200).json(response);
            }

            const order = await orderService.create(orderDetails);
            const response: ResponseJSON = {
                status: 200,
                error: false,
                message: "order created successfully",
                data: order
            }
            return res.status(200).json(response);
        } catch (err) {
            logs.handleUserException(res, 500, true, "Error occured while creating order", err);    
        }
    }

    async getUserOrders(req: Request, res: Response) {
        const { userId } = req.params;
        try {
            if (!await userService.userExist(userId, 'id')) {
                const response: ResponseJSON = {
                    status: 400,
                    error: true,
                    message: "No user found",
                    data: null
                }
                return res.status(200).json(response);
            }

            const userOrders = await orderService.getUserOrders(userId);
            // user order products consist of productId alone
            // when order is gotten, loop through order products and
            // get and attach the products details and send to the client
            const patchUserOrders = await orderService.patch(userOrders);
            const response: ResponseJSON = {
                status: 200,
                error: false,
                message: "User orders gotten successfully",
                data: patchUserOrders 
            } 
            res.status(200).json(response);
        } catch (err) {
            logs.handleUserException(res, 500, true, "Error occured while getting user orders", err);    
        }
    }

    async getAll(req: Request, res: Response) {
        const { limit, skip } = req.query;

        try {
            const orders = (limit && skip) ? 
            await orderService.getWithLimitAndSkip(Number(limit), Number(skip)) : 
            await orderService.getAll(); 
  

            const response: ResponseJSON = {
                status: 200,
                error: false,
                message: "orders gotten successfully",
                data: orders
            }
            return res.status(200).json(response);
        } catch (err) {
            logs.handleUserException(res, 500, true, "Error occured while getting orders", err);    
        }
    }

    async get(req: Request, res: Response) {
        const { orderId } = req.params;

        try {
            const order = await orderService.get(orderId);
            const response: ResponseJSON = {
                status: 200,
                error: false,
                message: "order gotten successfully",
                data: order
            }
            return res.status(200).json(response);
        } catch (err) {
            logs.handleUserException(res, 500, true, "Error occured while getting order", err);    
        }
    }

    async getWithLimitAndSkip(req: Request, res: Response) {
        const { limit, skip } = req.query;

        try {
            const orders = await orderService.getWithLimitAndSkip(Number(limit), Number(skip));
            const response: ResponseJSON = {
                status: 200,
                error: false,
                message: "orders gotten successfully",
                data: orders
            }
            return res.status(200).json(response);
        } catch (err) {
            logs.handleUserException(res, 500, true, "Error occured while getting orders", err);    
        }
    }

    async remove(req: Request, res: Response) {
        const { userId, orderId } = req.params;

        try {
            if (!await userService.userExist(userId, 'id')) {
                const response: ResponseJSON = {
                    status: 400,
                    error: true,
                    message: "No user found",
                    data: null
                }
                return res.status(200).json(response);
            }

            const removeResponse = await orderService.remove(orderId, userId);
            const response: ResponseJSON = {
                status: 200,
                error: false,
                message: "order removed successfully",
                data: removeResponse 
            }
            return res.status(200).json(response);
        } catch (err) {
            logs.handleUserException(res, 500, true, "Error occured while removing order", err);    
        }
    }
}

const controller = new Controller();
export default controller;