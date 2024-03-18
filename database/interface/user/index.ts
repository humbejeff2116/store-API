import { Types } from 'mongoose';
import UserModel, { User  } from "../../models/user/index.js";

const userDbInterface = {
    async create(details: User) { 
        try {
            const user = await UserModel.createUser(details);
            return user;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    async getAll() {
        try {
            const users = await UserModel.getAll();
            return users;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    async getByEmail(userEmail: string) {
        try {
            const user = await UserModel.getByEmail(userEmail);
            return user;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    async getById(userId: Types.ObjectId | string) {
        try {
            const user = await UserModel.getById(userId);
            return user;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    async updateProfileImage(userId: Types.ObjectId | string, profileImage) {
        try {
            const userResponse = await UserModel.updateProfileImage(userId, profileImage);
            return userResponse;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    async updateNotificationStatus(userId: Types.ObjectId | string, hasActiveNotification: boolean) {
        try {
            const userResponse = await UserModel.updateNotificationStatus(userId, hasActiveNotification);
            return userResponse;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    async userHasActiveNotification(userId: Types.ObjectId | string) {
        try {
            const user = await this.getById(userId);
            
            if (user && user.hasActiveNotification) {
                return true;
            }
            return false;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    async getPurchaseHistory(userId: Types.ObjectId | string) {
        const userResponse = await UserModel.getPurchaseHistory(userId);
        return userResponse;
    },
    async checkUserPassword(password: string, user): Promise<{error: boolean, match: boolean}> {
        return new Promise((res, rej) => {
            user.checkPassword(password, function (err: Error, isMatch: boolean) {
                if (err) {
                    rej(err);
                }
                if (!isMatch) {
                    res({error: false, match: false });
                }
                res({error: false, match: true });
            })
        })
    }
}

export default userDbInterface;