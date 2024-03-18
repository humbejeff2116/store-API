import { Types } from 'mongoose';
import ReviewModel, { Review, ReviewUser } from '../../models/review/index.js';

const reviewDbInterface = {
    async create(reviewDetails: Review) { 
        try {
            const review = await ReviewModel.createReview(reviewDetails);
            return review;
        } catch (err) {
            console.error(err);
            throw err;
        } 
    },
    async getAll() {
        try {
            const reviews = await ReviewModel.getAll();
            return reviews;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    async get(id: Types.ObjectId | string) {
        try {
            const removeResponse = await ReviewModel.get(id);
            return removeResponse;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    async getAllUser(userId: Types.ObjectId | string) {
        try {
            const reviews = await ReviewModel.getAllUser(userId);
            return reviews;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    async getUser(
        userId: Types.ObjectId | string, 
        productId: Types.ObjectId | string
    ) {
        try {
            const reviews = await ReviewModel.getUser(userId, productId);
            return reviews;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    async getAllProduct(productId: Types.ObjectId | string) {
        try {
            const allProductReviews = await ReviewModel.getAllProduct(productId);
            return allProductReviews;
        } catch (err) {
            console.error(err);
            throw err;
        }

    },
    async update<Type>(
        userId: Types.ObjectId | string, 
        productId: Types.ObjectId | string, 
        key: string, 
        value: Type
    ) {
        try {
            const updateResponse = await ReviewModel.update(userId,productId,key,value);
            return updateResponse;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    async addHelpful(userId: Types.ObjectId | string, productId: Types.ObjectId | string, helpful: ReviewUser) {
        try {
            const addHelpfulResponse = await ReviewModel.addHelpful(userId, productId, helpful);
            return addHelpfulResponse;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    async removeHelpful(userId: Types.ObjectId | string, productId: Types.ObjectId | string, helpful: ReviewUser) {
        try {
            const removeHelpfulResponse = await ReviewModel.removeHelpful(userId, productId, helpful);
            return removeHelpfulResponse;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    async addNotHelpful(userId: Types.ObjectId | string, productId: Types.ObjectId | string, notHelpful: ReviewUser) {
        try {
            const addNotHelpfulResponse = await ReviewModel.addNotHelpful(userId, productId, notHelpful);
            return addNotHelpfulResponse;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    async removeNotHelpful(userId: Types.ObjectId | string, productId: Types.ObjectId | string, notHelpful: ReviewUser) {
        try {
            const removeNotHelpfulResponse = await ReviewModel.removeNotHelpful(userId, productId, notHelpful);
            return removeNotHelpfulResponse;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    async remove(id: Types.ObjectId | string) {
        try {
            const removeResponse = await ReviewModel.remove(id);
            return removeResponse;
        } catch (err) {
            console.error(err);
            throw err;
        }
    }, 
    // async getUserHelpfulOrNotHelpfulReview(
    //     reviewId: Types.ObjectId | string, 
    //     userId: Types.ObjectId | string, 
    //     productId: Types.ObjectId | string,
    //     type: string
    // ) {
    //     try {
    //         const review = await ReviewModel.getUserHelpfulOrNotHelpfulReview(
    //             reviewId, 
    //             userId, 
    //             productId,
    //             type
    //         )
    //         return review;
    //     } catch (err) {
    //         console.error(err);
    //         throw err;
    //     }
    // }
}

export default reviewDbInterface;