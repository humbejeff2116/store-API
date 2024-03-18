import { Request, Response } from 'express';
import { ResponseJSON } from '../../lib/responses.js';
import userService from '../../services/user/index.js';
import { collectionService } from '../../services/index.js';
import logs from '../../lib/exceptions.js';
const { handleUserException } = logs;


class Controller {
    async create(req:Request, res: Response) { 
        const { userId } = req.params;
        const { collectionDetails } = req.body;

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

            const userCollection = await collectionService.create(collectionDetails);
            const response = {
                status: 200,
                data: userCollection,
                error: false,
                message: 'user collection created successfully',
            }
            return res.status(200).json(response);
        } catch (err) {
            console.error(err);
            handleUserException(res, 500, true, "Error occured while creating user collection", err);
        } 
    }

    async add(req:Request, res: Response) { 
        const { collectionId, userId } = req.params;
        const { product } = req.body;

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

            const addProductResponse = await collectionService.add(collectionId, userId, product);
            const response = {
                status: 200,
                data: addProductResponse.data,
                error: false,
                message: 'user collection created successfully',
            }
            return res.status(200).json(response);
        } catch (err) {
            console.error(err);
            handleUserException(res, 500, true, "Error occured while creating user collection", err);
        } 
    }

    async get(req:Request, res: Response) {
        const { collectionId } = req.params;
        try {
            const collection = await collectionService.get(collectionId);
            if (!collection) {
                const response = {
                    status: 200,
                    data: collection,
                    error: false,
                    message: 'no collection found',
                }
                return res.status(200).json(response);
            }
            const response = {
                status: 200,
                data: collection,
                error: false,
                message: 'collection gotten successfully',
            }
            return res.status(200).json(response);
        } catch (err) {
            console.error(err);
            handleUserException(res, 500, true, "Error occured while getting collection", err);
        } 
    }
    async getUser(req:Request, res: Response) {
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

            const userCollection = await collectionService.getUser(userId);
            if (!userCollection) {
                const response = {
                    status: 200,
                    data: userCollection,
                    error: false,
                    message: 'no user collection found',
                }
                return res.status(200).json(response);
            }
            const response = {
                status: 200,
                data: userCollection,
                error: false,
                message: 'user collection gotten successfully',
            }
            return res.status(200).json(response);
        } catch (err) {
            console.error(err);
            handleUserException(res, 500, true, "Error occured while getting user collection", err);
        }
    }
    async remove(req:Request, res: Response) {
        const { collectionId, userId } = req.params;

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

            const removeResponse = await collectionService.remove(collectionId, userId);
            const response = {
                status: 200,
                data: removeResponse,
                error: false,
                message: 'user collection removed successfully',
            }
            return res.status(200).json(response);
        } catch (err) {
            console.error(err);
            handleUserException(res, 500, true, "Error occured while removing user collection", err);
        }
    }
    async removeProduct(req: Request, res: Response) {
        const { userId } = req.params;
        const {  productId,  collectionId } = req.body;

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

            const removeResponse = await collectionService.removeProduct(collectionId, userId, productId);
            const response: ResponseJSON = {
                status: 200,
                error: true,
                message: "collection product removed successfully",
                data: removeResponse
            }
            return res.status(200).json(response);
        } catch (err) {
            console.error(err);
            handleUserException(res, 500, true, "Error occured while removing collection product", err);
        }
    }
}

const userController = new Controller();
export default userController;