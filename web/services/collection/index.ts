import { Types } from "mongoose";
import { collectionDbInterface } from "../../../database/index.js";
import { CollectionProduct } from "../../../database/models/collection/index.js";

class CollectionService {
    async create(collectionDetails) { 
        try {
            const collection = await collectionDbInterface.create(collectionDetails);
            return collection;
        } catch (err) {
            console.error(err);
            throw err;
        } 
    }

    async add(
        collectionId: Types.ObjectId | string,
        userId: Types.ObjectId | string,
        product: CollectionProduct
    ) {
        try {
            const response = await  collectionDbInterface.add(collectionId, userId, product);
            return response;
        } catch (err) {
            console.error(err);
            throw err;
        } 
    }

    async get(collectionId: Types.ObjectId | string) {
        try {
            const collection = await collectionDbInterface.get(collectionId);
            return collection;
        } catch (err) {
            console.error(err);
            throw err;
        }
    }

    async getUser(userId: Types.ObjectId | string) {
        try {
            const collection = await collectionDbInterface.getUserCollection(userId);
            return collection;
        } catch (err) {
            console.error(err);
            throw err;
        }
    }

    async remove(
        collectionId: Types.ObjectId | string, 
        userId: Types.ObjectId | string
    ) {
        try {
            const removeResponse = await collectionDbInterface.remove(collectionId, userId);
            return removeResponse;
        } catch (err) {
            console.error(err);
            throw err;
        }
    }

    async removeProduct(
        collectionId: Types.ObjectId | string, 
        userId: Types.ObjectId | string,
        productId: Types.ObjectId | string
    ) {
        try {
            const removeResponse = await collectionDbInterface.removeProduct(collectionId, userId, productId);
            return removeResponse;
        } catch (err) {
            console.error(err);
            throw err;
        }
    }
}

const collectionService = new CollectionService();
export default collectionService;