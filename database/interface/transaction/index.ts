import { Types } from 'mongoose';
import TransactiontModel, { Transaction } from '../../models/transaction/index.js';

const transactionDbInterface = {
    async create(transactionDetails: Transaction) { 
        try {
            const transaction = TransactiontModel.createTransaction(transactionDetails)
            return transaction;
        } catch (err) {
            throw err;
        }
    },
    async getAll() {
        try {
            const response = await TransactiontModel.getAll();
            return response;
        } catch (err) {
            console.error(err);
            throw err;
        } 
    },
    async get(tranactionId: Types.ObjectId | string) { 
        try {
            const response = await TransactiontModel.get(tranactionId);
            return response;
        } catch (err) {
            throw err;
        } 
    },
    async getAllUser(userId: Types.ObjectId | string) {
        try {
            const response = await TransactiontModel.getAllUser(userId);
            return response;
        } catch (err) {
            throw err;
        }
    },
    async getUser(tranactionId: Types.ObjectId | string, userId: Types.ObjectId | string) {
        try {
            const response = await TransactiontModel.getUser(tranactionId, userId);
            return response;
        } catch (err) {
            throw err;
        }
    },
    async remove(tranactionId: Types.ObjectId | string, userId: Types.ObjectId | string) {
        try {
            const response = await TransactiontModel.remove(tranactionId, userId);
            return response;
        } catch (err) {
            throw err;
        }
    }
}

export default transactionDbInterface;