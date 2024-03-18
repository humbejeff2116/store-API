import { Types } from "mongoose";
import { reviewDbInterface } from "../../../database/index.js";
import { Review, ReviewUser, userIn } from "../../../database/models/review/index.js";


const reviewService = {
    async create(reviewDetails: Review) {
        const { userId, productId } = reviewDetails;

        try {
            const userProdReview = reviewDbInterface.getUser(userId, productId);
            if (userProdReview) {
                return ({
                    reviewAlreadyExist: true,
                    data: null
                });
            }
            const review = await reviewDbInterface.create(reviewDetails);
            return ({
                reviewAlreadyExist: false,
                data: review
            });
        } catch (err) {
            console.error(err);
            throw err;
        } 
    },
    async getAll() {
        try {
            const reviews = await reviewDbInterface.getAll();
            return reviews;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    async get(id: Types.ObjectId | string) {
        try {
            const review = await reviewDbInterface.get(id);
            return review;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    async getAllUser(userId: Types.ObjectId | string) {
        try {
            const reviews = await reviewDbInterface.getAllUser(userId);
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
            const review = await reviewDbInterface.getUser(userId, productId);
            return review;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    async getAllProduct(productId: Types.ObjectId | string) {
        try {
            const allProductReviews = await reviewDbInterface.getAllProduct(productId);
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
            const updateResponse = await reviewDbInterface.update(userId,productId,key,value);
            return updateResponse;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    async addHelpful(
        userId: Types.ObjectId | string, 
        productId: Types.ObjectId | string, 
        helpful: ReviewUser
    ) {
        const { userId:helpfulUserId } = helpful;

        try {
            const review = await reviewDbInterface.getUser(userId, productId);
            if (!this._userExist(review, helpfulUserId, userIn.helpful)) {
                const addHelpfulResponse = await reviewDbInterface.addHelpful(userId, productId, helpful);
                return addHelpfulResponse;
            }
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    async addNotHelpful(
        userId: Types.ObjectId | string, 
        productId: Types.ObjectId | string, 
        notHelpful: ReviewUser
    ) {
        const { userId:notHelpfulUserId } = notHelpful;
        try {
            const review = await reviewDbInterface.getUser(userId, productId);

            if (!this._userExist(review, notHelpfulUserId, userIn.notHelpful)) {
                const addNotHelpfulResponse = await reviewDbInterface.addNotHelpful(userId, productId, notHelpful);
                return addNotHelpfulResponse;
            }
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    async removeHelpful(
        userId: Types.ObjectId | string, 
        productId: Types.ObjectId | string, 
        helpful: ReviewUser
    ) {
        const { userId:helpfulUserId } = helpful;

        try {
            const review = await reviewDbInterface.getUser(userId, productId);

            if (this._userExist(review, helpfulUserId, userIn.helpful)) {
                const removeHelpfulResponse = await reviewDbInterface.removeHelpful(userId, productId, helpful);
                return removeHelpfulResponse;
            }
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    async removeNotHelpful(
        userId: Types.ObjectId | string, 
        productId: Types.ObjectId | string, 
        notHelpful: ReviewUser
    ) {
        const { userId:notHelpfulUserId } = notHelpful;

        try {
            const review = await reviewDbInterface.getUser(userId, productId);

            if (this._userExist(review, notHelpfulUserId, userIn.notHelpful)) {
                const removeNotHelpfulResponse = await reviewDbInterface.removeNotHelpful(userId, productId, notHelpful);
                return removeNotHelpfulResponse;
            }
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    async remove(id: Types.ObjectId | string) {
        try {
            const removeResponse = await reviewDbInterface.remove(id);
            return removeResponse;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },

    _userExist(
        review,
        userId: Types.ObjectId | string,
        existType: string
    ) {
        return review.userExist(userId, existType);
    },
}

export default reviewService;