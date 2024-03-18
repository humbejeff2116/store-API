import express from 'express';
import reviewController from '../../controllers/review/index.js';
import { multerUploads } from "../../lib/multer.js";
import authMiddleWare from '../../middlewares/auth.js';
import idoorMiddleWare from '../../middlewares/idoor.js';
const router = express.Router();

// TODO... run idoor middleware
router.get('/reviews', reviewController.getAll);
router.post('/user/review', authMiddleWare.ensureUserIsAuthenticated, reviewController.create);
router.get('/review/:reviewId', authMiddleWare.ensureUserIsAuthenticated, reviewController.get);
router.get('/user/reviews/:userId', authMiddleWare.ensureUserIsAuthenticated, reviewController.getAllUser);
router.get('/user/review/:userId/:productId', authMiddleWare.ensureUserIsAuthenticated, reviewController.getUser);
router.put('/review/product/:productId/:userId', authMiddleWare.ensureUserIsAuthenticated, reviewController.update);
router.get('/reviews/product/:productId', authMiddleWare.ensureUserIsAuthenticated, reviewController.getAllProduct);
router.post('/review/remove/:reviewId', multerUploads, authMiddleWare.ensureUserIsAuthenticated, reviewController.remove);
router.put('/review/product/add/helpful/:productId/:userId', authMiddleWare.ensureUserIsAuthenticated, reviewController.addHelpful);
router.put('/review/product/remove/helpful/:productId/:userId', authMiddleWare.ensureUserIsAuthenticated, reviewController.removeHelpful);
router.put('/review/product/add/not-helpful/:productId/:userId', multerUploads, authMiddleWare.ensureUserIsAuthenticated, reviewController.addNotHelpful);
router.put('/review/product/remove/not-helpful/:productId/:userId', multerUploads, authMiddleWare.ensureUserIsAuthenticated, reviewController.removeNotHelpful);


export {
    router
}
