import { Request, Response, NextFunction } from 'express';

// Custom error handler middleware
const errorMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack); // Log the error stack for debugging

  const status = err.status || 500; // Use status from error or default to 500 (Internal Server Error)
  const message = err.message || 'Something went wrong'; // Use the error message or a generic one

  res.status(status).json({
    status,
    message,
  });
};

export default errorMiddleware;
