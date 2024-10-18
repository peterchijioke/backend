import express from 'express';
import { authenticateJWT } from '../middlewares/auth.middleware';
import { getAllProducts, addProduct, updateProduct, deleteProduct } from '../controllers/product.controller';
import { authenticateAdmin } from '../middlewares/admin.middleware';

const router = express.Router();

// Get all products (Public Route)
router.get('/', getAllProducts);

// Add new product (Protected Route - Admin Only)
router.post('/', authenticateJWT, authenticateAdmin, addProduct);

// Update a product (Protected Route - Admin Only)
router.put('/:id', authenticateJWT, authenticateAdmin, updateProduct);

// Delete a product (Protected Route - Admin Only)
router.delete('/:id', authenticateJWT, authenticateAdmin, deleteProduct);

export default router;
