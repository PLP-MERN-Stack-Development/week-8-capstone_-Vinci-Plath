require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
// Temporarily disabled for Swagger testing
// const errorTracking = require('./middleware/errorTracking');
// const performanceMonitoring = require('./middleware/performanceMonitoring');
const healthRouter = require('./routes/health');
const authRouter = require('./routes/auth');
const sosRouter = require('./routes/sos');

const app = express();

// Middleware
// Temporarily disabled for Swagger testing
// app.use(errorTracking);
// app.use(performanceMonitoring);
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Check if the origin is in the allowed list
    if (allowedOrigins.includes(origin) || 
        process.env.NODE_ENV === 'development') {
      return callback(null, true);
    }
    
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Range', 'X-Content-Range']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// API Documentation
if (process.env.NODE_ENV !== 'production') {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Safety App API Docs'
  }));
}

// API Routes
app.use('/api/health', healthRouter);
app.use('/api/auth', authRouter);
app.use('/api/sos', sosRouter);

// Database connection
const connectDB = async () => {
  if (process.env.NODE_ENV !== 'test') {
    try {
      if (!process.env.MONGODB_URI) {
        throw new Error('MONGODB_URI is not defined in environment variables');
      }
      
      console.log('Connecting to MongoDB...');
      await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000,
      });
      
      console.log('✅ Connected to MongoDB');
      console.log(`   - Host: ${mongoose.connection.host}`);
      console.log(`   - Database: ${mongoose.connection.name}`);
      
      // Log any database errors after initial connection
      mongoose.connection.on('error', err => {
        console.error('MongoDB connection error after initial connection:', err);
      });
      
    } catch (err) {
      console.error('❌ MongoDB connection error:', {
        message: err.message,
        code: err.code,
        codeName: err.codeName,
        name: err.name,
        stack: err.stack
      });
      // Exit process with failure
      process.exit(1);
    }
  }
};

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// Only start the server if this file is run directly (not required for tests)
if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 5000;
  const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
  
  // Handle unhandled promise rejections
  process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err);
    server.close(() => process.exit(1));
  });
}

module.exports = { app, connectDB };
