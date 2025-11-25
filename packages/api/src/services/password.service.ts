import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { sendPasswordResetEmail } from './email.service';

const prisma = new PrismaClient();

const SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS ?? 10);

// Generate reset token
function generateResetToken(): string {
    return crypto.randomBytes(32).toString('hex');
}

// Token expiry (1 hour)
function getResetTokenExpiry(): Date {
    const expiry = new Date();
    expiry.setHours(expiry.getHours() + 1);
    return expiry;
}

// Request password reset
export async function requestPasswordReset(email: string): Promise<boolean> {
    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        // Don't reveal if user exists or not (security best practice)
        // Just return true silently
        return true;
    }

    const resetToken = generateResetToken();
    const resetTokenExpiry = getResetTokenExpiry();

    await prisma.user.update({
        where: { id: user.id },
        data: {
            resetToken,
            resetTokenExpiry,
        },
    });

    // Send reset email
    return await sendPasswordResetEmail(user.email, user.username, resetToken);
}

// Reset password with token
export async function resetPasswordWithToken(token: string, newPassword: string): Promise<void> {
    if (newPassword.length < 6) {
        throw new Error('Password must be at least 6 characters');
    }

    const user = await prisma.user.findUnique({
        where: { resetToken: token },
    });

    if (!user) {
        throw new Error('INVALID_TOKEN');
    }

    if (!user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
        throw new Error('TOKEN_EXPIRED');
    }

    const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);

    await prisma.user.update({
        where: { id: user.id },
        data: {
            hashedPassword,
            resetToken: null,
            resetTokenExpiry: null,
        },
    });
}

