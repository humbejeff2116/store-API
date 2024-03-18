import express from 'express';
import walletController from '../../controllers/funds/index.js';
import authMiddleWare from '../../middlewares/auth.js';
import idoorMiddleWare from '../../middlewares/idoor.js';
const router = express.Router();


router.post('/user/wallet', authMiddleWare.ensureUserIsAuthenticated, walletController.create);
router.get('/wallets', walletController.getAll);
router.get('/user/wallet/:userId', authMiddleWare.ensureUserIsAuthenticated, walletController.getUser);
router.post('/user/withdraw', authMiddleWare.ensureUserIsAuthenticated, walletController.withdraw);
// router.post('transfer', authMiddleWare.ensureUserIsAuthenticated, walletController.transfer);
router.post('/user/gen-email-verification-code', authMiddleWare.ensureUserIsAuthenticated, walletController.genEmailVerificationCode);
router.post('/user/auth-user', authMiddleWare.ensureUserIsAuthenticated, walletController.authenticateUser);
router.post(`/user/auth-email-code`, authMiddleWare.ensureUserIsAuthenticated, walletController.authEmailVerificationCode);

export {
    router
}