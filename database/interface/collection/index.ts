import { Types } from 'mongoose';
import CollectionModel, { Collection, CollectionProduct } from '../../models/collection/index.js';

const collectionDbInterface = {
    async create(collectionDetails: Collection) { 
        try {
            const collection = await CollectionModel.createUserCollection(collectionDetails);
            return collection;
        } catch (err) {
            console.error(err);
            throw err;
        } 
    },
    async add(
        collectionId: Types.ObjectId | string,
        userId: Types.ObjectId | string,
        product: CollectionProduct
    ) {
        try {
            const response = await CollectionModel.add(collectionId, userId, product);
            return response;
        } catch (err) {
            console.error(err);
            throw err;
        } 
    },
    async get(collectionId: Types.ObjectId | string) {
        try {
            const collection = await CollectionModel.get(collectionId);
            return collection;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    async getUserCollection(userId: Types.ObjectId | string) {
        try {
            const collection = await CollectionModel.getUserCollection(userId);
            return collection;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    async remove(
        collectionId: Types.ObjectId | string, 
        userId: Types.ObjectId | string
    ) {
        try {
            const removeResponse = await CollectionModel.remove(collectionId, userId);
            return removeResponse;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    async removeProduct(
        collectionId: Types.ObjectId | string, 
        userId: Types.ObjectId | string,
        productId: Types.ObjectId | string
    ) {
        try {
            const removeResponse = await CollectionModel.removeProduct(collectionId, userId, productId);
            return removeResponse;
        } catch (err) {
            console.error(err);
            throw err;
        }
    }
}

export default collectionDbInterface;