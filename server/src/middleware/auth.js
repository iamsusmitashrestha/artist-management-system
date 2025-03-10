import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { StatusCodes } from 'http-status-codes';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

// Verify JWT and extract user info
export function verifyToken(req, res, next) {
    // Get token from headers
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.writeHead(StatusCodes.UNAUTHORIZED, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Access denied. No token provided.' }));
        return;
    }

    const token = authHeader.split(' ')[1];

    // Verify token
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            res.writeHead(StatusCodes.UNAUTHORIZED, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Invalid token.' }));
            return;
        }

        req.user = user; // Attach user info to the request object
        next();
    });
}

/**
 * Middleware to restrict access based on user roles.
 * 
 * @param {Array<string>} allowedRoles - An array of roles that are allowed to access the route.
 * @returns {Function} Middleware function to enforce role-based access control.
 */

export function requireRole(allowedRoles) {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            res.writeHead(StatusCodes.FORBIDDEN, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Access denied. Insufficient permissions.' }));
            return;
        }
        next();
    };
}