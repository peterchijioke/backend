import mongoose from 'mongoose';
import app from './app'; 

const dbURI = process.env.MONGODB_URI??""

mongoose.connect(dbURI)
  .then(() => {
    console.log('Database connected');
    const PORT = process.env.PORT || 5000; 
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Database connection error:', err);
  });
