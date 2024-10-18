import { Request, Response } from 'express';
import { Product } from '../models/product.model';

export const getAllProducts = async (req: any, res: any) => {
  try {
    const products = await Product.find();
    return res.status(200).json({
      status: 'success',
      products,
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Server error',
    });
  }
};

export const addProduct = async (req: any, res: any) => {
  const { name, price, description, quantity } = req.body;

  try {
    const product = new Product({ name, price, description, quantity, owner: req.user.id });
    await product.save();
    return res.status(201).json({
      status: 'success',
      message: 'Product added successfully',
      product,
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Failed to add product',
    });
  }
};

export const updateProduct = async (req: any, res: any) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const product = await Product.findByIdAndUpdate(id, updates, { new: true });
    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found',
      });
    }
    return res.status(200).json({
      status: 'success',
      message: 'Product updated successfully',
      product,
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Failed to update product',
    });
  }
};

export const deleteProduct = async (req: any, res: any) => {
  const { id } = req.params;

  try {
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found',
      });
    }
    return res.status(200).json({
      status: 'success',
      message: 'Product deleted successfully',
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Failed to delete product',
    });
  }
};
