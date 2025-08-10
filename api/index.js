// This file serves as the entry point for both Vercel and development
// When run directly (npm run dev), it starts the full server
// When imported by Vercel, it just exports the Express app

// Check if this file is being run directly
if (require.main === module) {
  // Running directly - start the full server with Socket.IO, MongoDB, etc.
  require('../src/index.js');
} else {
  // Being imported (by Vercel) - just export the Express app
  module.exports = require('../src/app.js');
}	