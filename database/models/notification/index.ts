import { Schema, model, Types, Model, HydratedDocument, } from 'mongoose';

interface NotificationItem {
    timestamp: Date
    title: string
    message: string
}

export interface Notification {
    _id?: Types.ObjectId
    userId: Types.ObjectId | string 
    title: string
    message: string
    // notifications: Array<NotificationItem>
    createdAt?: Date,
}

interface Response {
    status: number
    error: boolean 
    data: any
}

interface NotificationMethods {
    getMessage(): string; 
}

interface NotificationModelStatics extends Model<Notification, object, NotificationMethods> {
    createNotifcation(notification: Notification): Promise<HydratedDocument<Notification, NotificationMethods>>;
    get(id: Types.ObjectId | string): Promise<HydratedDocument<Notification, NotificationMethods>>;
    getAllUser(userId: Types.ObjectId | string): Promise<HydratedDocument<Notification, NotificationMethods>>;
    remove(userId: Types.ObjectId | string, notificationId: Types.ObjectId | string): Promise<Response>; 
}

const NotificationsSchema = new Schema<Notification, NotificationModelStatics, NotificationMethods>({
    userId: { type: String, required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
})

NotificationsSchema.static('createNotification', async function createNotification(notification: Notification): Promise<HydratedDocument<Notification, NotificationMethods>> {
    console.log("notification in model", notification);

    return await this.create({ 
        userId: notification.userId,
        title: notification.title,
        message: notification.message,
    });
});

NotificationsSchema.static('get', async function get(id: Types.ObjectId | string): Promise<HydratedDocument<Notification, NotificationMethods>> {
    const notification = await this.findOne({ _id: id });
    return notification;
});

NotificationsSchema.static('getAllUser', async function getAllUser(userId: Types.ObjectId | string): Promise<Array<HydratedDocument<Notification, NotificationMethods>>> {
    const notifications = await this.find({ userId: userId });
    return notifications;
});

NotificationsSchema.static('remove', async function remove(userId: Types.ObjectId | string, notificationId: Types.ObjectId | string): Promise<Response> {
    const removeNotification = await this.updateOne({ 
        $and: [{userId: userId}, { _id: notificationId }] 
    });
    return ({ status: 201, error: false, data: removeNotification })
});


const NotificationModel = model<Notification, NotificationModelStatics>('Notification', NotificationsSchema);
export default NotificationModel;