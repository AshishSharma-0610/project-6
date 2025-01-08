import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { errorHandler } from './middleware/errorHandler.js';

// Routes imports
import authRoutes from './routes/auth.js';
import patientRoutes from './routes/patients.js';
import mealRoutes from './routes/meals.js';
import pantryRoutes from './routes/pantry.js';
import deliveryRoutes from './routes/deliveries.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/meals', mealRoutes);
app.use('/api/pantry', pantryRoutes);
app.use('/api/deliveries', deliveryRoutes);

// Error handling middleware
app.use(errorHandler);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);

});