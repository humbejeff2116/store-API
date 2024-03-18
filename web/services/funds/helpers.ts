import { Request } from "express";
import userSessionService from "../session/index.js";


class Helpers {
        // TODO... implement auth cookie functionality
    async authTransactionCookie(req: Request, cookie) {
        // const session = await userSession.setRequest(req).getSession();
        // if (cookie.id !== session.id) {
        //     return ({
        //         error: false,
        //         status: 400,
        //         message: 'session Authentication failed'
        //     })
        // }
        return ({
            error: false,
            status: 200,
            data: {}
        });
    }
    async saveToSession<Type>(req: Request, key: string, val: Type) {
        userSessionService.set(req).save(key, val);
        return true;
    }
    async getFromSession(key: string) {
        userSessionService.get();
    }
    async removeSession(req: Request) {
        userSessionService.set(req).deleteSession();
    }
}

const walletHelpers = new Helpers();
export default walletHelpers;