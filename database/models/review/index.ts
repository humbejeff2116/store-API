import { Schema, model, Types, Model, HydratedDocument, } from 'mongoose';

export interface ReviewUser {
    userId: Types.ObjectId | string
}

export interface Review {
    _id?: Types.ObjectId
    userId: Types.ObjectId | string
    productId: Types.ObjectId | string
    starRating: number
    review: string
    timestamp: string | Date
    helpful?: Array<ReviewUser>
    notHelpful?: Array<ReviewUser>
    createdAt?: Date
}

interface Response {
    status: number,
    error: boolean, 
    data: any
}

interface ReviewMethods {
    userExist(userId: Types.ObjectId | string, existType: string): boolean
}

export const userIn = {
    helpful: "helpful",
    notHelpful: "notHelpful"
}


interface ReviewModelStatics extends Model<Review, object, ReviewMethods> {
    createReview(review: Review): Promise<HydratedDocument<Review, ReviewMethods>>;
    getAll(): Promise<Array<HydratedDocument<Review, ReviewMethods>>>; 
    getAllUser(userId: Types.ObjectId | string): Promise<Array<HydratedDocument<Review, ReviewMethods>>>;
    getUser(userId: Types.ObjectId | string, productId: Types.ObjectId | string): Promise<Array<HydratedDocument<Review, ReviewMethods>>>;
    getAllProduct(productId: Types.ObjectId | string): Promise<Array<HydratedDocument<Review, ReviewMethods>>>;
    get(id: Types.ObjectId | string): Promise<HydratedDocument<Review, ReviewMethods>>;
    addHelpful(userId: Types.ObjectId | string, productId: Types.ObjectId | string, helpful: ReviewUser): Promise<Response>
    removeHelpful(userId: Types.ObjectId | string, productId: Types.ObjectId | string, helpful: ReviewUser): Promise<Response>
    addNotHelpful(userId: Types.ObjectId | string, productId: Types.ObjectId | string, notHelpful: ReviewUser): Promise<Response>
    removeNotHelpful(userId: Types.ObjectId | string, productId: Types.ObjectId | string, notHelpful: ReviewUser): Promise<Response>
    update<Type>(
        userId: Types.ObjectId | string, 
        productId: Types.ObjectId | string, 
        key: string, 
        value: Type
    ): Promise<Response>;
    remove(id: Types.ObjectId | string): Promise<Response>;
}

const ReviewSchema = new Schema<Review, ReviewModelStatics, ReviewMethods>({
    userId: { type: String, required: true, unique: true },
    productId: { type: String, required: true, unique: true },
    starRating: { type: Number, required: true, unique: true },
    review: { type: String, required: true, unique: true },
    timestamp: { type: String , required: true, unique: true },
    helpful: [{}],
    notHelpful: [{}],
    createdAt: { type: Date, default: Date.now }
})


ReviewSchema.static('createReview', async function createReview(review: Review): Promise<HydratedDocument<Review, ReviewMethods>> {
    console.log("review in model", review);

    return await this.create({ 
        userId: review.userId,
        productId: review.productId,
        starRating: review.starRating,
        review: review.review,
        timestamp: review.timestamp,
        helpful: review.helpful,
        notHelpful: review.notHelpful,
    });
});

ReviewSchema.static('getAll', async function getAll(): Promise<Array<HydratedDocument<Review, ReviewMethods>>> {
    const reviews = await this.find({});
    return reviews;
});

ReviewSchema.static('getAllUser', async function getAllUser(userId: Types.ObjectId | string): Promise<Array<HydratedDocument<Review, ReviewMethods>>> {
    const reviews = await this.find({userId: userId});
    return reviews;
});

ReviewSchema.static('getUser', async function getUser(userId: Types.ObjectId | string, productId: Types.ObjectId | string): Promise<HydratedDocument<Review, ReviewMethods>> {
    const review = await this.findOne({$and: [{userId: userId}, {productId: productId}]});
    return review;
});

ReviewSchema.static('getAllProduct', async function getAllProduct(productId: Types.ObjectId | string): Promise<Array<HydratedDocument<Review, ReviewMethods>>> {
    const reviews = await this.find({productId: productId});
    return reviews;
});

ReviewSchema.static('get', async function get(id: Types.ObjectId | string): Promise<HydratedDocument<Review, ReviewMethods>> {
    const review = await this.findOne({ _id: id });
    return review;
});

