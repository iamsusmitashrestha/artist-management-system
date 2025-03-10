import Winster  from 'winster';
import { logLevel } from '../constants/logger.js';

const logger = new Winster({
    level: process.env.LOG_LEVEL || logLevel.INFO, 
});

export default logger;
