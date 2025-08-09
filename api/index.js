const mongoose = require('mongoose');
const app = require('../src/app');
const config = require('../src/config/config');
const logger = require('../src/config/logger');

let isConnected = false;

const connectToDatabase = async () => {
  if (isConnected) {
    return;
  }

  try {
    // For serverless, we don't want to use deprecated options
    const mongooseOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };
    
    await mongoose.connect(config.mongoose.url, mongooseOptions);
    isConnected = true;
    logger.info('Connected to MongoDB for serverless function');
  } catch (error) {
    logger.error('Error connecting to MongoDB:', error);
    throw error;
  }
};

// Graceful shutdown for serverless
process.on('SIGTERM', async () => {
  if (isConnected) {
    await mongoose.connection.close();
    isConnected = false;
    logger.info('MongoDB connection closed due to SIGTERM');
  }
});

// Vercel serverless function handler
module.exports = async (req, res) => {
  try {
    // Connect to database if not already connected
    await connectToDatabase();
    
    // Handle the request using Express app
    return app(req, res);
  } catch (error) {
    logger.error('Serverless function error:', error);
    return res.status(500).json({ 
      error: 'Internal Server Error',
      message: error.message 
    });
  }
};

// For local development, export the Express app
module.exports.app = app;
