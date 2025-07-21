const { connectDB, clearDatabase, closeDatabase } = require('./testHelper');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.MONGODB_URI = 'mongodb://127.0.0.1:27017/safetyapp_test';
process.env.JWT_SECRET = 'test-secret-key';
process.env.PORT = 5001; // Use a different port for tests

// Create a new Express app for tests
const createTestApp = () => {
  const app = express();
  
  // Middleware
  app.use(cors());
  app.use(express.json());
  
  // Import routes
  const authRouter = require('../routes/auth');
  const contactsRouter = require('../routes/contacts');
  const sosRouter = require('../routes/sos');
  const checkinRouter = require('../routes/checkin');
  const healthRouter = require('../routes/health');
  
  // Use routes
  app.use('/api/auth', authRouter);
  app.use('/api/contacts', contactsRouter);
  app.use('/api/sos', sosRouter);
  app.use('/api/checkin', checkinRouter);
  app.use('/api/health', healthRouter);
  
  // Simple health check
  app.get('/', (req, res) => {
    res.send('Test server is running');
  });
  
  return app;
};

// Global test hooks
beforeAll(async () => {
  try {
    await connectDB();
    console.log('Test setup: Database connected');
  } catch (error) {
    console.error('Test setup failed to connect to database:', error.message);
    throw error;
  }
}, 30000);

afterEach(async () => {
  try {
    await clearDatabase();
  } catch (error) {
    console.error('Error during test cleanup:', error.message);
  }
});

afterAll(async () => {
  try {
    await closeDatabase();
  } catch (error) {
    console.error('Error during test teardown:', error.message);
  }
});

// Global test timeout
jest.setTimeout(30000);

// Create and export the test app
const testApp = createTestApp();

module.exports = { 
  app: testApp,
  // Export test utilities for individual test files if needed
  testUtils: {
    clearDatabase,
    closeDatabase
  }
};
