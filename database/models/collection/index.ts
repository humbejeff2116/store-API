import { Schema, model, Types, Model, HydratedDocument, } from 'mongoose';


export interface CollectionProduct {
    id: Types.ObjectId | string
}

export interface Collection {
    _id?: Types.ObjectId
    userId: Types.ObjectId | string
    products: Array<CollectionProduct>
    createdAt?: Date 
} 

interface Response {
    status: number,
    error: boolean, 
    data: any
}

interface CollectionMethods {
    getDiscount(): number; 
}

interface CollectionModelStatics extends Model<Collection, object, CollectionMethods> {
    createUserCollection(collection: Collection): Promise<HydratedDocument<Collection, CollectionMethods>>;
    get(id: Types.ObjectId | string): Promise<HydratedDocument<Collection, CollectionMethods>>;
    getUserCollection(userId: Types.ObjectId | string): Promise<HydratedDocument<Collection, CollectionMethods>>;
    remove(id: Types.ObjectId | string, userId: Types.ObjectId | string): Promise<Response>;
    removeProduct(
        id: Types.ObjectId | string, 
        userId: Types.ObjectId | string,
        productId: Types.ObjectId | string
    ): Promise<Response>;
    add(
        id: Types.ObjectId | string,
        userId: Types.ObjectId | string,
        product: CollectionProduct
    ): Promise<Response>;
}

const CollectionSchema = new Schema<Collection, CollectionModelStatics, CollectionMethods>({
    userId: { type: String, required: true },
    products: [{}],
    createdAt: { type: Date, default: Date.now },
})

CollectionSchema.static('createUserCollection', async function createUserCollection(collection: Collection): Promise<HydratedDocument<Collection, CollectionMethods>> {
    console.log("collection in model", collection);

    return await this.create({ 
        userId: collection.userId,
        products: collection.products,
    });
});

CollectionSchema.static('add', async function add(
    id: Types.ObjectId | string,
    userId: Types.ObjectId | string,
    product: CollectionProduct
): Promise<Response> {
    const addProduct = await this.updateOne(
        { $and: [{_id: id}, {userId: userId}]}, 
        {$push: {products: product}}
    )
    return ({status: 201, error: false, data: addProduct});
});

CollectionSchema.static('get', async function get(id: Types.ObjectId | string): Promise<HydratedDocument<Collection, CollectionMethods>> {
    const collection = await this.findOne({ _id: id });
    return collection;
});

CollectionSchema.static('getUserCollection', async function getUserCollection(userId: Types.ObjectId | string): Promise<Array<HydratedDocument<Collection, CollectionMethods>>> {
    const collections = await this.find({ userId: userId });
    return collections;
});


CollectionSchema.static('remove', async function remove(id: Types.ObjectId | string, userId: Types.ObjectId | string): Promise<Response> {
    const removeCollection = await this.findOneAndRemove({ $and: [{_id: id}, {userId: userId}] });
    return ({status: 201, error: false, data: removeCollection});
});

CollectionSchema.static('removeProduct', async function removeProduct(
    id: Types.ObjectId | string, 
    userId: Types.ObjectId | string,
    productId: Types.ObjectId | string
): Promise<Response> {
    const removeProd = await this.updateOne(
        { $and: [{_id: id}, {userId: userId}] },  
        { $pull: { products: { id: productId }} }
    );
    return ({status: 201, error: false, data: removeProd});
});


const collectionModel = model<Collection, CollectionModelStatics>('collections', CollectionSchema);
export default collectionModel;