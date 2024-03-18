import { Request, Response } from 'express';
import { ResponseJSON } from '../../lib/responses.js';
import walletService, { walletHelpers } from '../../services/funds/index.js';
import userService from '../../services/user/index.js';
import userSessionService from '../../services/session/index.js';
import logs from '../../lib/exceptions.js';
const { handleUserException } = logs;


class Controller {
    async create(req: Request, res: Response) {
        const { userId } = req.body;

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

            const createWalletResponse = await walletService.create(userId);
            if (!createWalletResponse.success) {
                const response = {
                    error: true,
                    status: 200,
                    message: 'Failed to create user wallet'
                }
                return res.status(200).json(response);
            }

            const response = {
                error: false,
                status: 200,
                message: 'create user wallet successfully'
            }
            return res.status(200).json(response);
        } catch (err) {
            handleUserException(res, 500, true, "Error occured while creating wallet", err);
        }
    }
    async getAll(req: Request, res: Response) {
        try {
            const users = await walletService.getAll();
            res.status(200).json(users);
        } catch (err) {
            handleUserException(res, 500, true, "Error occured while getting wallets", err);
        } 
    }

    async getUser(req: Request, res: Response) {
        const { userId } = req.params;
        let response: ResponseJSON;

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
            const userWallet = await walletService.getUser(userId);
            console.log("user wallet", userWallet);

            if (!userWallet) {
                response = {
                    status: 200,
                    data: userWallet,
                    error: false,
                    message: 'user wallet not found',
                }
                return res.status(200).json(response);
            }
            
            response = {
                status: 200,
                data: userWallet,
                error: false,
                message: 'user wallet gotten succesfully',
            }

            return res.status(200).json(response);  
        } catch (err) {
            handleUserException(res, 500, true, "Error occured while getting user wallet", err);
        }
    }

    async withdraw(req: Request, res: Response) {
        const { userId } = req.params;
        const { walletId, amount, transactionCookie } = req.body;
        let response: ResponseJSON;

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
            
            const authTransactionCookieRes = await walletHelpers.authTransactionCookie(req, transactionCookie);

            if (authTransactionCookieRes.status !== 200) {
                response = {
                    status: 200,
                    data: authTransactionCookieRes.data,
                    error: false,
                    message: 'Transaction failed',
                }
                return res.status(200).json(response);

            }
            const withdrawResponse = await walletService.withdraw(walletId, transactionCookie.userId, amount);

            if (!withdrawResponse.success) {
                response = {
                    status: 200,
                    // data: withdrawResponse.data,
                    error: false,
                    message: 'Transaction failed',
                }
                return res.status(200).json(response);
            }
            walletHelpers.removeSession(req);
            
            response = {
                status: 200,
                // data: withdrawResponse.data,
                error: false,
                message: 'withdraw successful',
            }

            return res.status(200).json(response);  
        } catch (err) {
            handleUserException(res, 500, true, "Error occured while getting referral", err);
        }
    }

    // TODO... gen email verification code
    // save transaction details in user session
    // send tranaction details to client
    async genEmailVerificationCodeEndpoint(req: Request, res: Response) {
        const { userId } = req.params;
        
        try {
                        let response: ResponseJSON;
        } catch (err) {
            
        }
    }

    async genEmailVerificationCode(user) {
        if (!user) {
            return;
        } 
        
        const { email } = user;
        // TODO... gen verification and send to user email
        const message = `
        `
        // emailService.send(email, message);
        return ({
            status: 200,
            code: "",
        })
    }

    async authenticateUser(req: Request, res: Response) {
        const { userId, password } = req.body;
        try {
            const user = await userService.getById(userId);
    
            if (!user) {
                console.error('no user found');
                const response: ResponseJSON = {
                    status: 400,
                    error: true,
                    message: 'user not found',
                    data: null
                };
    
                return res.status(400).json(response);
            }
            const checkPassword = await userService.checkUserPassword(password, user);
    
            if (!checkPassword.match) {
                const response: ResponseJSON  = {
                    status: 400,
                    error: true,
                    message: 'Incorrect password.',
                    data: null
                }
                return res.status(400).json(response);
            }

            // gen email verification asynchrounously
            // save transaction details in session
            const emailVerificationCode = await this.genEmailVerificationCode(user);
            const date = Date.now();

            const transactionCookie = {
                userId: user._id,
                timestamp: date,
                expiresAt: date + 2 * 60 * 60 * 1000,
                emailVerificationCode: emailVerificationCode.code,
                emailVerificationPass: false,
                passwordVerificationPass: true
            }
            walletHelpers.saveToSession(req, `${user._id}-transaction`, transactionCookie)
            const response = {
                status: 200,
                error: false,
                transactionCookie: {},
                message: 'Password match'
            }
    
            return res.status(200).json(response);
        } catch (err) {
            handleUserException(res, 500, true, "Error occured while authenticating user", err);
        }
    }

    // TODO... get user transaction session
    // retreive code from session
    // verify against entered code
    async authEmailVerificationCode(req: Request, res: Response) {
        const { userId, code, transactionId } = req.body;

        // const transactionCookie = await walletService.getFromSession(`${userId}-transaction`);
        // if (transactionCookie.passwordVerificationPass && transactionCookie.emailVerificationCode === code) {
        //     const updateCookie = {
        //         ...transactionCookie,
        //         emailVerificationPass: true
        //     }
        //     walletService.saveToSession(req, `${userId}-transaction`, updateCookie);
        //     const response = {
        //         status: 200,
        //         success: true,
        //         message: "Email verification passed"
        //     }
        //     return res.status(200).json(response);
        // }

        const response = {
            status: 200,
            success: false,
            message: "Email verification failed"
        }
        return res.status(200).json(response);
    }
}


const controller = new Controller();
export default controller;