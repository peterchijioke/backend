import express, { Request, Response, NextFunction } from 'express';
import { Cart } from '../models/cart.model';
import { authenticateJWT } from '../middlewares/auth.middleware';

const router = express.Router();

// Get user cart
router.get('/', authenticateJWT, async (req: any, res: any) => {
  const cart = await Cart.findOne({ userId: req.user.id }).populate('items.productId');
  res.json(cart);
});

// Add item to cart
router.post('/', authenticateJWT, async (req: any, res: Response) => {
  const { productId, quantity } = req.body;

  let cart = await Cart.findOne({ userId: req.user.id });
  if (!cart) {
    cart = new Cart({ userId: req.user.id, items: [] });
  }

  const existingItem = cart.items.find(item => item.productId.toString() === productId);
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({ productId, quantity });
  }

  await cart.save();
  res.status(201).json(cart);
});

// Remove item from cart
router.delete('/:productId', authenticateJWT, async (req: any, res: any) => {
  const cart = await Cart.findOne({ userId: req.user.id });
  if (!cart) return res.status(404).json({ message: 'Cart not found' });

  cart.items = cart.items.filter(item => item.productId.toString() !== req.params.productId);
  await cart.save();
  res.json(cart);
});

export default router;
