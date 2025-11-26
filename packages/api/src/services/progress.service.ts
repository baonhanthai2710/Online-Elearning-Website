import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Mark a content as completed for a student
 */
export async function markContentCompleted(
    contentId: number,
    studentId: number
): Promise<{ progress: number; isCompleted: boolean }> {
    // Get the content and its course
    const content = await prisma.content.findUnique({
        where: { id: contentId },
        include: {
            module: {
                include: {
                    course: true,
                },
            },
        },
    });

    if (!content) {
        throw new Error('CONTENT_NOT_FOUND');
    }

    const courseId = content.module.courseId;

    // Check if student is enrolled
    const enrollment = await prisma.enrollment.findUnique({
        where: {
            studentId_courseId: {
                studentId,
                courseId,
            },
        },
    });

    if (!enrollment) {
        throw new Error('NOT_ENROLLED');
    }

    // Check if content already completed
    const existingProgress = await prisma.contentProgress.findUnique({
        where: {
            enrollmentId_contentId: {
                enrollmentId: enrollment.id,
                contentId,
            },
        },
    });

    if (!existingProgress) {
        // Create new content progress
        await prisma.contentProgress.create({
            data: {
                enrollmentId: enrollment.id,
                contentId,
            },
        });
    }

    // Calculate new progress
    const progress = await calculateProgress(enrollment.id, courseId);

    // Update enrollment progress
    const isCompleted = progress >= 100;
    await prisma.enrollment.update({
        where: { id: enrollment.id },
        data: {
            progress,
            completionDate: isCompleted ? new Date() : null,
        },
    });

    return { progress, isCompleted };
}

/**
 * Calculate progress percentage for an enrollment
 */
async function calculateProgress(enrollmentId: number, courseId: number): Promise<number> {
    // Get total content count for the course
    const totalContents = await prisma.content.count({
        where: {
            module: {
                courseId,
            },
        },
    });

    if (totalContents === 0) {
        return 0;
    }

    // Get completed content count
    const completedContents = await prisma.contentProgress.count({
        where: {
            enrollmentId,
        },
    });

    return Math.round((completedContents / totalContents) * 100);
}

/**
 * Get completed content IDs for an enrollment
 */
export async function getCompletedContents(
    courseId: number,
    studentId: number
): Promise<number[]> {
    const enrollment = await prisma.enrollment.findUnique({
        where: {
            studentId_courseId: {
                studentId,
                courseId,
            },
        },
        include: {
            contentProgresses: {
                select: {
                    contentId: true,
                },
            },
        },
    });

    if (!enrollment) {
        return [];
    }

    return enrollment.contentProgresses.map((cp) => cp.contentId);
}

/**
 * Unmark a content as completed (optional - for toggling)
 */
export async function unmarkContentCompleted(
    contentId: number,
    studentId: number
): Promise<{ progress: number }> {
    const content = await prisma.content.findUnique({
        where: { id: contentId },
        include: {
            module: true,
        },
    });

    if (!content) {
        throw new Error('CONTENT_NOT_FOUND');
    }

    const courseId = content.module.courseId;

    const enrollment = await prisma.enrollment.findUnique({
        where: {
            studentId_courseId: {
                studentId,
                courseId,
            },
        },
    });

    if (!enrollment) {
        throw new Error('NOT_ENROLLED');
    }

    // Delete content progress if exists
    await prisma.contentProgress.deleteMany({
        where: {
            enrollmentId: enrollment.id,
            contentId,
        },
    });

    // Recalculate progress
    const progress = await calculateProgress(enrollment.id, courseId);

    await prisma.enrollment.update({
        where: { id: enrollment.id },
        data: {
            progress,
            completionDate: null,
        },
    });

    return { progress };
}

