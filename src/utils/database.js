const mongoose = require('mongoose');
const config = require('../config/config');
const logger = require('../config/logger');

let isConnected = false;

const connectToDatabase = async () => {
  if (isConnected) {
    return mongoose.connection;
  }

  try {
    const mongooseOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    };
    
    await mongoose.connect(config.mongoose.url, mongooseOptions);
    isConnected = true;
    logger.info('Connected to MongoDB');
    return mongoose.connection;
  } catch (error) {
    logger.error('Error connecting to MongoDB:', error);
    throw error;
  }
};

// Ensure database connection before processing requests
const ensureDbConnection = async (req, res, next) => {
  try {
    await connectToDatabase();
    next();
  } catch (error) {
    logger.error('Database connection failed:', error);
    res.status(500).json({ error: 'Database connection failed' });
  }
};

module.exports = {
  connectToDatabase,
  ensureDbConnection
};
