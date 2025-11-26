import { Request, Response } from 'express';
import { AuthenticatedUser } from '../types/auth';
import { getEnrolledStudents, getEnrollmentStats, getStudentPerformance } from '../services/enrollment.service';

export async function getEnrolledStudentsController(req: Request, res: Response): Promise<Response> {
    try {
        const authReq = req as Request & { user?: AuthenticatedUser };
        if (!authReq.user) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        const courseId = Number.parseInt(req.params.courseId, 10);

        if (Number.isNaN(courseId)) {
            return res.status(400).json({ error: 'Course ID must be a number' });
        }

        const students = await getEnrolledStudents(courseId, authReq.user.userId);

        return res.status(200).json(students);
    } catch (error) {
        const message = (error as Error).message;

        if (message.includes('not found')) {
            return res.status(404).json({ error: message });
        }

        if (message.includes('permission')) {
            return res.status(403).json({ error: message });
        }

        return res.status(500).json({
            error: 'Unable to fetch enrolled students',
            details: message,
        });
    }
}

export async function getEnrollmentStatsController(req: Request, res: Response): Promise<Response> {
    try {
        const authReq = req as Request & { user?: AuthenticatedUser };
        if (!authReq.user) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        const courseId = Number.parseInt(req.params.courseId, 10);

        if (Number.isNaN(courseId)) {
            return res.status(400).json({ error: 'Course ID must be a number' });
        }

        const stats = await getEnrollmentStats(courseId, authReq.user.userId);

        return res.status(200).json(stats);
    } catch (error) {
        const message = (error as Error).message;

        if (message.includes('not found')) {
            return res.status(404).json({ error: message });
        }

        if (message.includes('permission')) {
            return res.status(403).json({ error: message });
        }

        return res.status(500).json({
            error: 'Unable to fetch enrollment stats',
            details: message,
        });
    }
}

export async function getStudentPerformanceController(req: Request, res: Response): Promise<Response> {
    try {
        const authReq = req as Request & { user?: AuthenticatedUser };
        if (!authReq.user) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        const courseId = Number.parseInt(req.params.courseId, 10);
        const studentId = Number.parseInt(req.params.studentId, 10);

        if (Number.isNaN(courseId) || Number.isNaN(studentId)) {
            return res.status(400).json({ error: 'Course ID and Student ID must be numbers' });
        }

        const performance = await getStudentPerformance(courseId, studentId, authReq.user.userId);

        return res.status(200).json(performance);
    } catch (error) {
        const message = (error as Error).message;

        if (message.includes('not found') || message.includes('not enrolled')) {
            return res.status(404).json({ error: message });
        }

        if (message.includes('permission')) {
            return res.status(403).json({ error: message });
        }

        return res.status(500).json({
            error: 'Unable to fetch student performance',
            details: message,
        });
    }
}

