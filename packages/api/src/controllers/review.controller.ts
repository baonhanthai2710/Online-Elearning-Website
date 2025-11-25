import { Request, Response } from 'express';
import { AuthenticatedUser } from '../types/auth';
import {
    getCourseReviews,
    getUserReview,
    createOrUpdateReview,
    deleteReview,
} from '../services/review.service';

export async function getCourseReviewsController(req: Request, res: Response): Promise<Response> {
    try {
        const courseId = Number.parseInt(req.params.courseId, 10);

        if (Number.isNaN(courseId)) {
            return res.status(400).json({ error: 'Course ID must be a number' });
        }

        const reviews = await getCourseReviews(courseId);
        return res.status(200).json(reviews);
    } catch (error) {
        return res.status(500).json({
            error: 'Unable to fetch reviews',
            details: (error as Error).message,
        });
    }
}

export async function getUserReviewController(req: Request, res: Response): Promise<Response> {
    try {
        const authReq = req as Request & { user?: AuthenticatedUser };
        if (!authReq.user) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        const courseId = Number.parseInt(req.params.courseId, 10);

        if (Number.isNaN(courseId)) {
            return res.status(400).json({ error: 'Course ID must be a number' });
        }

        const review = await getUserReview(courseId, authReq.user.userId);

        if (!review) {
            return res.status(404).json({ error: 'Review not found' });
        }

        return res.status(200).json(review);
    } catch (error) {
        return res.status(500).json({
            error: 'Unable to fetch user review',
            details: (error as Error).message,
        });
    }
}

export async function createOrUpdateReviewController(req: Request, res: Response): Promise<Response> {
    try {
        const authReq = req as Request & { user?: AuthenticatedUser };
        if (!authReq.user) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        const courseId = Number.parseInt(req.params.courseId, 10);

        if (Number.isNaN(courseId)) {
            return res.status(400).json({ error: 'Course ID must be a number' });
        }

        const { rating, comment } = req.body as { rating?: number; comment?: string };

        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ error: 'Rating must be between 1 and 5' });
        }

        const review = await createOrUpdateReview({
            courseId,
            studentId: authReq.user.userId,
            rating,
            comment,
        });

        return res.status(201).json({
            message: 'Review submitted successfully',
            review: {
                id: review.id,
                rating: review.rating,
                comment: review.comment,
                datePosted: review.datePosted,
                student: {
                    id: review.student.id,
                    username: review.student.username,
                    fullName: [review.student.firstName, review.student.lastName]
                        .filter(Boolean)
                        .join(' ') || review.student.username,
                },
            },
        });
    } catch (error) {
        const message = (error as Error).message;

        if (message.includes('enrolled')) {
            return res.status(403).json({ error: message });
        }

        return res.status(500).json({
            error: 'Unable to create/update review',
            details: message,
        });
    }
}

export async function deleteReviewController(req: Request, res: Response): Promise<Response> {
    try {
        const authReq = req as Request & { user?: AuthenticatedUser };
        if (!authReq.user) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        const reviewId = Number.parseInt(req.params.id, 10);

        if (Number.isNaN(reviewId)) {
            return res.status(400).json({ error: 'Review ID must be a number' });
        }

        await deleteReview(reviewId, authReq.user.userId);

        return res.status(200).json({ message: 'Review deleted successfully' });
    } catch (error) {
        const message = (error as Error).message;

        if (message.includes('not found')) {
            return res.status(404).json({ error: message });
        }

        if (message.includes('only delete')) {
            return res.status(403).json({ error: message });
        }

        return res.status(500).json({
            error: 'Unable to delete review',
            details: message,
        });
    }
}

