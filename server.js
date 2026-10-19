const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

const connectDB = require('./config/db');
const restaurantRoutes = require('./routes/restaurants');
const invitationRoutes = require('./routes/invitations');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Security Middlewares
app.use(
  helmet({
    contentSecurityPolicy: false, // Allows Google Fonts, SVG icons and inline effects smoothly
    crossOriginEmbedderPolicy: false
  })
);

// CORS setup
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
  })
);

// Body parser with size limits
app.use(express.json({ limit: '50kb' }));
app.use(express.urlencoded({ extended: true, limit: '50kb' }));

// Rate Limiters
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 120, // 120 requests per IP per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests. Please slow down, love! 🌸'
  }
});

const invitationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20, // Limit date bookings per 15 minutes to prevent spam
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'You have submitted several date invitations recently. Please wait a moment! 💖'
  }
});

app.use('/api', apiLimiter);
app.use('/api/invitations', invitationLimiter);

// Serve Frontend Static Files (if available locally)
const fs = require('fs');
const frontendPath = path.join(__dirname, '..', 'frontend');
const hasFrontend = fs.existsSync(frontendPath);

if (hasFrontend) {
  app.use(express.static(frontendPath));
}

// API Routes
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/invitations', invitationRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    app: 'Dating ❤️ Backend API',
    timestamp: new Date().toISOString()
  });
});

// Root endpoint for standalone deployment
app.get('/', (req, res, next) => {
  if (hasFrontend) {
    return res.sendFile(path.join(frontendPath, 'index.html'));
  }
  return res.json({
    name: 'Dating ❤️ Backend API',
    status: 'online',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      restaurants: '/api/restaurants',
      invitations: '/api/invitations'
    }
  });
});

// Fallback for SPA/direct navigation
if (hasFrontend) {
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(frontendPath, 'index.html'));
  });
}

// Centralized error handling
app.use(errorHandler);

// Start server (when running standalone/local)
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`\n==================================================`);
    console.log(`🌹 Dating ❤️ Website Backend is Running!`);
    console.log(`📍 Local URL: http://localhost:${PORT}`);
    console.log(`📁 Frontend: ${hasFrontend ? frontendPath : 'Standalone API Mode'}`);
    console.log(`==================================================\n`);
  });
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('⚠️ Unhandled Promise Rejection:', err.message);
});

module.exports = app;
