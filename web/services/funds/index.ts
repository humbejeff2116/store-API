import { fundsDbInterface } from "../../../database/index.js";
import { Types } from "mongoose";
import walletHelpers from "./helpers.js";

const walletService = { 
    async create(userId: Types.ObjectId | string) {
        const response = await fundsDbInterface.createWallet(userId);
        return response;
    },
    async deposit(
        walletId: Types.ObjectId | string, 
        depositUserId: Types.ObjectId | string, 
        amount: number
    ) {
        try {
            const wallet = await fundsDbInterface.get(walletId);

            if (!wallet) {
                return({
                    success: false,
                    error: true,
                    status: 403,
                    message: "wallet not found",
                    data: null
                });
            }
 
            if (amount < 0) {
                return({
                    success: false,
                    error: true,
                    status: 403,
                    message: "invalid deposit amount",
                    data: null
                });
            }

            const response = await fundsDbInterface.deposit(walletId, depositUserId, amount);
            return response;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    async withdraw(
        walletId: Types.ObjectId | string, 
        withdrawUserId: Types.ObjectId | string, 
        amount: number
    ) {
        try {
            const wallet = await fundsDbInterface.get(walletId);

            if (!wallet) {
                return({
                    success: false,
                    error: true,
                    status: 403,
                    message: "wallet not found",
                    data: null
                });
            }
 
            if (wallet.amount < amount) {
                return({
                    success: false,
                    error: true,
                    status: 403,
                    message: "insufficient funds",
                    data: null
                });
            }

            const response = await fundsDbInterface.withdraw(walletId, withdrawUserId, amount);
            return response;
        } catch (err) {
            console.error(err);
            throw err;
        }

    }, 
    async getAll() {
        try {
            const response = await fundsDbInterface.getAllWallets();
            return response;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    async getUser(userId: Types.ObjectId | string) {
        try {
            const response = await fundsDbInterface.getUserWallet(userId);
            return response;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    async get(walletId: Types.ObjectId | string) {
        try {
            const wallet = await fundsDbInterface.get(walletId);
            return wallet;
        } catch (err) {
            console.error(err);
            throw err;
        }
    }
}

export default walletService;
export {
    walletHelpers
}