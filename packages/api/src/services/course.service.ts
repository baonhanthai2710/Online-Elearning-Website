import { ContentType, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const courseSummarySelect = {
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
} as const;

const courseDetailSelect = {
    ...courseSummarySelect,
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
} as const;

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
        select: courseSummarySelect,
    });
}

export async function getCourseById(courseId: number) {
    return prisma.course.findUnique({
        where: { id: courseId },
        select: courseDetailSelect,
    });
}

type CreateCourseInput = {
    title: string;
    description: string;
    price: number;
    categoryId: number;
    teacherId: number;
};

type UpdateCourseInput = {
    courseId: number;
    teacherId: number;
    title?: string;
    description?: string;
    price?: number;
    categoryId?: number;
};

type CreateModuleInput = {
    courseId: number;
    teacherId: number;
    title: string;
    order?: number;
};

type CreateContentInput = {
    moduleId: number;
    teacherId: number;
    title: string;
    order?: number;
    contentType: ContentType;
    videoUrl?: string | null;
    durationInSeconds?: number | null;
    documentUrl?: string | null;
    fileType?: string | null;
    timeLimitInMinutes?: number | null;
};

export async function createCourseForTeacher(input: CreateCourseInput) {
    const course = await prisma.course.create({
        data: {
            title: input.title,
            description: input.description,
            price: input.price,
            categoryId: input.categoryId,
            teacherId: input.teacherId,
        },
    });

    return getCourseById(course.id);
}

export async function updateCourseForTeacher(input: UpdateCourseInput) {
    const owningCourse = await prisma.course.findUnique({
        where: { id: input.courseId },
        select: { teacherId: true },
    });

    if (!owningCourse) {
        throw new Error('COURSE_NOT_FOUND');
    }

    if (owningCourse.teacherId !== input.teacherId) {
        throw new Error('COURSE_FORBIDDEN');
    }

    await prisma.course.update({
        where: { id: input.courseId },
        data: {
            title: input.title ?? undefined,
            description: input.description ?? undefined,
            price: input.price ?? undefined,
            categoryId: input.categoryId ?? undefined,
        },
    });

    return getCourseById(input.courseId);
}

export async function createModuleForCourse(input: CreateModuleInput) {
    const owningCourse = await prisma.course.findUnique({
        where: { id: input.courseId },
        select: { teacherId: true },
    });

    if (!owningCourse) {
        throw new Error('COURSE_NOT_FOUND');
    }

    if (owningCourse.teacherId !== input.teacherId) {
        throw new Error('COURSE_FORBIDDEN');
    }

    const nextOrder =
        input.order !== undefined
            ? input.order
            : (await prisma.module.count({ where: { courseId: input.courseId } })) + 1;

    return prisma.module.create({
        data: {
            title: input.title,
            order: nextOrder,
            courseId: input.courseId,
        },
        select: {
            id: true,
            title: true,
            order: true,
            courseId: true,
        },
    });
}

export async function createContentForModule(input: CreateContentInput) {
    const owningModule = await prisma.module.findUnique({
        where: { id: input.moduleId },
        select: {
            course: {
                select: { teacherId: true },
            },
        },
    });

    if (!owningModule) {
        throw new Error('MODULE_NOT_FOUND');
    }

    if (owningModule.course.teacherId !== input.teacherId) {
        throw new Error('COURSE_FORBIDDEN');
    }

    const nextOrder =
        input.order !== undefined
            ? input.order
            : (await prisma.content.count({ where: { moduleId: input.moduleId } })) + 1;

    return prisma.content.create({
        data: {
            title: input.title,
            order: nextOrder,
            contentType: input.contentType,
            videoUrl: input.videoUrl ?? null,
            durationInSeconds: input.durationInSeconds ?? null,
            documentUrl: input.documentUrl ?? null,
            fileType: input.fileType ?? null,
            timeLimitInMinutes: input.timeLimitInMinutes ?? null,
            moduleId: input.moduleId,
        },
        select: {
            id: true,
            title: true,
            order: true,
            contentType: true,
            durationInSeconds: true,
            timeLimitInMinutes: true,
            moduleId: true,
        },
    });
}
