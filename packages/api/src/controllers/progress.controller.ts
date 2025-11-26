import { Request, Response } from 'express';
import { markContentCompleted, getCompletedContents, unmarkContentCompleted } from '../services/progress.service';
import { AuthenticatedUser } from '../types/auth';

export async function markContentCompletedController(req: Request, res: Response): Promise<Response> {
    try {
        const authReq = req as Request & { user?: AuthenticatedUser };

        if (!authReq.user) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        const contentId = Number.parseInt(req.params.contentId, 10);

        if (Number.isNaN(contentId)) {
            return res.status(400).json({ error: 'contentId must be a number' });
        }

        const result = await markContentCompleted(contentId, authReq.user.userId);

        return res.status(200).json(result);
    } catch (error) {
        const message = (error as Error).message;

        if (message === 'CONTENT_NOT_FOUND') {
            return res.status(404).json({ error: 'Content not found' });
        }

        if (message === 'NOT_ENROLLED') {
            return res.status(403).json({ error: 'You are not enrolled in this course' });
        }

        return res.status(500).json({
            error: 'Unable to mark content as completed',
            details: message,
        });
    }
}

export async function unmarkContentCompletedController(req: Request, res: Response): Promise<Response> {
    try {
        const authReq = req as Request & { user?: AuthenticatedUser };

        if (!authReq.user) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        const contentId = Number.parseInt(req.params.contentId, 10);

        if (Number.isNaN(contentId)) {
            return res.status(400).json({ error: 'contentId must be a number' });
        }

        const result = await unmarkContentCompleted(contentId, authReq.user.userId);

        return res.status(200).json(result);
    } catch (error) {
        const message = (error as Error).message;

        if (message === 'CONTENT_NOT_FOUND') {
            return res.status(404).json({ error: 'Content not found' });
        }

        if (message === 'NOT_ENROLLED') {
            return res.status(403).json({ error: 'You are not enrolled in this course' });
        }

        return res.status(500).json({
            error: 'Unable to unmark content',
            details: message,
        });
    }
}

export async function getCompletedContentsController(req: Request, res: Response): Promise<Response> {
    try {
        const authReq = req as Request & { user?: AuthenticatedUser };

        if (!authReq.user) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        const courseId = Number.parseInt(req.params.courseId, 10);

        if (Number.isNaN(courseId)) {
            return res.status(400).json({ error: 'courseId must be a number' });
        }

        const completedContentIds = await getCompletedContents(courseId, authReq.user.userId);

        return res.status(200).json({ completedContentIds });
    } catch (error) {
        return res.status(500).json({
            error: 'Unable to get completed contents',
            details: (error as Error).message,
        });
    }
}

