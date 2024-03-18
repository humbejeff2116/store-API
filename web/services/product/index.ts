import { Types } from "mongoose";
import { productDbInterface } from "../../../database/index.js";
import { ProductLike } from "../../../database/models/product/index.js";


const productService = {
    async create(productDetails) { 
        try {
            const product = await productDbInterface.create(productDetails);
            return product;
        } catch (err) {
            console.error(err);
            throw err;
        } 
    },
    async getAll() {
        try {
            const products = await productDbInterface.getAll();
            return products;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    async get(productId: Types.ObjectId | string) {
        try {
            const products = await productDbInterface.get(productId);
            return products;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    async getWithLimitAndSkip(limit: number, skip: number) {
        try {
            const products = await productDbInterface.getWithLimitAndSkip(limit, skip);
            return products;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    async like(productId: Types.ObjectId | string, userLike: ProductLike) {
        try {
            const { like } = userLike;
            if (!like) {
                const likeResponse = await productDbInterface.removeLike(productId, userLike);
                return likeResponse;
            }
            const likeResponse = await productDbInterface.like(productId, userLike);
            return likeResponse;
        } catch (err) {
            console.error(err);
            throw err;
        }

    },
    async update<Type>(productId: Types.ObjectId | string, key: string, newValue: Type) {
        try {
            const updateResponse = await productDbInterface.update(productId, key, newValue);
            return updateResponse;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    async remove(productId: Types.ObjectId | string) {
        try {
            const removeResponse = await productDbInterface.remove(productId);
            return removeResponse;
        } catch (err) {
            console.error(err);
            throw err;
        }
    }
}

export default productService;