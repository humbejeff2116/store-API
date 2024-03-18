import express from 'express';
import productController from '../../controllers/product/index.js';
import authMiddleWare from '../../middlewares/auth.js';
import idoorMiddleWare from '../../middlewares/idoor.js';
const router = express.Router();

// TODO... run idoor and admin authentication middlewares
router.post('/product', productController.create);
router.get('/products', productController.getAll);
router.get('/product/:productId', productController.get);
router.put('/product/update/:productId', productController.update);
router.post('/product/remove/:productId', productController.remove);
router.get('/user/product/like/:productId', authMiddleWare.ensureUserIsAuthenticated, productController.like);

export {
    router
}  