import { Schema, model, Types, Model, HydratedDocument, } from 'mongoose';

export interface Transaction {
    _id?: Types.ObjectId | string
    userId: string
    type: string
    timeStamp: string
    action: string
    createdAt?: Date
}

interface Response {
    status: number
    success: boolean
    error: boolean 
    data?: any
}

interface TransactionTypes {
    deposit: string
    withdraw: string
    makeTransfer: string
    recieveTransfer: string
    makePayment: string
}

export const transactionTypes: TransactionTypes = {
    deposit: "deposit",
    withdraw: "withdraw",
    makeTransfer: "makeTransfer",
    recieveTransfer: "recieveTransfer",
    makePayment: "makePayment"
}

interface TransactionMethods {
    getInfo(): () => void; 
}

interface TransactionModelStatics extends Model<Transaction, object, TransactionMethods> {
    createTransaction(transaction: Transaction): Promise<HydratedDocument<Transaction, TransactionMethods>>;
    getAll(): Promise<Array<HydratedDocument<Transaction, TransactionMethods>>>;
    get(id: Types.ObjectId | string): Promise<HydratedDocument<Transaction, TransactionMethods>>;
    getAllUser(userId: Types.ObjectId | string): Promise<Array<HydratedDocument<Transaction, TransactionMethods>>>;
    getUser(tranactionId: Types.ObjectId | string, userId: Types.ObjectId | string): Promise<HydratedDocument<Transaction, TransactionMethods>>;
    remove(tranactionId: Types.ObjectId | string, userId: Types.ObjectId | string): Promise<Response>;
}

const TransactionSchema = new Schema<Transaction, TransactionModelStatics, TransactionMethods>({
    userId: { type: String, required: true },
    type: { type: String, required: true },
    timeStamp: { type: String, required: true },
    action: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

TransactionSchema.static('createTransaction', async function createTransaction(transaction: Transaction): Promise<HydratedDocument<Transaction, TransactionMethods>> {
    return await this.create({ 
        userId: transaction.userId,
        type: transaction.type,
        timeStamp: transaction.timeStamp,
        action: transaction.action,
    });
});

TransactionSchema.static('getAll', async function getAll(): Promise<Array<HydratedDocument<Transaction, TransactionMethods>>> {
    return await this.find(); 
});

TransactionSchema.static('get', async function get(id: Types.ObjectId | string): Promise<HydratedDocument<Transaction, TransactionMethods>> {
    return await this.findOne({_id: id});
});

TransactionSchema.static('getAllUser', async function getAllUser(userId: Types.ObjectId | string): Promise<Array<HydratedDocument<Transaction, TransactionMethods>>> {
    return await this.find({userId: userId});
});

TransactionSchema.static('getUser', async function getUser(transactionId: Types.ObjectId | string, userId: Types.ObjectId | string): Promise<HydratedDocument<Transaction, TransactionMethods>> {
    const wallet = await this.findOne({ $and: [
        {_id: transactionId},
        {userId: userId}
    ]});
    return wallet;
});

TransactionSchema.static('remove', async function remove(transactionId: Types.ObjectId | string, userId: Types.ObjectId | string): Promise<Response> {
    const response = await this.deleteOne({
        $and: [
            {_id: transactionId},
            {userId: userId}
        ]
    });
    return ({status: 200, error: false, success: true, data: response});
});

const TransactionModel = model<Transaction, TransactionModelStatics>('Transaction', TransactionSchema);
export default TransactionModel;