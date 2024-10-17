import { Request, Response } from 'express';
import { User } from '../models/user.model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { LoginUserDto, RegisterUserDto, UpdateUserDto } from '../dtos/user.dto';

export const registerUser = async (req: any, res: any) => {
  const registerUserDto = plainToClass(RegisterUserDto, req.body);
  const errors = await validate(registerUserDto);

  if (errors.length > 0) {
    return res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors: errors.map(error => ({
        field: error.property,
        message: Object.values(error.constraints || {}).join(', ')
      })),
    });
  }

  const { email, password, username } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({
      status: 'error',
      message: 'Email already taken',
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ email, password: hashedPassword, username });

  await user.save();

  return res.status(201).json({
    status: 'success',
    message: 'User registered successfully',
    user: {
      id: user._id,
      email: user.email,
      username: user.username,
    },
  });
};

export const loginUser = async (req: any, res: any) => {
  const loginUserDto = plainToClass(LoginUserDto, req.body);
  const errors = await validate(loginUserDto);

  if (errors.length > 0) {
    return res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors: errors.map(error => ({
        field: error.property,
        message: Object.values(error.constraints || {}).join(', ')
      })),
    });
  }

  const { email, password } = loginUserDto;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({
      status: 'error',
      message: 'Invalid credentials',
    });
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return res.status(401).json({
      status: 'error',
      message: 'Invalid credentials',
    });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: '1h' });

  return res.status(200).json({
    status: 'success',
    message: 'Login successful',
    token: token,
    user: {
      id: user._id,
      email: user.email,
      username: user.username,
    },
  });
};

export const getUserProfile = async (req: any, res: any) => {
  const userId = req.user.id; 

  const user = await User.findById(userId).select('-password'); 

  if (!user) {
    return res.status(404).json({
      status: 'error',
      message: 'User not found',
    });
  }

  return res.status(200).json({
    status: 'success',
    message: 'User profile retrieved successfully',
    user: {
      id: user._id,
      email: user.email,
      username: user.username,
    },
  });
};



export const updateUserProfile = async (req: any, res: any) => {
  const userId = req.user.id; 
  const updateUserDto = plainToClass(UpdateUserDto, req.body); 

  // Validate the incoming data
  const errors = await validate(updateUserDto);
  if (errors.length > 0) {
    return res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors: errors.map(error => ({
        field: error.property,
        message: Object.values(error.constraints || {}).join(', ')
      })),
    });
  }

  const { username, password } = req.body; 
  const updates: any = {}; 

  // Add updates to the object if they exist
  if (username) updates.username = username;
  if (password) updates.password = await bcrypt.hash(password, 10); 

  const updatedUser = await User.findByIdAndUpdate(userId, updates, { new: true }).select('-password'); 

  if (!updatedUser) {
    return res.status(404).json({
      status: 'error',
      message: 'User not found',
    });
  }

  return res.status(200).json({
    status: 'success',
    message: 'User profile updated successfully',
    user: {
      id: updatedUser._id,
      email: updatedUser.email,
      username: updatedUser.username,
    },
  });
};

export const deleteUserProfile = async (req: any, res: any) => {
  const userId = req.user.id; 

  const deletedUser = await User.findByIdAndDelete(userId);

  if (!deletedUser) {
    return res.status(404).json({
      status: 'error',
      message: 'User not found',
    });
  }

  return res.status(200).json({
    status: 'success',
    message: 'User deleted successfully',
  });
};