import jwt from 'jsonwebtoken';
import configs from '../configs/index.js';
import { Types } from 'mongoose';
import { Request, Response } from 'express';
import userSessionService from '../services/session/index.js';

interface User {
    email: string,
    _id: Types.ObjectId | string
}

interface JwtRequest extends Request {
    decoded: any,
}

export function signJsonWebToken({ email, _id }: User, req: Request) {
    const token_payload = { email, id: _id };
    const token = jwt.sign(token_payload, configs.secret.jwtSecret, { expiresIn: '1h' });
    return token;
}

export default async function authenticateToken(req, res: Response, next: () => void) {
    const JWT_SECRET = configs.secret.jwtSecret;
    const clientToken = req.body['x-access-token'] || req.query['x-access-token'] || req.headers['x-access-token'];
    if (!clientToken) {
        return res.status(401).send({status: 401, success: false, message: 'Un authorized'});
    }

    try {
        const decodedToken = await verifyJwt(clientToken, JWT_SECRET);
        req.decoded = decodedToken;
        next()
    } catch (err) {
        return res.status(403).send({status: 403, success: false,  message: 'Failed to authenticate token.'});
    }
}


export function signAndSaveJwtToSession({ email, _id }: User, req: Request) {
    const token_payload = { email, id: _id };
    const token = jwt.sign(token_payload, configs.secret.jwtSecret, { expiresIn: '1h' });
    userSessionService.set(req).save('jwt', token);
    return token;
}

export async function authenticateTokenWithSession(req, res: Response, next: () => void) {
    const JWT_SECRET = configs.secret.jwtSecret;
    const clientToken = req.body['x-access-token'] || req.query['x-access-token'] || req.headers['x-access-token'];
    let serverToken;
    try {
        serverToken = await userSessionService.set(req).get();
    } catch (err) {
        // TODO... hanlde error
        // return res.status(403).send({status: 403, success: false,  message: 'Failed to authenticate token.'});
    }
    if (!clientToken || !serverToken) {
        return res.status(401).send({status: 401, success: false, message: 'Un authorized'});
    }

    if (clientToken !== serverToken) {
        return res.status(401).send({status: 401, success: false, message: 'Un authorized'});
    }

    try {
        const decodedToken = await verifyJwt(clientToken, JWT_SECRET);
        req.decoded = decodedToken;
        next()
    } catch (err) {
        return res.status(403).send({status: 403, success: false,  message: 'Failed to authenticate token.'});
    }
}


function verifyJwt(token: string, secret: string): Promise<{expired: boolean, data: any}> {
    return new Promise((res, rej) => {
        jwt.verify(token, secret, function (err, decoded) {
            if (err) {

                if (err.name === "TokenExpiredError") {
                    res({
                        expired: true,
                        data: err
                    });
                }
               rej(err);
            }
            res({
                expired: false,
                data: decoded
            });
        });
    })
}


class JwtService {
    #secret = configs.secret.jwtSecret;

    verify(token: string) {
       return verifyJwt(token, this.#secret); 
    }
}


export const jwtService = new JwtService();
