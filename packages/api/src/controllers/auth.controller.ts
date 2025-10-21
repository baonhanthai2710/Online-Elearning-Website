import { Request, Response } from 'express';
import { login, register, RegisterInput } from '../services/auth.service';

const COOKIE_NAME = process.env.AUTH_COOKIE_NAME ?? 'token';
const SEVEN_DAYS_IN_MS = 7 * 24 * 60 * 60 * 1000;

export async function registerController(req: Request, res: Response): Promise<Response> {
    try {
        const { email, username, password, firstName, lastName, role } = req.body ?? {};

        if (!email || !username || !password) {
            return res.status(400).json({
                error: 'Email, username, and password are required',
            });
        }

        const payload: RegisterInput = {
            email,
            username,
            password,
            firstName,
            lastName,
            role,
        };

        const user = await register(payload);

        return res.status(201).json({
            message: 'Registration successful',
            user,
        });
    } catch (error) {
        const message = (error as Error).message;

        if (message === 'Email or username already in use') {
            return res.status(409).json({ error: message });
        }

        return res.status(500).json({ error: 'Unable to register user', details: message });
    }
}

export async function loginController(req: Request, res: Response): Promise<Response> {
    try {
        const { email, password } = (req.body ?? {}) as { email?: string; password?: string };

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const { token, user } = await login(email, password);

        res.cookie(COOKIE_NAME, token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: SEVEN_DAYS_IN_MS,
        });

        return res.status(200).json({
            message: 'Login successful',
            user,
        });
    } catch (error) {
        const message = (error as Error).message;

        if (message === 'Invalid email or password') {
            return res.status(401).json({ error: message });
        }

        return res.status(500).json({ error: 'Unable to login user', details: message });
    }
}
