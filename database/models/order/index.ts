import { Schema, model, Types, Model, HydratedDocument, } from 'mongoose';

export interface OrderProduct {
    productId: string
    quantity: number
    price: number
    discount: number
}

export interface Order {
    _id?: Types.ObjectId,
    timestamp: string
    userId: string
    totalAmount: number
    delivered: boolean
    products: Array<OrderProduct>
    createdAt?: Date
}

interface UpdateResponse {
    status: number,
    error: boolean, 
    data: any
}

interface OrderMethods {
    getDiscount(): number; 
}

interface OrderModelStatics extends Model<Order, object, OrderMethods> {
    createOrder(order: Order): Promise<HydratedDocument<Order, OrderMethods>>;
    getAll(): Promise<Array<HydratedDocument<Order, OrderMethods>>>;
    getWithLimitAndSkip(limit: number, skip: number): Promise<Array<HydratedDocument<Order, OrderMethods>>>;
    get(id: Types.ObjectId | string): Promise<HydratedDocument<Order, OrderMethods>>;
    getUserOrders(userId: Types.ObjectId | string): Promise<HydratedDocument<Order, OrderMethods>>;
    update<Type>(id: Types.ObjectId | string, userId: Types.ObjectId | string, key: string, newValue: Type): Promise<UpdateResponse>;
    remove(id: Types.ObjectId | string, userId: Types.ObjectId | string): Promise<UpdateResponse>;
}

const OrderSchema = new Schema<Order, OrderModelStatics, OrderMethods>({
    timestamp: { type: String, required: true },
    userId: { type: String, required: true },
    totalAmount: { type: Number, required: true },
    delivered: { type: Boolean, required: true },
    products: [{}],
    createdAt: { type: Date, default: Date.now },
})


OrderSchema.static('createOrder', async function createOrder(order: Order): Promise<HydratedDocument<Order, OrderMethods>> {
    console.log("order in model", order);

    return this.create({ 
        timestamp: order.timestamp,
        userId: order.userId,
        totalAmount: order.totalAmount,
        delivered: order.delivered,
        products: order.products,
    });
});

OrderSchema.static('getAll', async function getAll(): Promise<Array<HydratedDocument<Order, OrderMethods>>> {
    const orders = await this.find({});
    return orders;
});


OrderSchema.static('getWithLimitAndSkip', async function getWithLimitAndSkip(limit: number, skip: number): Promise<Array<HydratedDocument<Order, OrderMethods>>> {
    const orders = await this.find({}).limit(limit).skip(skip);
    return orders;
});

OrderSchema.static('get', async function get(id: Types.ObjectId | string): Promise<HydratedDocument<Order, OrderMethods>> {
    const order = await this.findOne({ _id: id });
    return order;
});

OrderSchema.static('getUserOrders', async function getUserOrders(userId: Types.ObjectId | string): Promise<Array<HydratedDocument<Order, OrderMethods>>> {
    const orders = await this.find({ userId: userId });
    return orders;
});

OrderSchema.static('update', async function update<Type>(
    id: Types.ObjectId | string,
    userId: Types.ObjectId | string, 
    key: string, 
    newValue: Type
): Promise<UpdateResponse> {
    await this.updateOne({ $and: [{_id: id}, {userId: userId}] }, { "$set": {[key]: newValue} });

    const order = await this.findOne({ _id: id });
    return ({status: 201, error: false, data: order});
});


OrderSchema.static('remove', async function remove(id: Types.ObjectId | string, userId: Types.ObjectId | string): Promise<UpdateResponse> {
    const removeOrder = await this.findOneAndRemove({ $and: [{_id: id}, {userId: userId}] });
    return ({status: 201, error: false, data: removeOrder});
});


const orderModel = model<Order, OrderModelStatics>('order', OrderSchema);
export default orderModel;