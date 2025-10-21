import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { Role } from '@prisma/client';
import { AuthenticatedUser } from '../types/auth';

const JWT_SECRET = (() => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT_SECRET environment variable is not defined');
    }
    return secret;
})();

const COOKIE_NAME = process.env.AUTH_COOKIE_NAME ?? 'token';

type AuthenticatedRequest = Request & { user?: AuthenticatedUser };

function isAuthenticatedUser(payload: unknown): payload is AuthenticatedUser {
    if (!payload || typeof payload !== 'object') {
        return false;
    }

    const candidate = payload as Partial<AuthenticatedUser>;
    return typeof candidate.userId === 'number' && typeof candidate.role === 'string';
}

export function isAuthenticated(req: Request, res: Response, next: NextFunction): void {
    try {
        const token = req.cookies?.[COOKIE_NAME];

        if (!token) {
            res.status(401).json({ error: 'Authentication token is missing' });
            return;
        }

        const decoded = jwt.verify(token, JWT_SECRET);

        if (!isAuthenticatedUser(decoded)) {
            res.status(401).json({ error: 'Invalid authentication token payload' });
            return;
        }

        const authReq = req as AuthenticatedRequest;
        authReq.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid or expired authentication token' });
    }
}

export function isAuthorized(roles: Role[]) {
    return (req: Request, res: Response, next: NextFunction): void => {
        const authReq = req as AuthenticatedRequest;

        if (!authReq.user) {
            res.status(401).json({ error: 'User not authenticated' });
            return;
        }

        if (!roles.includes(authReq.user.role)) {
            res.status(403).json({ error: 'Forbidden' });
            return;
        }

        next();
    };
}
