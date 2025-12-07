import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables FIRST, before importing routes
dotenv.config();

import authRoutes, { verifyEmailConfig } from './backend/routes/auth.js';
import userRoutes from './backend/routes/users.js';
import whatsappRoutes from './backend/routes/whatsapp.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'SNACK BOX API is running',
    emailConfigured: !!process.env.EMAIL_PASSWORD,
    emailUser: process.env.EMAIL_USER || 'snackbox2121@gmail.com'
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', userRoutes);
app.use('/api/whatsapp', whatsappRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  console.error('Error stack:', err.stack);
  
  // Ensure we always send a response
  if (!res.headersSent) {
    res.status(err.status || 500).json({
      success: false,
      message: err.message || 'Internal server error'
    });
  }
});

// Handle unhandled promise rejections in routes
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 SNACK BOX API server running on port ${PORT}`);
  console.log(`📧 Email service configured: ${process.env.EMAIL_USER || 'snackbox2121@gmail.com'}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  
  // Verify email configuration after server starts (env vars are loaded)
  verifyEmailConfig();
});

