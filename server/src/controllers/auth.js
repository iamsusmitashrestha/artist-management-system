import dotenv from 'dotenv';
import { StatusCodes } from 'http-status-codes';

import { createUser } from '../services/user.js';
import logger from '../utils/logger.js';
import { parseRequestBody } from '../utils/parse.js';



dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'jwt_secret';


// Create User
export async function registerUser(req, res) {
    try {
        const body = await parseRequestBody(req);

        await createUser(body);
        
        res.writeHead(StatusCodes.CREATED, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'User created successfully' }));
    } catch (error) {
        logger.error('Error:', error.message);
        res.writeHead(StatusCodes.BAD_REQUEST, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: error.message }));
    }
}

