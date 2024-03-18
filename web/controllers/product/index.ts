import { Request, Response } from 'express';
import logs from "../../lib/exceptions.js";
import { productService } from '../../services/index.js';

class Controller {
    async create(req: Request, res: Response) { 
        try {
            const product = await productService.create(req.body);
            const response = {
                status: 200,
                error: false,
                data: product
            }
            return res.status(200).json(response);
        } catch (err) {
            console.error(err);
            logs.handleUserException(res, 500, true, "Error occured while getting products", err);    
        }   
    }

    async getAll(req: Request, res: Response) {
        const { limit, skip } = req.params;

        try {
            const products = (limit && skip) ? 
            await productService.getWithLimitAndSkip(Number(limit), Number(skip)) : 
            await productService.getAll(); 
            const response = {
                status: 200,
                error: false,
                data: products
            }
            return res.status(200).json(response);
        } catch (err) {
            console.error(err);
            logs.handleUserException(res, 500, true, "Error occured while getting products", err);    
        }  
    }

    async getWithLimitAndSkip(req: Request, res: Response) {
        const { skip, limit } = req.body;

        try {
            const products = await productService.getWithLimitAndSkip(skip, limit);
            const response = {
                status: 200,
                error: false,
                data: products
            }
            return res.status(200).json(response);
        } catch (err) {
            console.error(err);
            logs.handleUserException(res, 500, true, "Error occured while getting products", err);    
        }  
    }

    async get(req: Request, res: Response) {
        const { productId } = req.body || req.params;

        if (!productId) {
            console.log("product id is not provided");
            return;
        }

        try {
            const product = await productService.get(productId);
            const response = {
                status: 200,
                error: false,
                data: product
            }
            return res.status(200).json(response);
        } catch (err) {
            console.error(err);
            logs.handleUserException(res, 500, true, "Error occured while getting product", err);    
        }

    }

    async update(req: Request, res: Response) {
        const { productId, key, newValue } = req.body || req.params;

        if (!productId) {
            console.log("product id is not provided");
            return;
        }

        try {
            const update = await productService.update(productId, key, newValue);
            const response = {
                status: 200,
                error: false,
                message: "product updated successfully",
                data: null
            }
            return res.status(200).json(response);
        } catch (err) {
            console.error(err);
            logs.handleUserException(res, 500, true, "Error occured while updating product", err);    
        }

    }

    async remove(req: Request, res: Response) {
        const { productId } = req.body || req.params;

        if (!productId) {
            console.log("product id is not provided");
            return;
        }

        try {
            const remove = await productService.remove(productId);
            const response = {
                status: 200,
                error: false,
                message: "product removed successfully",
                data: null
            }
            return res.status(200).json(response);
        } catch (err) {
            console.error(err);
            logs.handleUserException(res, 500, true, "Error occured while removing product", err);    
        }
    }

    async like(req: Request, res: Response) {
        const { productId, userLike } = req.body;

        try {
            const likeResponse = await productService.like(productId, userLike);
            const response = {
                status: 200,
                error: false,
                message: "product liked successfully",
                data: null
            }
            return res.status(200).json(response);
        } catch (err) {
            console.error(err);
            logs.handleUserException(res, 500, true, "Error occured while liking product", err);    
        }
    }
}

const controller = new Controller();
export default controller;