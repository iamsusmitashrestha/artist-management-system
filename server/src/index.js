import http from 'http';
import dotenv from 'dotenv';
import { StatusCodes, getReasonPhrase } from 'http-status-codes';

import  logger from './utils/logger.js';
import { handleRoutes } from './router.js';

dotenv.config(); 

const PORT = process.env.APP_PORT || 3000;
const HOST = process.env.APP_HOST || 'localhost';

// Create HTTP server
const server = http.createServer((req, res) => {
  try {
    handleRoutes(req, res);
} catch (err) {
    logger.error(' Internal Server Error:', err);
    res.writeHead(StatusCodes.INTERNAL_SERVER_ERROR, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Internal Server Error' }));
} 
});

// Handle server errors
server.on('error', (err) => {
  logger.error(' Server error:', err);
});

// Start the server
server.listen(PORT, HOST, () => {
  logger.info(`Server running at http://${HOST}:${PORT}/`);
});
