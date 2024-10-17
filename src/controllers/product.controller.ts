
import { Request, Response, NextFunction } from 'express';
import { Product } from '../models/product.model';

// Get all products (Public Route)
export const getAllProducts = async (req: any, res: any, next: NextFunction) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    next(error);
  }
};

// Add new product (Protected Route - Product Owner Only)
export const addProduct = async (req: any, res: any, next: NextFunction) => {
  const { name, price, description, quantity } = req.body;

  try {
    const product = new Product({ name, price, description, quantity, owner: req.user.id });
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

// Update a product (Protected Route - Product Owner Only)
export const updateProduct = async (req: any, res: any, next: NextFunction) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this product' });
    }

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedProduct);
  } catch (error) {
    next(error);
  }
};

// Delete a product (Protected Route - Product Owner Only)
export const deleteProduct = async (req: any, res: any, next: NextFunction) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this product' });
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    next(error);
  }
};
