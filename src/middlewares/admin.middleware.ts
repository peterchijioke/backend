import { NextFunction } from 'express';
import { User } from '../models/user.model';

export const authenticateAdmin = async (req: any, res: any, next: NextFunction) => {
  const userId = req.user.id; 
  const user = await User.findById(userId);

  if (!user || !user.isAdmin) {
    return res.status(403).json({
      status: 'error',
      message: 'Access denied. Admins only.',
    });
  }

  next(); 
};
