import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extend the Request interface to include a 'user' property
interface AuthenticatedRequest extends Request {
  user?: string | object;
}

export const authenticateJWT = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader.split(' ')[1]; // Extract the token from the Bearer <token>

  if (!token) {
    res.status(401).json({ error: 'No token provided. Authorization denied.' });
    return;  // Ensure we don't return a Response object and stop execution
  }

  try {
    const secret = process.env.JWT_SECRET || 'your_jwt_secret';
    const decoded = jwt.verify(token, secret);  // Verify the token

    req.user = decoded;  // Attach the decoded token (user data) to the request object

    next();  // Proceed to the next middleware or route handler
  } catch (err) {
    res.status(403).json({ error: 'Token is not valid.' });
    return;  // Stop execution after sending the response
  }
};
