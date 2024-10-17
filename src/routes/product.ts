import express, { Request, Response, NextFunction } from 'express';
import { Product } from '../models/product.model';
import { authenticateJWT } from '../middlewares/auth.middleware';
import { HttpError } from '../utils/httpError';

const router = express.Router();

// Get all products (Public Route)
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    next(error);  // Pass error to middleware
  }
});

// Add new product (Protected Route - Admin Only)
router.post('/', authenticateJWT, async (req: Request, res: Response, next: NextFunction) => {
  const { name, price, description, quantity } = req.body;

  try {
    const product = new Product({ name, price, description, quantity });
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    next(error);  // Pass error to middleware
  }
});

// Delete a product (Protected Route - Admin Only)
router.delete('/:id', authenticateJWT, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      throw new HttpError('Product not found', 404);  // Use custom HttpError
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    next(error);  // Pass error to middleware
  }
});

export default router;
