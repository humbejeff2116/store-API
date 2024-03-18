import { Types } from 'mongoose';
import WalletModel, { Wallet } from '../../models/wallet/index.js';
import { walletsCacheInterface } from '../../../cache/index.js';


const fundsDbInterface = {
    async createWallet(userId: Types.ObjectId | string) { 
        const wallet: Wallet = {
            userId: userId,
            amount: 0.00
        } 
        if (this._userWalletExist(userId, "useUserId")) {
            return ({
                success: false,
                error: false,
                status: 400,
                message: 'user wallet already exist'
            })
        }
        const response = await WalletModel.createWallet(wallet);
        return ({
            success: true,
            error: false,
            status: 200,
            data: response,
            message: 'wallet created successfully'
        });
    },
    async withdraw(
        walletId: Types.ObjectId | string, 
        withdrawUserId: Types.ObjectId | string,  
        amount: number
    ) {
        try {
            if (!this._userWalletExist(walletId, "useWalletId")) {
                return ({
                    success: false,
                    error: false,
                    status: 400,
                    message: 'user wallet does not exist'
                })
            } 
            const response = await WalletModel.withdraw(walletId, withdrawUserId, amount);
            return response;
        } catch (err) {
            console.error(err);
            throw err;
        } 
    },
    async deposit(
        walletId: Types.ObjectId | string,
        depositUserId: Types.ObjectId | string, 
        amount: number
    ) { 
        try {
            if (!this._userWalletExist(walletId, "walletId")) {
                return ({
                    success: false,
                    error: false,
                    status: 400,
                    message: 'user wallet does not exist'
                })
            } 
            const response = await WalletModel.deposit(walletId, depositUserId, amount);
            return response;
        } catch (err) {
            console.error(err);
            throw err;
        } 
    },
    async getAllWallets() {
        try {
            const wallets = await WalletModel.getAll();
            return wallets;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    async getUserWallet(userId: Types.ObjectId | string) {
        try {
            const wallet = await WalletModel.getUserWallet(userId);
            return wallet;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    async get(walletId: Types.ObjectId | string) {
        try {
            const wallet = await WalletModel.get(walletId);
            return wallet;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },

    async _userWalletExist(id: Types.ObjectId | string, idType: string) {
        try {
            switch (idType) {
                case "useUserId":
                    return getByUserId(id);
                case "useWalletId":
                    return getByWalletId(id);
                default:
                    throw new Error("invalid idType parameter passed");
            }

            async function getByWalletId(id: Types.ObjectId | string) {
                const wallet = await WalletModel.getUserWallet(id);
                return wallet ? true : false;
            }

            async function getByUserId(id: Types.ObjectId | string) {
                const wallet = await WalletModel.getUserWallet(id);
                return wallet ? true : false;
            }
        } catch (err) {
            console.error(err)
            throw err;
        }
    }
}

export default fundsDbInterface;