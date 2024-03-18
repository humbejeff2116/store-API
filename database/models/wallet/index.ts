import { Schema, model, Types, Model, HydratedDocument, } from 'mongoose';

type ObjectIdOrString = Types.ObjectId | string;

export interface Wallet {
    _id?: ObjectIdOrString
    userId: ObjectIdOrString
    amount?: number
    // transactions?: Array<Transaction>
    createdAt?: Date
}

interface Response {
    status: number
    success: boolean
    error: boolean 
    data?: any
}

interface WalletMethods {
    getInfo(): () => void; 
}

interface WalletModelStatics extends Model<Wallet, object, WalletMethods> {
    createWallet(wallet: Wallet): Promise<HydratedDocument<Wallet, WalletMethods>>;
    deposit(id: ObjectIdOrString, depositUserId: ObjectIdOrString, amount: number): Promise<Response>;
    withdraw(id: ObjectIdOrString, withdrawUserId: ObjectIdOrString, amount: number): Promise<Response>;
    getAll(): Promise<Array<HydratedDocument<Wallet, WalletMethods>>>;
    get(id: ObjectIdOrString): Promise<HydratedDocument<Wallet, WalletMethods>>;
    getUserWallet(userId: ObjectIdOrString): Promise<HydratedDocument<Wallet, WalletMethods>>;
}

const WalletSchema = new Schema<Wallet, WalletModelStatics, WalletMethods>({
    userId: { type: String, required: true },
    amount: { type: Number, default: 0.00 },
    // transactions: [{}],
    createdAt: { type: Date, default: Date.now },
})


WalletSchema.static('createWallet', async function createWallet(wallet: Wallet): Promise<HydratedDocument<Wallet, WalletMethods>> {
    return await this.create({ 
        userId: wallet.userId,
        amount: wallet.amount
    });
});

// TODO... crosscheck $inc method
WalletSchema.static('deposit', async function deposit(id: ObjectIdOrString, amount: number): Promise<Response> {
    const update = await this.findOneAndUpdate({_id: id}, {$inc: {amount: amount}});
    return ({
        status: 200,
        error: false,
        success: true,
        data: update
    }); 
});

WalletSchema.static('withdraw', async function withdraw(id: ObjectIdOrString, amount: number): Promise<Response> {
    const update = await this.findOneAndUpdate({_id: id}, {$inc: {amount: -amount}});
    return ({
        status: 200,
        error: false,
        success: true,
        data: update
    }); 
});

WalletSchema.static('getAll', async function getAll(): Promise<Array<HydratedDocument<Wallet, WalletMethods>>> {
    const wallets = await this.find({});
    return wallets;
});

WalletSchema.static('get', async function get(id: ObjectIdOrString): Promise<HydratedDocument<Wallet, WalletMethods>> {
    const wallet = await this.findOne({_id: id});
    return wallet;
});

WalletSchema.static('getUserWallet', async function getUserWallet(userId: ObjectIdOrString): Promise<HydratedDocument<Wallet, WalletMethods>> {
    const wallet = await this.findOne({userId: userId});
    return wallet;
});

const WalletModel = model<Wallet, WalletModelStatics>('Wallet', WalletSchema);
export default WalletModel;