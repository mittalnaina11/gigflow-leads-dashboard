import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import connectDB from './config/database';
import authRoutes from './routes/auth';
import leadsRoutes from './routes/leads';
import { errorHandler, notFound } from './middleware/errorHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { success: false, message: 'Too many requests, please try again later.' },
});

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'combined'));
app.use('/api', limiter);

// Health check
app.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'GigFlow API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadsRoutes);

// 404 handler
app.use(notFound);

// Global error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 GigFlow API running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV}`);
  console.log(`🌐 CORS: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
});

export default app;
