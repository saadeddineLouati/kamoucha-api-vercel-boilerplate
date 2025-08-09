#!/usr/bin/env node

/**
 * Local development server for testing Vercel deployment
 * This simulates the Vercel serverless environment locally
 */

const { createServer } = require('http');
const handler = require('./api/index.js');

const port = process.env.PORT || 3000;

const server = createServer(async (req, res) => {
  try {
    await handler(req, res);
  } catch (error) {
    console.error('Server error:', error);
    res.statusCode = 500;
    res.end('Internal Server Error');
  }
});

server.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
  console.log(`📱 Health check: http://localhost:${port}/api/v1/health`);
  console.log(`📖 API docs: http://localhost:${port}/api/v1/docs`);
  console.log('💡 This simulates Vercel serverless environment');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('👋 Shutting down server...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('👋 Shutting down server...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});
