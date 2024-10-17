import express, { Request, Response } from 'express';
import { User } from '../models/user.model';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'

const router = express.Router();

// Register User
router.post('/register', async (req: any, res: any) => {
  const { username, password } = req.body;
  
  // Check if user already exists
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res.status(400).json({ message: 'Username already taken' });
  }
  
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ username, password: hashedPassword });
  
  await user.save();
  res.status(201).json({ message: 'User registered successfully', userId: user._id });
});

// Login User
router.post('/login', async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (user && await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: '1h' });
    res.json({ token });
  } else {
    res.sendStatus(401); // Unauthorized
  }
});

// Get User Profile
router.get('/profile', async (req: any, res: any) => {
  const userId = req.user.id; // Assuming req.user is set by authenticateJWT middleware
  const user = await User.findById(userId).select('-password'); // Exclude password from the response

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.json(user);
});

// Update User Profile
router.put('/profile', async (req: any, res: any) => {
  const userId = req.user.id; // Assuming req.user is set by authenticateJWT middleware
  const { username, password } = req.body;

  const updates: any = {};
  if (username) updates.username = username;
  if (password) updates.password = await bcrypt.hash(password, 10);

  const updatedUser = await User.findByIdAndUpdate(userId, updates, { new: true }).select('-password');
  
  if (!updatedUser) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.json(updatedUser);
});

// Delete User
router.delete('/profile', async (req: any, res: Response) => {
  const userId = req.user.id; // Assuming req.user is set by authenticateJWT middleware
  await User.findByIdAndDelete(userId);
  res.json({ message: 'User deleted successfully' });
});

export default router;
