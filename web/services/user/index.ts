import { Types } from "mongoose";
import { userDbInterface } from "../../../database/index.js";
import { User } from "../../../database/models/user/index.js";


const userService = {
    async create(details: User) { 
        try {
            const user = await userDbInterface.create(details);
            return user;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    async getAll() {
        try {
            const users = await userDbInterface.getAll();
            return users;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    async getByEmail(userEmail: string) {
        try {
            const user = await userDbInterface.getByEmail(userEmail);
            return user;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    async getById(userId: Types.ObjectId | string) {
        try {
            const user = await userDbInterface.getById(userId);
            return user;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    async updateProfileImage(userId: Types.ObjectId | string, profileImage) {
        try {
            const userResponse = await userDbInterface.updateProfileImage(userId, profileImage);
            return userResponse;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    async updateNotificationStatus(userId: Types.ObjectId | string, hasActiveNotification: boolean) {
        try {
            if (await userDbInterface.userHasActiveNotification(userId)) {
                return ({status: 201, error: false, message: "active notification already exist", data: null});
            }

            const userResponse = await userDbInterface.updateNotificationStatus(userId, hasActiveNotification);
            return userResponse;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    async getPurchaseHistory(userId: Types.ObjectId | string) {
        try {
            const userResponse = await userDbInterface.getPurchaseHistory(userId);
            return userResponse;
        } catch (err) {
            console.error(err);
            throw err;
        }
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
    },
    async userExist(id: string, idType: string): Promise<boolean> {
        const userWithIdExist = async (id: string): Promise<boolean> => {
            return await this.getById(id) ? true : false;
        }

        const userWithEmailExist = async (email: string): Promise<boolean> => {
            return await this.getByEmail(email) ? true : false;
        }

        switch (idType) {
            case "email":
                return userWithEmailExist(id);
            case "id": 
                return userWithIdExist(id);
            default:
                throw new Error('idType is not defined');
        }
    },
}

export default userService;