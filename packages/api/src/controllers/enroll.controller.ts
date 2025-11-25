import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { checkoutCourse, handleStripeWebhook, getCourseForEnrolledStudent } from '../services/enroll.service';
import { AuthenticatedUser } from '../types/auth';

const prisma = new PrismaClient();

// Force use correct URLs (ignore .env for now)
const STUDENT_SUCCESS_URL = 'http://localhost:5173/payment-success';
const STUDENT_CANCEL_URL = 'http://localhost:5173/payment-cancel';

export async function checkoutCourseController(req: Request, res: Response): Promise<Response> {
    try {
        const authReq = req as Request & { user?: AuthenticatedUser };

        if (!authReq.user) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        const courseId = Number.parseInt(req.params.courseId, 10);

        if (Number.isNaN(courseId)) {
            return res.status(400).json({ error: 'courseId must be a number' });
        }

        const promotionCode = req.body?.promotionCode as string | undefined;

        try {
            const url = await checkoutCourse({
                courseId,
                studentId: authReq.user.userId,
                successUrl: STUDENT_SUCCESS_URL,
                cancelUrl: STUDENT_CANCEL_URL,
                promotionCode,
            });

            if (!url) {
                return res.status(500).json({ error: 'Unable to create checkout session' });
            }

            return res.status(200).json({ url });
        } catch (error) {
            const message = (error as Error).message;

            if (message === 'COURSE_NOT_FOUND') {
                return res.status(404).json({ error: 'Course not found' });
            }

            if (message === 'ALREADY_ENROLLED') {
                return res.status(409).json({ error: 'You are already enrolled in this course' });
            }

            throw error;
        }
    } catch (error) {
        return res.status(500).json({
            error: 'Unable to initiate checkout',
            details: (error as Error).message,
        });
    }
}

type RawBodyRequest = Request & { rawBody?: Buffer };

export async function stripeWebhookController(req: Request, res: Response): Promise<Response> {
    try {
        const signature = req.headers['stripe-signature'];
        const rawBody = (req as Request & { rawBody?: Buffer }).rawBody;

        if (!rawBody) {
            return res.status(400).json({ error: 'Missing raw request body for webhook validation' });
        }

        await handleStripeWebhook(rawBody, typeof signature === 'string' ? signature : undefined);

        return res.status(200).json({ received: true });
    } catch (error) {
        return res.status(400).json({
            error: 'Webhook processing failed',
            details: (error as Error).message,
        });
    }
}

export async function getMyEnrollmentsController(req: Request, res: Response): Promise<Response> {
    try {
        const authReq = req as Request & { user?: AuthenticatedUser };

        if (!authReq.user) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        const enrollments = await prisma.enrollment.findMany({
            where: {
                studentId: authReq.user.userId,
            },
            include: {
                course: {
                    include: {
                        teacher: {
                            select: {
                                id: true,
                                username: true,
                                firstName: true,
                                lastName: true,
                            },
                        },
                        category: true,
                    },
                },
            },
            orderBy: {
                enrollmentDate: 'desc',
            },
        });

        return res.status(200).json(enrollments);
    } catch (error) {
        return res.status(500).json({
            error: 'Unable to fetch enrollments',
            details: (error as Error).message,
        });
    }
}

// DEV ONLY: Confirm enrollment after Stripe redirect (when webhook is not available)
export async function confirmEnrollmentController(req: Request, res: Response): Promise<Response> {
    try {
        const authReq = req as Request & { user?: AuthenticatedUser };

        if (!authReq.user) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        const courseId = Number.parseInt(req.params.courseId, 10);

        if (Number.isNaN(courseId)) {
            return res.status(400).json({ error: 'courseId must be a number' });
        }

        // Check if course exists
        const course = await prisma.course.findUnique({
            where: { id: courseId },
        });

        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }

        // Check if already enrolled
        const existingEnrollment = await prisma.enrollment.findUnique({
            where: {
                studentId_courseId: {
                    studentId: authReq.user.userId,
                    courseId: courseId,
                },
            },
        });

        if (existingEnrollment) {
            return res.status(200).json({ message: 'Already enrolled', enrollment: existingEnrollment });
        }

        // Create enrollment
        const enrollment = await prisma.enrollment.create({
            data: {
                studentId: authReq.user.userId,
                courseId: courseId,
            },
        });

        return res.status(201).json({ message: 'Enrollment confirmed', enrollment });
    } catch (error) {
        return res.status(500).json({
            error: 'Unable to confirm enrollment',
            details: (error as Error).message,
        });
    }
}

export async function getCourseContentController(req: Request, res: Response): Promise<Response> {
    try {
        const authReq = req as Request & { user?: AuthenticatedUser };

        if (!authReq.user) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        const courseId = Number.parseInt(req.params.courseId, 10);

        if (Number.isNaN(courseId)) {
            return res.status(400).json({ error: 'courseId must be a number' });
        }

        try {
            const courseData = await getCourseForEnrolledStudent(courseId, authReq.user.userId);
            return res.status(200).json(courseData);
        } catch (error) {
            const message = (error as Error).message;

            if (message === 'NOT_ENROLLED') {
                return res.status(403).json({ error: 'You are not enrolled in this course' });
            }

            if (message === 'COURSE_NOT_FOUND') {
                return res.status(404).json({ error: 'Course not found' });
            }

            throw error;
        }
    } catch (error) {
        return res.status(500).json({
            error: 'Unable to fetch course content',
            details: (error as Error).message,
        });
    }
}
