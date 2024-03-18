import { Types } from "mongoose";
import { notificationDbInterface } from "../../../database/index.js";

class NotificationService {
    async create(notificationDetails) { 
        try {
            const notification = await notificationDbInterface.create(notificationDetails);
            return notification;
        } catch (err) {
            console.error(err);
            throw err;
        } 
    }
    async get(notificationId: Types.ObjectId | string) {
        try {
            const notification = await notificationDbInterface.get(notificationId);
            return notification;
        } catch (err) {
            console.error(err);
            throw err;
        }
    }
    async getAllUser(userId: Types.ObjectId | string) {
        try {
            const notifications = await notificationDbInterface.getAllUser(userId);
            return notifications;
        } catch (err) {
            console.error(err);
            throw err;
        }
    }
    async remove(
        userId: Types.ObjectId | string, 
        notificationId: Types.ObjectId | string
    ) {
        try {
            const removeResponse = await notificationDbInterface.remove(userId, notificationId);
            return removeResponse;
        } catch (err) {
            console.error(err);
            throw err;
        }
    }
}

const notificationService = new NotificationService();
export default notificationService;