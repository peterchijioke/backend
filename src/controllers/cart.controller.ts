
import { Cart } from '../models/cart.model';
import { plainToClass } from 'class-transformer';
import { AddItemToCartDto } from '../dtos/addItemToCart.dto';
import { validate } from 'class-validator';
import { Types } from 'mongoose';
import { RemoveItemFromCartDto } from '../dtos/removeItemFromCart.dto';

// Get user cart
export const getUserCart = async (req: any, res: any) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id }).populate('items.productId');

    if (!cart) {
      return res.status(404).json({
        status: 'error',
        message: 'Cart not found',
      });
    }

    // Standard success response
    return res.status(200).json({
      status: 'success',
      message: 'Cart retrieved successfully',
      cart,
    });
  } catch (error:any) {
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred while retrieving the cart',
    });
  }
};

export const addItemToCart = async (req: any, res: any) => {
  const addItemToCartDto = plainToClass(AddItemToCartDto, req.body); // Transform request body to DTO
  const errors = await validate(addItemToCartDto); // Validate the DTO

  if (errors.length > 0) {
    return res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors: errors.map(error => ({
        field: error.property,
        message: Object.values(error.constraints || {}).join(', '),
      })),
    });
  }

  const { productId, quantity } = addItemToCartDto; // Destructure valid data from DTO

  try {
    // Find the user's cart
    let cart = await Cart.findOne({ userId: req.user.id });

    // If no cart exists, create a new one
    if (!cart) {
      cart = new Cart({ userId: req.user.id, items: [] });
    }

    // Convert productId to ObjectId
    const productObjectId = new Types.ObjectId(productId); 

    // Check for existing item in the cart
    const existingItem = cart.items.find(item => item.productId.equals(productObjectId));

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      // Add new item to the cart
      cart.items.push({ productId: productObjectId, quantity });
    }

    // Save the cart
    await cart.save();

    // Standard success response
    return res.status(201).json({
      status: 'success',
      message: 'Item added to cart successfully',
      cart, // Return the updated cart
    });
  } catch (error:any) {
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred while adding the item to the cart',
    });
  }
};


// Remove item from cart
export const removeItemFromCart = async (req: any, res: any) => {
  const removeItemFromCartDto = plainToClass(RemoveItemFromCartDto, req.params);
  const errors = await validate(removeItemFromCartDto);

  if (errors.length > 0) {
    return res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors: errors.map(error => ({
        field: error.property,
        message: Object.values(error.constraints || {}).join(', '),
      })),
    });
  }

  const { productId } = removeItemFromCartDto; 

  try {
    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      return res.status(404).json({ status: 'error', message: 'Cart not found' });
    }

    cart.items = cart.items.filter(item => item.productId.toString() !== productId);
    
    await cart.save();

    return res.json({
      status: 'success',
      message: 'Item removed from cart successfully',
      cart,
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred while removing the item from the cart',
    });
  }
};;
