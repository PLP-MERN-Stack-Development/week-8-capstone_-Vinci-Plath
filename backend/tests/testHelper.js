const mongoose = require('mongoose');

// Use test database from environment variable or default
const TEST_MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/safetyapp_test';

// Connect to the test database
const connectDB = async () => {
  try {
    // Close any existing connections first
    if (mongoose.connection.readyState !== 0) { // 0 = disconnected
      await mongoose.disconnect();
    }

    await mongoose.connect(TEST_MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // 5 seconds timeout
    });
    
    console.log('Test database connected successfully');
    return mongoose.connection;
  } catch (error) {
    console.error('Test database connection failed. Please ensure MongoDB is running.');
    console.error('Error details:', error.message);
    throw error; // Don't exit, let the test framework handle the error
  }
};

// Clear all test data
const clearDatabase = async () => {
  if (mongoose.connection.readyState === 1) { // 1 = connected
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      try {
        await collections[key].deleteMany({});
      } catch (error) {
        console.error(`Error clearing collection ${key}:`, error.message);
      }
    }
  }
};

// Close the database connection
const closeDatabase = async () => {
  if (mongoose.connection.readyState === 1) { // 1 = connected
    try {
      await mongoose.connection.dropDatabase();
      await mongoose.connection.close();
      console.log('Test database connection closed');
    } catch (error) {
      console.error('Error closing test database:', error.message);
      throw error;
    }
  }
};

module.exports = {
  connectDB,
  clearDatabase,
  closeDatabase,
};
