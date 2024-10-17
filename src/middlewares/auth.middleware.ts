import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthenticatedRequest extends Request {
  user?: string | object;
}

export const authenticateJWT = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader.split(' ')[1]; 

  if (!token) {
    res.status(401).json({ error: 'No token provided. Authorization denied.' });
    return;  
  }

  try {
    const secret = process.env.JWT_SECRET??'';
    const decoded = jwt.verify(token, secret);  

    req.user = decoded;  

    next();  
  } catch (err) {
    res.status(403).json({ error: 'Token is not valid.' });
    return;  
  }
};
