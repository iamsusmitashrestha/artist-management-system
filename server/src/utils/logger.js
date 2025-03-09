import Winster  from 'winster';

const logger = new Winster({
    level: process.env.LOG_LEVEL || "info", 
});

export default logger;
