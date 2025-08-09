const app = require('../src/app');

// For Vercel serverless functions, we don't need database connection here
// The connection will be handled in individual routes/services as needed

// Export the Express app as a Vercel serverless function
module.exports = app;
