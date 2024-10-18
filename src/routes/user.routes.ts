import express from 'express';
import { authenticateJWT } from '../middlewares/auth.middleware';
import { 
  registerUser, 
  loginUser, 
  getUserProfile, 
  updateUserProfile, 
  deleteUserProfile 
} from '../controllers/user.controller'; // Import all controller functions

const router = express.Router();

// Register User
router.post('/register', registerUser);

// Login User
router.post('/login', loginUser);

// Get User Profile (Protected Route)
router.get('/profile', authenticateJWT, getUserProfile);

// Update User Profile (Protected Route)
router.put('/profile', authenticateJWT, updateUserProfile);

// Delete User Profile (Protected Route)
router.delete('/profile', authenticateJWT, deleteUserProfile);

export default router;
