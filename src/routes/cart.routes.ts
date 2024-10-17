// routes/cart.routes.ts

import express from 'express';
import { authenticateJWT } from '../middlewares/auth.middleware';
import { getUserCart, addItemToCart,removeItemFromCart } from '../controllers/cart.controller';

const router = express.Router();

// Get user cart
router.get('/', authenticateJWT, getUserCart);

// Add item to cart
router.post('/', authenticateJWT, addItemToCart);

// Remove item from cart
router.delete('/:productId', authenticateJWT, removeItemFromCart);

export default router;
