import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';
import { getActivePromotionByCode, calculateDiscount, incrementPromotionUsage } from './promotion.service';

const prisma = new PrismaClient();

function getStripeClient(): Stripe {
    const secretKey = process.env.STRIPE_SECRET_KEY;

    if (!secretKey) {
        throw new Error('STRIPE_SECRET_KEY environment variable is not defined');
    }

    return new Stripe(secretKey, {
        apiVersion: '2024-06-20',
    });
}

export async function checkoutCourse(options: {
    courseId: number;
    studentId: number;
    successUrl: string;
    cancelUrl: string;
    promotionCode?: string;
}): Promise<string> {
    const course = await prisma.course.findUnique({
        where: { id: options.courseId },
        select: { id: true, title: true, price: true },
    });

    if (!course) {
        throw new Error('COURSE_NOT_FOUND');
    }

    const existingEnrollment = await prisma.enrollment.findUnique({
        where: {
            studentId_courseId: {
                studentId: options.studentId,
                courseId: options.courseId,
            },
        },
    });

    if (existingEnrollment) {
        throw new Error('ALREADY_ENROLLED');
    }

    // Apply promotion if provided
    let finalPrice = course.price;
    let discountAmount = 0;
    let promotionId: number | undefined;

    if (options.promotionCode && course.price > 0) {
        const promotion = await getActivePromotionByCode(options.promotionCode);
        if (promotion) {
            const discount = calculateDiscount(course.price, promotion);
            finalPrice = discount.discountedPrice;
            discountAmount = discount.discountAmount;
            promotionId = promotion.id;
        }
    }

    // Handle FREE courses (including after promotion)
    if (finalPrice === 0) {
        await prisma.enrollment.create({
            data: {
                studentId: options.studentId,
                courseId: options.courseId,
            },
        });

        // Increment promotion usage if applied
        if (options.promotionCode) {
            await incrementPromotionUsage(options.promotionCode);
        }
        
        // Return success URL with free flag
        return `${options.successUrl}?free=true`;
    }

    const stripe = getStripeClient();

    // Create Stripe checkout session with course and student info in metadata
    // Enrollment will be created ONLY when webhook confirms payment success
    const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        success_url: `${options.successUrl}?courseId=${options.courseId}${options.promotionCode ? `&promo=${options.promotionCode}` : ''}`,
        cancel_url: options.cancelUrl,
        customer_email: undefined,
        metadata: {
            courseId: options.courseId.toString(),
            studentId: options.studentId.toString(),
            courseTitle: course.title,
            promotionCode: options.promotionCode || '',
            promotionId: promotionId?.toString() || '',
        },
        line_items: [
            {
                quantity: 1,
                price_data: {
                    currency: 'usd',
                    unit_amount: Math.round(finalPrice * 100),
                    product_data: {
                        name: course.title,
                        description: discountAmount > 0 
                            ? `Original: $${course.price.toFixed(2)}, Discount: $${discountAmount.toFixed(2)}`
                            : undefined,
                    },
                },
            },
        ],
    });

    return session.url ?? '';
}

export async function getCourseForEnrolledStudent(courseId: number, studentId: number) {
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

    // Get full course data including video URLs for enrolled students
    const course = await prisma.course.findUnique({
        where: { id: courseId },
        select: {
            id: true,
            title: true,
            description: true,
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
                            videoUrl: true,
                            documentUrl: true,
                            durationInSeconds: true,
                            timeLimitInMinutes: true,
                        },
                    },
                },
            },
        },
    });

    if (!course) {
        throw new Error('COURSE_NOT_FOUND');
    }

    return {
        ...course,
        enrollment: {
            enrollmentId: enrollment.id,
            progress: enrollment.progress,
            completionDate: enrollment.completionDate,
        },
    };
}

export async function handleStripeWebhook(payload: Buffer, signature: string | undefined): Promise<void> {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
        throw new Error('STRIPE_WEBHOOK_SECRET environment variable is not defined');
    }

    const stripe = getStripeClient();

    if (!signature) {
        throw new Error('STRIPE_SIGNATURE_MISSING');
    }

    const event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);

    if (event.type !== 'checkout.session.completed') {
        return;
    }

    const session = event.data.object as Stripe.Checkout.Session;
    const courseId = session.metadata?.courseId;
    const studentId = session.metadata?.studentId;
    const promotionCode = session.metadata?.promotionCode;

    if (!courseId || !studentId) {
        throw new Error('STRIPE_METADATA_MISSING');
    }

    const courseIdNum = Number(courseId);
    const studentIdNum = Number(studentId);

    // Check if already enrolled (prevent duplicate)
    const existingEnrollment = await prisma.enrollment.findUnique({
        where: {
            studentId_courseId: {
                studentId: studentIdNum,
                courseId: courseIdNum,
            },
        },
    });

    if (existingEnrollment) {
        console.log('User already enrolled, skipping...');
        return;
    }

    // Create enrollment after successful payment
    const enrollment = await prisma.enrollment.create({
        data: {
            studentId: studentIdNum,
            courseId: courseIdNum,
        },
    });

    // Create payment record
    await prisma.payment.create({
        data: {
            amount: (session.amount_total || 0) / 100,
            status: 'SUCCESSFUL',
            stripeSessionId: session.id,
            enrollmentId: enrollment.id,
            studentId: studentIdNum,
        },
    });

    // Increment promotion usage if applied
    if (promotionCode) {
        await incrementPromotionUsage(promotionCode);
    }

    console.log(`Enrollment created for student ${studentIdNum} in course ${courseIdNum}`);
}
