import { NextFunction, Request, Response } from "express";
// import userSessionService from "../services/session/index.js";
// import { jwtService } from "../lib/jwt.js";
import logs from '../lib/exceptions.js';
const { handleUserException } = logs;


class IdoorMiddleWare {
    async authUserResourceAccess(req: Request, res: Response, next: NextFunction, userId?: string) {
        try {
            const loginCookie = JSON.parse(req.cookies.loginCookie);
            const userResourceAccessId = req.params.userId ?? userId;
            
            if (!loginCookie || !loginCookie._id) {
                const response = {
                    status: 401,
                    message: "un authorized"
                }
                return res.status(200).json(response);
            }
    
            if (!userResourceAccessId || (userResourceAccessId !== loginCookie._Id)) {
                return res.status(401).json({status: 401, success: false, message: 'Un authorized'});
            }
    
            next();
        } catch (err) {
            console.error(err);
            handleUserException(res, 200, true, "Error occured while authenticating resource access", err);
        }
    }
}

const idoorMiddleWare = new IdoorMiddleWare();
export default idoorMiddleWare;