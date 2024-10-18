import express from 'express';
import mongoose from 'mongoose';
import userRoutes from './routes/user.routes';
import productRoutes from './routes/product.routes';
import cartRoutes from './routes/cart.routes';
import errorMiddleware from './middlewares/error.middleware';
import dotenv from 'dotenv';
import cors from 'cors'

dotenv.config();





const app = express();
app.use(express.json());




// app.use(cors({
//     origin: 'http://localhost:3000', 
//     methods: ['GET', 'POST', 'PUT', 'DELETE'], 
//     credentials: true, 
// }));
app.use(cors());
mongoose.connect(process.env.MONGO_URI||'')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use('/api/v1/users', userRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/cart', cartRoutes);

app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
