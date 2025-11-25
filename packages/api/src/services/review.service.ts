import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export type CreateReviewInput = {
    courseId: number;
    studentId: number;
    rating: number;
    comment?: string;
};

export type UpdateReviewInput = {
    rating: number;
    comment?: string;
};

// Get all reviews for a course
export async function getCourseReviews(courseId: number) {
    const reviews = await prisma.review.findMany({
        where: {
            enrollment: {
                courseId,
            },
        },
        include: {
            student: {
                select: {
                    id: true,
                    username: true,
                    firstName: true,
                    lastName: true,
                },
            },
            enrollment: {
                select: {
                    enrollmentDate: true,
                },
            },
        },
        orderBy: {
            datePosted: 'desc',
        },
    });

    // Calculate average rating
    const averageRating =
        reviews.length > 0
            ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
            : 0;

    // Count ratings by star
    const ratingCounts = {
        5: reviews.filter((r) => r.rating === 5).length,
        4: reviews.filter((r) => r.rating === 4).length,
        3: reviews.filter((r) => r.rating === 3).length,
        2: reviews.filter((r) => r.rating === 2).length,
        1: reviews.filter((r) => r.rating === 1).length,
    };

    return {
        reviews: reviews.map((review) => ({
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
            enrollmentDate: review.enrollment.enrollmentDate,
        })),
        averageRating: Math.round(averageRating * 10) / 10,
        totalReviews: reviews.length,
        ratingCounts,
    };
}

// Get user's review for a course (if exists)
export async function getUserReview(courseId: number, studentId: number) {
    const enrollment = await prisma.enrollment.findUnique({
        where: {
            studentId_courseId: {
                studentId,
                courseId,
            },
        },
        include: {
            review: {
                include: {
                    student: {
                        select: {
                            id: true,
                            username: true,
                            firstName: true,
                            lastName: true,
                        },
                    },
                },
            },
        },
    });

    if (!enrollment || !enrollment.review) {
        return null;
    }

    return {
        id: enrollment.review.id,
        rating: enrollment.review.rating,
        comment: enrollment.review.comment,
        datePosted: enrollment.review.datePosted,
        enrollmentId: enrollment.id,
    };
}

// Create or update review
export async function createOrUpdateReview(input: CreateReviewInput) {
    // Validate rating
    if (input.rating < 1 || input.rating > 5) {
        throw new Error('Rating must be between 1 and 5');
    }

    // Check if student is enrolled
    const enrollment = await prisma.enrollment.findUnique({
        where: {
            studentId_courseId: {
                studentId: input.studentId,
                courseId: input.courseId,
            },
        },
    });

    if (!enrollment) {
        throw new Error('You must be enrolled in this course to leave a review');
    }

    // Check if review already exists
    const existingReview = await prisma.review.findUnique({
        where: {
            enrollmentId: enrollment.id,
        },
    });

    if (existingReview) {
        // Update existing review
        return await prisma.review.update({
            where: {
                id: existingReview.id,
            },
            data: {
                rating: input.rating,
                comment: input.comment || null,
                datePosted: new Date(), // Update date when modified
            },
            include: {
                student: {
                    select: {
                        id: true,
                        username: true,
                        firstName: true,
                        lastName: true,
                    },
                },
            },
        });
    } else {
        // Create new review
        return await prisma.review.create({
            data: {
                rating: input.rating,
                comment: input.comment || null,
                enrollmentId: enrollment.id,
                studentId: input.studentId,
            },
            include: {
                student: {
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
}

// Delete review
export async function deleteReview(reviewId: number, studentId: number) {
    const review = await prisma.review.findUnique({
        where: {
            id: reviewId,
        },
    });

    if (!review) {
        throw new Error('Review not found');
    }

    if (review.studentId !== studentId) {
        throw new Error('You can only delete your own review');
    }

    return await prisma.review.delete({
        where: {
            id: reviewId,
        },
    });
}

