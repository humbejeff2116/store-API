import express from 'express';
import collectionController from '../../controllers/collection/index.js';
import authMiddleWare from '../../middlewares/auth.js';
import idoorMiddleWare from '../../middlewares/idoor.js';
const router = express.Router();

// TODO... run idoor middleware
router.post(`/user/collection/:userId`, authMiddleWare.ensureUserIsAuthenticated, collectionController.create);
router.put(`/user/collection/add/:userId/:collectionId`, collectionController.add);
router.get(`/collection/:collectionId`, authMiddleWare.ensureUserIsAuthenticated, collectionController.get);
router.get(`/user/collection/:userId`, authMiddleWare.ensureUserIsAuthenticated, collectionController.getUser);
router.post(`/user/collection/remove/:collectionId/:userId`, collectionController.remove);
router.post(`/user/collection/product/remove/:collectionId/:userId`, collectionController.removeProduct);
export {
    router
} 