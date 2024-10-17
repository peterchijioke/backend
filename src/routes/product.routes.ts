// routes/product.routes.ts

import express from 'express';
import { authenticateJWT } from '../middlewares/auth.middleware';
import { getAllProducts, addProduct, updateProduct, deleteProduct } from '../controllers/product.controller';

const router = express.Router();

// Get all products (Public Route)
router.get('/', getAllProducts);

// Add new product (Protected Route - Product Owner Only)
router.post('/', authenticateJWT, addProduct);

// Update a product (Protected Route - Product Owner Only)
router.put('/:id', authenticateJWT, updateProduct);

// Delete a product (Protected Route - Product Owner Only)
router.delete('/:id', authenticateJWT, deleteProduct);

export default router;
