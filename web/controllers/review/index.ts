import { Request, Response } from 'express';
import logs from "../../lib/exceptions.js";
import { reviewService, userService } from '../../services/index.js';
import { ResponseJSON } from '../../lib/responses.js';

class Controller {
    async create(req: Request, res: Response) {
        const { userId } = req.params;
        const { reviewDetails } = req.body;

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
            const review = await reviewService.create(reviewDetails);

            if (review.reviewAlreadyExist) {
                const response: ResponseJSON = {
                    status: 200,
                    error: false,
                    message: "User has already reviewed product",
                    data: review.data
                }
                return res.status(200).json(response);  
            }
            const response: ResponseJSON = {
                status: 200,
                error: false,
                message: "Product reviewed successfyully",
                data: review.data
            }
            return res.status(200).json(response);
        } catch (err) {
            console.error(err);
            logs.handleUserException(res, 500, true, "Error occured while reviewing product", err);    
        }   
    }
    async getAll(req: Request, res: Response) {
        try {
            const reviews = await reviewService.getAll();
            const response: ResponseJSON = {
                status: 200,
                error: false,
                message: "Reviews gotten successfully",
                data: reviews
            }
            return res.status(200).json(response);
        } catch (err) {
            console.error(err);
            logs.handleUserException(res, 500, true, "Error occured while getting reviews", err);    
        }
    }
    async get(req: Request, res: Response) {
        const { reviewId } = req.params;

        try {
            const review = await reviewService.get(reviewId);
            const response: ResponseJSON = {
                status: 200,
                error: false,
                message: "product review gotten successfully",
                data: review
            }
            return res.status(200).json(response);
        } catch (err) {
            logs.handleUserException(res, 500, true, "Error occured while getting products", err);    
        }
    }
    async getAllUser(req: Request, res: Response) {
        const { userId } = req.params;

        try {
            const reviews = await reviewService.getAllUser(userId);
            const response: ResponseJSON = {
                status: 200,
                error: false,
                message: "All user reviews gotten successfully",
                data: reviews
            }
            return res.status(200).json(response);
        } catch (err) {
            logs.handleUserException(res, 500, true, "Error occured while getting user reviews", err);    
        }
    }
    async getUser(req: Request, res: Response) {
        const { userId, productId } = req.params;

        try {
            const review = await reviewService.getUser(userId, productId);
            const response: ResponseJSON = {
                status: 200,
                error: false,
                message: "user review gotten successfully",
                data: review
            }
            return res.status(200).json(response);

        } catch (err) {
            logs.handleUserException(res, 500, true, "Error occured while getting review", err);    
        }
    }
    async getAllProduct(req: Request, res: Response) {
        const { productId } = req.params;

        try {
            const allProductReviews = await reviewService.getAllProduct(productId);
            const response: ResponseJSON = {
                status: 200,
                error: false,
                message: "All product reviews gotten successfully",
                data: allProductReviews
            }
            return res.status(200).json(response);
        } catch (err) {
            logs.handleUserException(res, 500, true, "Error occured while getting product reviews", err);    
        }
    }
    async update(req: Request, res: Response) {
        const { userId, productId } = req.params;
        const { key, value }  = req.body.updateDetails;

        try {
            const updateResponse = await reviewService.update(userId, productId, key, value);
            const response: ResponseJSON = {
                status: 200,
                error: false,
                message: "Product review updated successfully",
                data: updateResponse.data
            }
            return res.status(200).json(response);
        } catch (err) {
            logs.handleUserException(res, 500, true, "Error occured while updating review", err);    
        }
    }
    async addHelpful(req: Request, res: Response) {
        const { userId, productId } = req.params;
        const { helpful } = req.body;
        try {
            const addHelpfulResponse = await reviewService.addHelpful(userId, productId, helpful);
            const response: ResponseJSON = {
                status: 200,
                error: false,
                message: "review helpful status added successfully",
                data: addHelpfulResponse.data
            }
            return res.status(200).json(response);
        } catch (err) {
            logs.handleUserException(res, 500, true, "Error occured while adding helpful status to review", err);    
        }
    }
    async removeHelpful(req: Request, res: Response) {
        const { userId, productId } = req.params;
        const { helpful } = req.body;
        try {
            const removeHelpfulResponse = await reviewService.removeHelpful(userId, productId, helpful);
            const response: ResponseJSON = {
                status: 200,
                error: false,
                message: "Product review removed successfully",
                data: removeHelpfulResponse.data
            }
            return res.status(200).json(response);
        } catch (err) {
            logs.handleUserException(res, 500, true, "Error occured while adding not helpful status to review", err);    
        }
    }
    async addNotHelpful(req: Request, res: Response) {
        const { userId, productId } = req.params;
        const { notHelpful } = req.body;

        try {
            const addNotHelpfulResponse = await reviewService.addNotHelpful(userId, productId, notHelpful);
            const response: ResponseJSON = {
                status: 200,
                error: false,
                message: "Product review removed successfully",
                data: addNotHelpfulResponse.data
            }
            return res.status(200).json(response);
        } catch (err) {
            logs.handleUserException(res, 500, true, "Error occured while adding  not helpful status to review", err);    
        }
    }
    async removeNotHelpful(req: Request, res: Response) {
        const { userId, productId } = req.params;
        const { notHelpful } = req.body;

        try {
            const removeNotHelpfulResponse = await reviewService.removeNotHelpful(userId, productId, notHelpful);
            const response: ResponseJSON = {
                status: 200,
                error: false,
                message: "Product review removed successfully",
                data: removeNotHelpfulResponse.data
            }
            return res.status(200).json(response);
        } catch (err) {
            logs.handleUserException(res, 500, true, "Error occured while removing not helpful status to review", err);    
        }
    }
    async remove(req: Request, res: Response) {
        const { reviewId } = req.params;
        try {
            const removeResponse = await reviewService.remove(reviewId);
            const response: ResponseJSON = {
                status: 200,
                error: false,
                message: "Product review removed successfully",
                data: removeResponse.data
            }
            return res.status(200).json(response);
        } catch (err) {
            logs.handleUserException(res, 500, true, "Error occured while removing review", err);    
        }
    }
}

const controller = new Controller();
export default controller;