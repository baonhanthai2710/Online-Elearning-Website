import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getAllCategories() {
    return prisma.category.findMany({
        orderBy: { name: 'asc' },
        select: {
            id: true,
            name: true,
        },
    });
}

export async function getAllCourses() {
    return prisma.course.findMany({
        orderBy: { createdAt: 'desc' },
        select: {
            id: true,
            title: true,
            description: true,
            price: true,
            createdAt: true,
            updatedAt: true,
            category: {
                select: {
                    id: true,
                    name: true,
                },
            },
            teacher: {
                select: {
                    id: true,
                    username: true,
                    firstName: true,
                    lastName: true,
                },
            },
        },
    });
}

export async function getCourseById(courseId: number) {
    return prisma.course.findUnique({
        where: { id: courseId },
        select: {
            id: true,
            title: true,
            description: true,
            price: true,
            createdAt: true,
            updatedAt: true,
            category: {
                select: {
                    id: true,
                    name: true,
                },
            },
            teacher: {
                select: {
                    id: true,
                    username: true,
                    firstName: true,
                    lastName: true,
                },
            },
            modules: {
                orderBy: { order: 'asc' },
                select: {
                    id: true,
                    title: true,
                    order: true,
                    contents: {
                        orderBy: { order: 'asc' },
                        select: {
                            id: true,
                            title: true,
                            order: true,
                            contentType: true,
                            durationInSeconds: true,
                            timeLimitInMinutes: true,
                            // Intentionally omit video/document URLs to keep asset links hidden
                        },
                    },
                },
            },
        },
    });
}
