import { StatusCodes } from 'http-status-codes';
import { registerUser } from '../controllers/auth.js';

import { METHOD } from '../constants/common.js';

export function handleAuthRoutes(req, res) {
    if (req.method === METHOD.POST && req.url === '/auth/register') {
        registerUser(req, res);
    } else if (req.method === METHOD.POST && req.url === '/auth/login') {
        // loginUser(req, res);
    } else {
        res.writeHead(StatusCodes.NOT_FOUND, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Auth Route Not Found' }));
    }
}
