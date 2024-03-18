import { Request } from "express";

class UserSession {
    #request: Request;
    setRequest(req: Request) {
        this.#request = req;
        return this;
    }
    async getSession(): Promise<any> {
        if (!this.#request) {
            throw new Error('request is not specified');
        }
        return new Promise((res, rej) => {
            const  sid = this.#request.sessionID;
            if (!sid) {
                console.log("sid not found on request ---state(session)")
                rej(sid);
            } 
            this.#request.sessionStore.get(sid, (err, data) => {
                if (err) {
                    rej(err);
                }
                res(data);
            }) 
        })
    }
    async saveToSession<Type>(key: string, val: Type) {
        if (!this.#request) {
            throw new Error('request is not specified');
        }
       this.#request.session[key] = val;
    }
    async deleteSession() {
        if (!this.#request) {
            throw new Error('request is not specified');
        }
        return new Promise((res, rej) => {
            const  sid = this.#request.sessionID;
            if (!sid) {
                console.log("sid not found on request ---state(session)")
                rej(sid);
            } 
            this.#request.sessionStore.destroy(sid, err => {
                if (err) {
                    rej(err);
                }
                res('ok');
            }) 
        })
    }
    async deleteAllSession() {
        if (!this.#request) {
            throw new Error('request is not specified');
        }
        return new Promise((res, rej) => { 
            this.#request.sessionStore.clear(err => {
                if (err) {
                    rej(err);
                }
                res('ok');
            }) 
        })   
    }
}

const userSession = new UserSession();
export default userSession;