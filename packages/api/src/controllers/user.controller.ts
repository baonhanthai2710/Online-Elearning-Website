import { Request, Response } from 'express';
import { AuthenticatedUser } from '../types/auth';
import { getUserProfile, updateUserProfile, UpdateProfileInput } from '../services/user.service';

export async function getUserProfileController(req: Request, res: Response): Promise<Response> {
    try {
        const authReq = req as Request & { user?: AuthenticatedUser };
        if (!authReq.user) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        const profile = await getUserProfile(authReq.user.userId);

        if (!profile) {
            return res.status(404).json({ error: 'User not found' });
        }

        return res.status(200).json(profile);
    } catch (error) {
        return res.status(500).json({
            error: 'Unable to fetch user profile',
            details: (error as Error).message,
        });
    }
}

export async function updateUserProfileController(req: Request, res: Response): Promise<Response> {
    try {
        const authReq = req as Request & { user?: AuthenticatedUser };
        if (!authReq.user) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        const { firstName, lastName, email, username, currentPassword, newPassword } = req.body as UpdateProfileInput;

        const updateData: UpdateProfileInput = {};

        if (firstName !== undefined) updateData.firstName = firstName;
        if (lastName !== undefined) updateData.lastName = lastName;
        if (email !== undefined) updateData.email = email;
        if (username !== undefined) updateData.username = username;
        if (currentPassword !== undefined) updateData.currentPassword = currentPassword;
        if (newPassword !== undefined) updateData.newPassword = newPassword;

        const updatedProfile = await updateUserProfile(authReq.user.userId, updateData);

        return res.status(200).json({
            message: 'Profile updated successfully',
            user: updatedProfile,
        });
    } catch (error) {
        const message = (error as Error).message;

        if (message.includes('already in use')) {
            return res.status(409).json({ error: message });
        }

        if (message.includes('password')) {
            return res.status(400).json({ error: message });
        }

        return res.status(500).json({
            error: 'Unable to update profile',
            details: message,
        });
    }
}

