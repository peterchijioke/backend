import express from 'express';
import errorMiddleware from './middlewares/error.middleware';
import productRoutes from './routes/product'; // Adjust the path as necessary
import userRoutes from './routes/user'; // Adjust the path as necessary

const app = express();

app.use(express.json());

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);

app.use(errorMiddleware);

export default app;
