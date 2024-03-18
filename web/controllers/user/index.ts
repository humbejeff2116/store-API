import { Request, Response } from 'express';
import { uploadimageToCDN } from '../../lib/cdn.js';
import { ResponseJSON } from '../../lib/responses.js';
import { imageDataUri } from '../../lib/multer.js';
import { 
    // authenticateTokenWithSession, 
    jwtService, 
    signJsonWebToken 
} from '../../lib/jwt.js';
import userService from '../../services/user/index.js';
// import fundsService from '../../services/funds/index.js';
import userSessionService from '../../services/session/index.js';
import validateForm from '../../lib/formValidation.js';
import { filterUser } from '../../lib/shared.js';
import logs from '../../lib/exceptions.js';
const { handleUserException } = logs;


class Controller {
    async signUp(req: Request, res: Response) {
        const email = req.body.email;
        const refLink = req.body.referrerLink ? String(req.body.referrerLink) : '';
    
        console.log("signup details", req.body);
        validateForm(req, res);

        try {
            if (await userService.userExist(email, 'email')) {
                const response: ResponseJSON = {
                    status: 400,
                    error: true,
                    userExist: true,
                    message: "User account already exist",
                    // token: '',
                    data: null
                }
                return res.status(200).json(response);
            }
    
            const user = await userService.create(req.body);
            const token = signJsonWebToken(user, req);
            const tokenExpiration = (await jwtService.verify(token)).data.exp;
            const sessionUser = {
                id: user._id,
                jwtToken: token,
                jwtTokenExp: tokenExpiration
            }
            userSessionService.set(req).save("user", sessionUser);
            filterUser(user).then(user => {
                console.log("filtered user is" , user);
                const response = {
                    status: 200,
                    userExist: false,
                    data: user,
                    token: token,
                    tokenExpiration: tokenExpiration,
                    error: false,
                    message: 'user signed up',
                }
                return res.status(200).json(response);
            }).catch(err => { throw err });

            // fundsService.createWallet(user._id).then(res => {
            //     console.log("user wallet created successfully", res);
            // }).catch(err=> {
            //     console.error(err);
            // })
        } catch (err) {
            console.error(err);
            handleUserException(res, 500, true, "Error occured while creating account", err);
        }
    }
    async signIn(req: Request, res: Response) {
        const email = req.body.email;
        const password = req.body.password;
    
        try {
            const user = await userService.getByEmail(email);
            console.log("logged in user is --usercontroller", user);
    
            if (!user) {
                console.error('no user found');
                const response: ResponseJSON = {
                    status: 400,
                    error: true,
                    message: 'Incorrect email Address',
                    token: '',
                    data: null
                };
    
                return res.status(200).json(response);
            }
            const checkPassword = await userService.checkUserPassword(password, user);
    
            if (!checkPassword.match) {
                const response: ResponseJSON  = {
                    status: 400,
                    error: true,
                    message: 'Incorrect password.',
                    data: null
                }
                return res.status(200).json(response);
            }

            // const tokenExpiration = Date.now() + 2 * 60 * 60 * 1000;
            const token = signJsonWebToken(user, req);
            const tokenExpiration = (await jwtService.verify(token)).data.exp;
            const sessionUser = {
                id: user._id,
                jwtToken: token,
                jwtTokenExp: tokenExpiration
            }

            filterUser(user).then(user => {
                console.log("filterede user is" , user);
                const response = {
                    status: 200,
                    error: false,
                    data: user,
                    token: token,
                    tokenExpiration: tokenExpiration,
                    message: 'Login Successful'
                }
                return res.status(200).json(response);
            }).catch(err => { throw err });

            userSessionService.set(req).save("user", sessionUser);
        } catch(err) {
            console.error(err);
            handleUserException(res, 500, true, "Error occured while login in", err);
        }
    }
    async authenticateToken(req: Request, res: Response, next) {
        try {
            const clientToken = req.body['x-access-token'] || req.query['x-access-token'] || req.headers['x-access-token'];
            // const userSession = await userSessionService.setRequest(req).getSession();

            console.log(clientToken);
            // console.log("user session is", userSession);
            if (!clientToken) {
                return res.status(401).send({status: 401, success: false, message: 'Un authorized'});
            }

            const decodedToken = await jwtService.verify(clientToken);
            // console.log(decodedToken)

            if (!decodedToken ||  decodedToken.expired) {
                const response = {
                    status: 403,
                    authenticated: false
                }
                return res.status(200).json(response);
            }

            const response = {
                status: 200,
                authenticated: true
            }
            return res.status(200).json(response);
        } catch (err) {
            console.error(err);
            handleUserException(res, 200, true, "Error occured while authenticating user toke", err);
        }
    }
    async updateImage (req, res: Response) {
        const { userId } = JSON.parse(req.body || req.params);
        const profileImage = req.file ? imageDataUri(req).content : null;
    
        if (!profileImage) {
            const response: ResponseJSON = {
                status: 400,
                error: true,
                message: "Please provide a profile image",
                data: null
            }
            return res.status(200).json(response);
        }
    
        try {
            if (!await userService.userExist(userId, 'id')) {
                const response: ResponseJSON = {
                    status: 400,
                    error: true,
                    message: "No user found",
                    data: null
                }
                return res.status(200).json(response);
            }
            const newProfileImage = await uploadimageToCDN(profileImage);
            const user = await userService.updateProfileImage(userId, newProfileImage);

            const { status, error, data } = user;
            
            if (!error && status === 201) {
                // const token = signJsonWebToken(data, req);
                const response: ResponseJSON = {
                    status: 200,
                    data: data,
                    error: false,
                    message: 'Profile image updated successfully',
                    // token: token,
                }
                return res.status(200).json(response);
            }
        } catch(err) {
            console.error(err);
            handleUserException(res, 500, true, "Error occured while creating profile", err);
        }
    }
    async updateActiveNotification(req: Request, res: Response) {
        const { userId } = req.params;
        const { hasActiveNotification } = req.body;

        try {
            if (!await userService.userExist(userId, 'id')) {
                const response: ResponseJSON = {
                    status: 400,
                    error: true,
                    message: "No user found",
                    data: null
                }
                return res.status(200).json(response);
            }

            const updateResponse = await userService.updateNotificationStatus(userId, hasActiveNotification);

            const { status, error, data } = updateResponse;
            
            if (!error && status === 201) {
                const response: ResponseJSON = {
                    status: 200,
                    data: data,
                    error: false,
                    message: 'Active notification updated successfully',
                }
                return res.status(200).json(response);
            }
        } catch(err) {
            console.error(err);
            handleUserException(res, 500, true, "Error occured while updating active notification", err);
        }
    }
    async getAll(req: Request, res: Response) {
        try {
            const users = await userService.getAll();
            const response: ResponseJSON = {
                status: 200,
                data: users,
                error: false,
                message: 'users gotten successfully',
            }
            return res.status(200).json(response);
        } catch (err) {
            console.error(err);
            handleUserException(res, 500, true, "Error occured while getting users", err);
        } 
    }
    async get(req: Request, res: Response) {
        const { userId } = req.params;
        let response: ResponseJSON;
        try {
            const user = await userService.getById(userId);

            if (!user) {
                response = {
                    status: 200,
                    data: user,
                    error: false,
                    message: 'no user found',
                }
                return res.status(200).json(response);
            }
            
            response = {
                status: 200,
                data: user,
                error: false,
                message: 'user gotten successfully',
            }
            return res.status(200).json(response);
        } catch (err) {
            console.error(err);
            handleUserException(res, 500, true, "Error occured while getting user", err);
        } 
    }
    async getPurchaseHistory(req: Request, res: Response) {
        const { userId } = req.params;
        try {
            if (!await userService.userExist(userId, 'id')) {
                const response: ResponseJSON = {
                    status: 400,
                    error: true,
                    message: "No user found",
                    data: null
                }
                return res.status(200).json(response);
            }
            const userPurchaseHistory = await userService.getPurchaseHistory(userId);
            const response = {
                status: 200,
                data: userPurchaseHistory,
                error: false,
                message: 'user purchase history gotten successfully',
            }
            return res.status(200).json(response);
        } catch (err) {
            console.error(err);
            handleUserException(res, 500, true, "Error occured while getting user purchase history", err);
        } 
    }
}

const userController = new Controller();
export default userController;