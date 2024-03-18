import { Types } from 'mongoose';
import ProductModel, { ProductLike } from '../../models/product/index.js';

const productDbInterface = {
    async create(productDetails) { 
        try {
            const product = await ProductModel.createProduct(productDetails);
            return product;
        } catch (err) {
            console.error(err);
            throw err;
        } 
    },
    async getAll() {
        try {
            const products = await ProductModel.getAll();
            return products;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    async get(productId: Types.ObjectId | string) {
        try {
            const product = await ProductModel.get(productId);
            return product;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    async getWithLimitAndSkip(limit: number, skip: number) {
        try {
            const products = await ProductModel.getWithLimitAndSkip(limit, skip);
            return products;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    async like(id: Types.ObjectId | string, userLike: ProductLike) {
        try {
            const likeResponse = await ProductModel.like(id, userLike);
            return likeResponse;
        } catch (err) {
            console.error(err);
            throw err;
        }

    },
    async removeLike(productId: Types.ObjectId | string, userLike: ProductLike) {
        try {
            const likeResponse = await ProductModel.like(productId, userLike);
            return likeResponse;
        } catch (err) {
            console.error(err);
            throw err;
        }

    },
    async update<Type>(productId: Types.ObjectId | string, key: string, newValue: Type) {
        try {
            const updateResponse = await ProductModel.update(productId, key, newValue);
            return updateResponse;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    async remove(productId: Types.ObjectId | string) {
        try {
            const removeResponse = await ProductModel.remove(productId);
            return removeResponse;
        } catch (err) {
            console.error(err);
            throw err;
        }
    } 
}

export default productDbInterface;