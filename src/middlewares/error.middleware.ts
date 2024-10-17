import { Request, Response, NextFunction } from 'express';

const errorMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);

  const status = err.status || 500;
  const message = err.message || 'Something went wrong';

  res.status(status).json({
    status,
    message,
  });
};

export default errorMiddleware;
