import express from 'express';
import userController from '../../controllers/user/index.js';
import { multerUploads } from "../../lib/multer.js";
import signupValidation from '../../controllers/user/validation/index.js';
import authMiddleWare from '../../middlewares/auth.js';
import idoorMiddleWare from '../../middlewares/idoor.js';
const router = express.Router();

// TODO... run idoor middleware
router.post('/user/signup', signupValidation, userController.signUp);
router.post('/user/signin', userController.signIn);
router.get('/users', authMiddleWare.ensureUserIsAuthenticated, userController.getAll);
router.get('/user/:userId', authMiddleWare.ensureUserIsAuthenticated, userController.get);
router.post('/user/jwt/auth', authMiddleWare.ensureUserIsAuthenticated, userController.authenticateToken);
router.put('/user/update/image/:userId', multerUploads, authMiddleWare.ensureUserIsAuthenticated, userController.updateImage);
router.put('/user/update/active-notification/:userId', multerUploads, authMiddleWare.ensureUserIsAuthenticated, userController.updateActiveNotification);
router.put('/user/purchase-history/:userId', multerUploads, authMiddleWare.ensureUserIsAuthenticated, userController.getPurchaseHistory);

export {
    router
}
