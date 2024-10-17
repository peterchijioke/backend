import { Request, Response } from 'express';
import { User } from '../models/user.model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { RegisterUserDto, UpdateUserDto } from '../dtos/user.dto';

// Register User
export const registerUser = async (req: any, res: any) => {
  const registerUserDto = plainToClass(RegisterUserDto, req.body);

  const errors = await validate(registerUserDto);
  if (errors.length > 0) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: errors.map(error => ({
        field: error.property,
        message: Object.values(error.constraints || {}).join(', ')
      })),
    });
  }

  const { username, password } = req.body;

  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res.status(400).json({ message: 'Username already taken' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ username, password: hashedPassword });

  await user.save();
  res.status(201).json({ message: 'User registered successfully', userId: user._id });
};

// Login User
export const loginUser = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (user && await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || '', { expiresIn: '1h' });
    res.json({ token });
  } else {
    res.sendStatus(401); // Unauthorized
  }
};

// Get User Profile
export const getUserProfile = async (req: any, res: any) => {
  const userId = req.user.id;
  const user = await User.findById(userId).select('-password');

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.json(user);
};

// Update User Profile
export const updateUserProfile = async (req: any, res: any) => {
  const userId = req.user.id;
  const updateUserDto = plainToClass(UpdateUserDto, req.body);

  const errors = await validate(updateUserDto);
  if (errors.length > 0) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: errors.map(error => ({
        field: error.property,
        message: Object.values(error.constraints || {}).join(', ')
      })),
    });
  }

  const { username, password } = req.body;
  const updates: any = {};
  if (username) updates.username = username;
  if (password) updates.password = await bcrypt.hash(password, 10);

  const updatedUser = await User.findByIdAndUpdate(userId, updates, { new: true }).select('-password');

  if (!updatedUser) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.json(updatedUser);
};

// Delete User Profile
export const deleteUserProfile = async (req: any, res: Response) => {
  const userId = req.user.id;
  await User.findByIdAndDelete(userId);
  res.json({ message: 'User deleted successfully' });
};
