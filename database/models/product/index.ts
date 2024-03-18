import { Schema, model, Types, Model, HydratedDocument, } from 'mongoose';

export interface ProductLike {
    like: boolean
    timestamp: Date | string
    userId: Types.ObjectId | string
}

export interface Product {
    _id?: Types.ObjectId,
    name: string,
    description: string,
    price: number,
    numSold: number
    discount: number
    category: string
    likesCount?: number 
    likes?: Array<ProductLike>
    createdAt?: Date
}

interface UpdateResponse {
    status: number,
    error: boolean, 
    data: any
}

interface ProductMethods {
    getDiscount(): number; 
}

// TODO... type like() -> userLike parameter
interface ProductModelStatics extends Model<Product, object, ProductMethods> {
    createProduct(product: Product): Promise<HydratedDocument<Product, ProductMethods>>;
    getAll(): Promise<Array<HydratedDocument<Product, ProductMethods>>>;
    getWithLimitAndSkip(limit: number, skip: number): Promise<Array<HydratedDocument<Product, ProductMethods>>>;
    get(id: Types.ObjectId | string): Promise<HydratedDocument<Product, ProductMethods>>;
    like(id: Types.ObjectId | string, userLike): Promise<UpdateResponse>
    removeLike(id: Types.ObjectId | string, userLike): Promise<UpdateResponse>
    update<Type>(id: Types.ObjectId | string, key: string, newValue: Type): Promise<UpdateResponse>;
    remove(id: Types.ObjectId | string): Promise<UpdateResponse>;
}

const ProductSchema = new Schema<Product, ProductModelStatics, ProductMethods>({
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    price: { type: Number, required: true},
    numSold: { type: Number, required: true },
    discount: { type: Number, required: true },
    category: { type: String, required: true },
    likesCount: { type: Number, default: 0 }, 
    likes: [{}],
    createdAt: { type: Date, default: Date.now },
})


ProductSchema.static('createProduct', async function createProduct(product: Product): Promise<HydratedDocument<Product, ProductMethods>> {
    console.log("product in model", product);

    return this.create({ 
        name: product.name,
        description: product.description,
        price: product.price,
        numSold: product.numSold,
        discount: product.discount,
        category: product.category,
    });
});

ProductSchema.static('getAll', async function getAll(): Promise<Array<HydratedDocument<Product, ProductMethods>>> {
    const products = await this.find({});
    return products;
});


ProductSchema.static('getWithLimitAndSkip', async function getWithLimitAndSkip(limit: number, skip: number): Promise<Array<HydratedDocument<Product, ProductMethods>>> {
    const products = await this.find({}).limit(limit).skip(skip);
    return products;
});

ProductSchema.static('get', async function get(id: Types.ObjectId | string): Promise<HydratedDocument<Product, ProductMethods>> {
    const product = await this.findOne({ _id: id });
    return product;
});

ProductSchema.static('update', async function update<Type>(id: Types.ObjectId | string, key: string, newValue: Type): Promise<UpdateResponse> {
    await this.updateOne({ _id: id }, { "$set": {[key]: newValue} });

    const product = await this.findOne({ _id: id });
    return ({status: 201, error: false, data: product});
});

ProductSchema.static('like', async function like(id: Types.ObjectId | string, userLike): Promise<UpdateResponse> {
    const updateProd = await this.updateOne({ _id: id }, { $push: {likes: userLike }, $inc: { likesCount: 1 }});
    return ({status: 201, error: false, data: updateProd});
});

ProductSchema.static('removeLike', async function removeLike(id: Types.ObjectId | string, userLike): Promise<UpdateResponse> {
    const updateProd = await this.updateOne({ _id: id },  { $pull: { likes: { userId: userLike.userId }, $inc: { likesCount: -1 } }});
    return ({status: 201, error: false, data: updateProd});
});

ProductSchema.static('remove', async function remove(id: Types.ObjectId | string): Promise<UpdateResponse> {
    const removeProduct = await this.findOneAndRemove({ _id: id });
    return ({status: 201, error: false, data: removeProduct});
});

// instance methods
ProductSchema.method('getDiscount',function getDiscount(): number {
    return this.discount
});




// ProductSchema.static('updateCashRewardReleaseStatus', async function updateCashRewardReleaseStatus(id: Types.ObjectId | string, status: boolean): Promise<UpdateResponse> {
//     const rewardStatus = await this.updateOne(
//         { _id: id }, 
//         { "$set": {"cashReward.$.released": status} }
//     );
//     return ({status: 201, error: false, data: rewardStatus});
// });

const ProductModel = model<Product, ProductModelStatics>('product', ProductSchema);
export default ProductModel;