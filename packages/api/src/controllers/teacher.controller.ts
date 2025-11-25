import { Request, Response } from 'express';
import { getTeacherProfile, getAllTeachers } from '../services/teacher.service';

export async function getTeacherProfileController(req: Request, res: Response): Promise<Response> {
    try {
        const teacherId = Number.parseInt(req.params.id, 10);

        if (Number.isNaN(teacherId)) {
            return res.status(400).json({ error: 'Teacher ID must be a number' });
        }

        const teacher = await getTeacherProfile(teacherId);

        if (!teacher) {
            return res.status(404).json({ error: 'Teacher not found' });
        }

        return res.status(200).json(teacher);
    } catch (error) {
        return res.status(500).json({
            error: 'Unable to fetch teacher profile',
            details: (error as Error).message,
        });
    }
}

export async function getAllTeachersController(_req: Request, res: Response): Promise<Response> {
    try {
        const teachers = await getAllTeachers();
        return res.status(200).json(teachers);
    } catch (error) {
        return res.status(500).json({
            error: 'Unable to fetch teachers',
            details: (error as Error).message,
        });
    }
}

