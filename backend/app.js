require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const errorTracking = require('./middleware/errorTracking');
const performanceMonitoring = require('./middleware/performanceMonitoring');
const healthRouter = require('./routes/health');

const app = express();

// Middleware
app.use(errorTracking);
app.use(performanceMonitoring);
app.use(cors());
app.use(express.json());

// Routes
app.use('/health', healthRouter);

// Database connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
