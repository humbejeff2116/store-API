import { Types } from 'mongoose';
import NotificationModel from '../../models/notification/index.js';

const notificationDbInterface = {
    async create(notificationDetails) { 
        try {
            const notification = await NotificationModel.createNotifcation(notificationDetails);
            return notification;
        } catch (err) {
            console.error(err);
            throw err;
        } 
    },
    async get(notificationId: Types.ObjectId | string) {
        try {
            const notification = await NotificationModel.get(notificationId);
            return notification;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    async getAllUser(userId: Types.ObjectId | string) {
        try {
            const notifications = await NotificationModel.getAllUser(userId);
            return notifications;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    async remove(
        userId: Types.ObjectId | string, 
        notificationId: Types.ObjectId | string
    ) {
        try {
            const removeResponse = await  NotificationModel.remove(userId, notificationId);
            return removeResponse;
        } catch (err) {
            console.error(err);
            throw err;
        }
    }  
}

export default notificationDbInterface;