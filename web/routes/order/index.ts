import express from 'express';
import orderController from '../../controllers/order/index.js';
import authMiddleWare from '../../middlewares/auth.js';
import idoorMiddleWare from '../../middlewares/idoor.js';
const router = express.Router();

// TODO... run idoor middleware
router.post('/user/order/:userId', authMiddleWare.ensureUserIsAuthenticated, orderController.create);
router.get('/orders', orderController.getAll);
router.get('/order/:orderId', orderController.get);
router.get('/user/orders/:userId', authMiddleWare.ensureUserIsAuthenticated, orderController.getUserOrders);
router.post('/user/order/remove/:orderId/:userId', authMiddleWare.ensureUserIsAuthenticated, orderController.remove);

export {
    router
} 