import { Request, Response } from 'express';
import { getAllCategories, getAllCourses, getCourseById } from '../services/course.service';

export async function getCategoriesController(_req: Request, res: Response): Promise<Response> {
    try {
        const categories = await getAllCategories();
        return res.status(200).json(categories);
    } catch (error) {
        return res.status(500).json({
            error: 'Unable to fetch categories',
            details: (error as Error).message,
        });
    }
}

export async function getCoursesController(_req: Request, res: Response): Promise<Response> {
    try {
        const courses = await getAllCourses();
        return res.status(200).json(courses);
    } catch (error) {
        return res.status(500).json({
            error: 'Unable to fetch courses',
            details: (error as Error).message,
        });
    }
}

export async function getCourseDetailController(req: Request, res: Response): Promise<Response> {
    try {
        const idParam = req.params.id;
        const courseId = Number.parseInt(idParam, 10);

        if (Number.isNaN(courseId)) {
            return res.status(400).json({ error: 'Course id must be a number' });
        }

        const course = await getCourseById(courseId);

        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }

        return res.status(200).json(course);
    } catch (error) {
        return res.status(500).json({
            error: 'Unable to fetch course detail',
            details: (error as Error).message,
        });
    }
}
