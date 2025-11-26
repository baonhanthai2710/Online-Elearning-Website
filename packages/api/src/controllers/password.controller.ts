import { Request, Response } from 'express';
import { requestPasswordReset, resetPasswordWithToken } from '../services/password.service';

export async function requestPasswordResetController(req: Request, res: Response): Promise<Response> {
    try {
        const { email } = req.body as { email?: string };

        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        const sent = await requestPasswordReset(email);

        // Always return success (security: don't reveal if email exists)
        return res.status(200).json({
            message: 'If an account with that email exists, a password reset link has been sent.',
        });
    } catch (error) {
        return res.status(500).json({
            error: 'Unable to process password reset request',
            details: (error as Error).message,
        });
    }
}

export async function resetPasswordController(req: Request, res: Response): Promise<Response> {
    try {
        const { token, password } = req.body as { token?: string; password?: string };

        if (!token || !password) {
            return res.status(400).json({ error: 'Token and password are required' });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters' });
        }

        await resetPasswordWithToken(token, password);

        return res.status(200).json({
            message: 'Password has been reset successfully. You can now log in with your new password.',
        });
    } catch (error) {
        const message = (error as Error).message;

        if (message === 'INVALID_TOKEN') {
            return res.status(400).json({
                error: 'Invalid or expired reset token',
                code: 'INVALID_TOKEN',
            });
        }

        if (message === 'TOKEN_EXPIRED') {
            return res.status(400).json({
                error: 'This reset link has expired. Please request a new one.',
                code: 'TOKEN_EXPIRED',
            });
        }

        return res.status(500).json({
            error: 'Unable to reset password',
            details: message,
        });
    }
}

