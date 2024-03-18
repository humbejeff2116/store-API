import { Types } from "mongoose";
import { transactionDbInterface } from "../../../database/index.js";
import { Transaction } from "../../../database/models/transaction/index.js";

const transactionService = { 
    async create(transactionDetails: Transaction) { 
        try {
            const transaction = transactionDbInterface.create(transactionDetails);
            return transaction;
        } catch (err) {
            throw err;
        }
    },
    async getAll() {
        try {
            const response = await transactionDbInterface.getAll();
            return response;
        } catch (err) {
            console.error(err);
            throw err;
        } 
    },
    async get(tranactionId: Types.ObjectId | string) { 
        try {
            const response = await transactionDbInterface.get(tranactionId);
            return response;
        } catch (err) {
            throw err;
        } 
    },
    async getAllUser(userId: Types.ObjectId | string) {
        try {
            const response = await transactionDbInterface.getAllUser(userId);
            return response;
        } catch (err) {
            throw err;
        }
    },
    async getUser(tranactionId: Types.ObjectId | string, userId: Types.ObjectId | string) {
        try {
            const response = await transactionDbInterface.getUser(tranactionId, userId);
            return response;
        } catch (err) {
            throw err;
        }
    },
    async remove(tranactionId: Types.ObjectId | string, userId: Types.ObjectId | string) {
        try {
            const response = await transactionDbInterface.remove(tranactionId, userId);
            return response;
        } catch (err) {
            throw err;
        }
    }
}

export default transactionService;