ReviewSchema.static('addHelpful', async function addHelpful(userId: Types.ObjectId | string, productId: Types.ObjectId | string, helpful: ReviewUser): Promise<Response> {
    const updateReview = await this.updateOne(
        { $and: [{userId: userId}, {productId: productId}] }, 
        { $push: {helpful: helpful} }
    );
    return ({status: 201, error: false, data: updateReview});
});

ReviewSchema.static('removeHelpful', async function removeHelpful(userId: Types.ObjectId | string, productId: Types.ObjectId | string, helpful: ReviewUser): Promise<Response> {
    const updateReview = await this.updateOne(
        { $and: [{userId: userId}, {productId: productId}] }, 
        { $pull: {helpful: helpful.userId} }
    );
    return ({status: 201, error: false, data: updateReview});
});

ReviewSchema.static('addNotHelpful', async function addNotHelpful(userId: Types.ObjectId | string, productId: Types.ObjectId | string, notHelpful: ReviewUser): Promise<Response> {
    const updateReview = await this.updateOne(
        { $and: [{userId: userId}, {productId: productId}] }, 
        { $push: {notHelpful: notHelpful} }
    );
    return ({status: 201, error: false, data: updateReview});
});

ReviewSchema.static('removeNotHelpful', async function removeNotHelpful(userId: Types.ObjectId | string, productId: Types.ObjectId | string, notHelpful: ReviewUser): Promise<Response> {
    const updateReview = await this.updateOne(
        { $and: [{userId: userId}, {productId: productId}] }, 
        { $pull: {notHelpful: notHelpful.userId} }
    );
    return ({status: 201, error: false, data: updateReview});
});

// ReviewSchema.static('getUserHelpfulOrNotHelpfulReview', async function getUserHelpfulOrNotHelpfulReview(
//     reviewId: Types.ObjectId | string, 
//     userId: Types.ObjectId | string, 
//     productId: Types.ObjectId | string,
//     type: string
// ): Promise<HydratedDocument<Review, ReviewMethods>> {
//     const  UserHelpfulReview = async () => {
//         const review = await this.findOne(
//             {$and: [
//                 {_id: reviewId}, 
//                 {productId: productId},
//                 {"helpful.userId": userId}
//             ]}
//         );
//         return review;
//     }

//     const UserNotHelpfulReview = async () => {
//         const review = await this.findOne(
//             {$and: [
//                 {_id: reviewId}, 
//                 {productId: productId},
//                 {"notHelpful.userId": userId}
//             ]}
//         );
//         return review;
//     }

//     switch (type) {
//         case userIn.helpful:
//             return await UserHelpfulReview();
//         case userIn.notHelpful: 
//             return await UserNotHelpfulReview();
//         default:
//             throw new Error("");
//     }
// });

ReviewSchema.static('update', async function update<Type>(
    userId: Types.ObjectId | string, 
    productId: Types.ObjectId | string, 
    key: string, 
    newValue: Type
): Promise<Response> {
    const response = await this.updateOne(
        { $and: [{userId: userId}, {productId: productId}] },
        { "$set": {[key]: newValue} }
    );

    return ({status: 201, error: false, data: response});
});

ReviewSchema.static('remove', async function remove(id: Types.ObjectId | string): Promise<Response> {
    const response = await this.findOneAndRemove({ _id: id });
    return ({status: 201, error: false, data: response});
});



// instance methods 

ReviewSchema.method('userExist', function userExist(
    userId: Types.ObjectId | string, 
    existType: string
) {
    const userInHelpful = () => {
        const helpful = this.helpful;

        for (let i = 0; i < helpful.length; i++) {
            if (helpful[i].userId === userId) {
                return true;
            }
        }
        return false;
    }

    const userInNotHelpful = () => {
        const notHelpful = this.notHelpful;

        for (let i = 0; i < notHelpful.length; i++) {
            if (notHelpful[i].userId === userId) {
                return true;
            }
        }
        return false;
    }

    switch (existType) {
        case userIn.helpful:
            return userInHelpful();
        case userIn.notHelpful: 
            return userInNotHelpful();
        default:
            throw new Error("");
    }
});

const ReviewModel = model<Review, ReviewModelStatics>('reviews', ReviewSchema);
export default ReviewModel;