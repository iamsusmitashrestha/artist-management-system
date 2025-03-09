import http from 'http';
import dotenv from 'dotenv';
import { StatusCodes, getReasonPhrase } from 'http-status-codes';

import  logger from './utils/logger.js';

dotenv.config(); 

const PORT = process.env.APP_PORT || 3000;
const HOST = process.env.APP_HOST || 'localhost';

// Create HTTP server
const server = http.createServer((req, res) => {
  res.statusCode = StatusCodes.OK; 
  res.setHeader('Content-Type', 'text/plain');
  res.end(`${getReasonPhrase(StatusCodes.OK)}\n`); 
});

// Handle server errors
server.on('error', (err) => {
  logger.error('❌ Server error:', err);
});

// Start the server
server.listen(PORT, HOST, () => {
  logger.info(`🚀 Server running at http://${HOST}:${PORT}/`);
});
