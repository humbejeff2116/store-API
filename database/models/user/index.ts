import { Schema, model, Types, Model, HydratedDocument, } from 'mongoose';
import bcrypt from 'bcryptjs';

interface Purchase {
    itemId: Types.ObjectId | string 
    timestamp: Date, 
}

export interface User {
    _id?: Types.ObjectId,
    fullName: string,
    email: string,
    userName: string,
    password: string,
    contactNumber?: string,
    profileImage?: string,
    purchaseHistory: Array<Purchase>
    hasActiveNotification?: boolean
    createdAt?: Date,
}

interface Response {
    status: number,
    error: boolean, 
    data: any
}

interface UserMethods {
    checkPassword(): (err: Error, isMatch: boolean) => void; 
}

interface UserModelStatics extends Model<User, object, UserMethods> {
    createUser(user: User): Promise<HydratedDocument<User, UserMethods>>;
    getAll(): Promise<Array<HydratedDocument<User, UserMethods>>>;
    getByEmail(email: string): Promise<HydratedDocument<User, UserMethods>>;
    getById(id: Types.ObjectId | string): Promise<HydratedDocument<User, UserMethods>>;
    updateProfileImage(id: Types.ObjectId | string, profileImage: string): Promise<Response>;
    getPurchaseHistory(userId: Types.ObjectId | string): Promise<HydratedDocument<User, UserMethods>>;
    updateNotificationStatus(userId: Types.ObjectId | string, hasActiveNotification: boolean): Promise<Response>;
}

const UserSchema = new Schema<User, UserModelStatics, UserMethods>({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    userName: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    contactNumber: { type: String },
    profileImage: { type: String },
    purchaseHistory: [{}],
    hasActiveNotification: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
})

UserSchema.pre('save', async function (next) {
    if (!this.isModified("password")) {
        return next();
    }

    this.password = await hashPassword(this.password);
})

async function hashPassword(password: string): Promise<string> {
    return new Promise((res, rej) => {
        bcrypt.genSalt(10, (err, salt) => {
            if (err) {
               return rej(err);
            }
    
            bcrypt.hash(password, salt, (err, hashedpassword) => {
                if (err) {
                    return rej(err);
                }
                res(hashedpassword);
            })
        })
    })
}

UserSchema.method('checkPassword', function checkPassword(guess: string, done: (err: Error, isMatch: boolean) => void): void {
    bcrypt.compare(guess, this.password, function(err, isMatch) {
        done(err, isMatch);
    });
});

UserSchema.method('getNotifications', function getNotifications(): Array<Notification> {
    return this.notifications;
});

UserSchema.static('createUser', async function createUser(user: User): Promise<HydratedDocument<User, UserMethods>> {
    console.log("user in model", user);

    return await this.create({ 
        fullName: user.fullName,
        email: user.email,
        userName: user.email,
        password: user.password,
    });
});

UserSchema.static('getAll', async function getAll(): Promise<Array<HydratedDocument<User, UserMethods>>> {
    const users = await this.find({}, {
        password: 0
    });
    return users;
});

UserSchema.static('getByEmail', async function getByEmail(email: string): Promise<HydratedDocument<User, UserMethods>> {
    const user = await this.findOne({ email });
    return user;
});

UserSchema.static('getById', async function getById(id: Types.ObjectId | string): Promise<HydratedDocument<User, UserMethods>> {
    const user = await this.findOne({ _id: id }, {
        password: 0
    });
    return user;
});

UserSchema.static('getPurchaseHistory', async function getPurchaseHistory(id: Types.ObjectId | string): Promise<Response> {
    const user = await this.findOne({ _id: id }, {
        password: 0
    });
    return ({status: 201, error: false, data: user.purchaseHistory});
});

UserSchema.static('updateProfileImage', async function updateProfileImage(id: Types.ObjectId | string, profileImage: string): Promise<Response> {
    await this.updateOne({ _id: id }, { "$set": {"profileImage": profileImage} });

    const user = await this.findOne({ _id: id }, {
        password: 0,
        createdAt: 0
    });
    return ({status: 201, error: false, data: user});
});

UserSchema.static('updateNotificationStatus', async function updateNotificationStatus(userId: Types.ObjectId | string, hasActiveNotification: boolean): Promise<Response> {
    const updateResponse = await this.updateOne(
        { _id: userId }, 
        { "$set": {"hasActiveNotification": hasActiveNotification} }
    );

    return ({status: 201, error: false, data: updateResponse});
});

const UserModel = model<User, UserModelStatics>('User', UserSchema);
export default UserModel;