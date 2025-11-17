// File: packages/api/prisma/seed.ts
import { PrismaClient, Role, ContentType } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main(): Promise<void> {
    console.log('Deleting old data...');

    await prisma.comment.deleteMany();
    await prisma.answerOption.deleteMany();
    await prisma.question.deleteMany();
    await prisma.quizAttempt.deleteMany();
    await prisma.content.deleteMany();
    await prisma.module.deleteMany();
    await prisma.review.deleteMany();
    await prisma.payment.deleteMany();
    await prisma.enrollment.deleteMany();
    await prisma.course.deleteMany();
    await prisma.category.deleteMany();
    await prisma.user.deleteMany();

    console.log('Old data deleted.');

    const hashedPassword = await bcrypt.hash('Password123!', 10);

    const teacher = await prisma.user.create({
        data: {
            email: 'teacher@gmail.com',
            username: 'teacher01',
            hashedPassword,
            firstName: 'Teacher',
            lastName: 'User',
            role: Role.TEACHER,
        },
    });
    console.log('Created 1 teacher.');

    const students = await Promise.all([
        prisma.user.create({
            data: {
                email: 'student1@gmail.com',
                username: 'student01',
                hashedPassword,
                firstName: 'Student',
                lastName: 'One',
                role: Role.STUDENT,
            },
        }),
        prisma.user.create({
            data: {
                email: 'student2@gmail.com',
                username: 'student02',
                hashedPassword,
                firstName: 'Student',
                lastName: 'Two',
                role: Role.STUDENT,
            },
        }),
    ]);
    console.log(`Created ${students.length} students.`);

    const categoryProgramming = await prisma.category.create({
        data: {
            name: 'Programming',
        },
    });

    const categoryDesign = await prisma.category.create({
        data: {
            name: 'Design',
        },
    });
    console.log('Created 2 categories.');

    const course = await prisma.course.create({
        data: {
            title: 'Basic TypeScript Course',
            description: 'Learn TypeScript from basic to advanced in 4 weeks.',
            price: 49.99,
            teacherId: teacher.id,
            categoryId: categoryProgramming.id,
            modules: {
                create: [
                    {
                        title: 'Chapter 1: TypeScript Introduction',
                        order: 1,
                        contents: {
                            create: [
                                {
                                    title: 'Video: TypeScript Overview',
                                    order: 1,
                                    contentType: ContentType.VIDEO,
                                    videoUrl: 'https://example.com/videos/typescript-overview.mp4',
                                    durationInSeconds: 900,
                                },
                                {
                                    title: 'Document: Environment Setup',
                                    order: 2,
                                    contentType: ContentType.DOCUMENT,
                                    documentUrl: 'https://example.com/docs/setup-typescript.pdf',
                                    fileType: 'application/pdf',
                                },
                                {
                                    title: 'Quiz: Chapter 1 Review',
                                    order: 3,
                                    contentType: ContentType.QUIZ,
                                    timeLimitInMinutes: 10,
                                    questions: {
                                        create: [
                                            {
                                                questionText: 'What is TypeScript?',
                                                options: {
                                                    create: [
                                                        {
                                                            optionText: 'A superset of JavaScript with static typing',
                                                            isCorrect: true,
                                                        },
                                                        {
                                                            optionText: 'A CSS framework',
                                                            isCorrect: false,
                                                        },
                                                        {
                                                            optionText: 'A NoSQL database',
                                                            isCorrect: false,
                                                        },
                                                    ],
                                                },
                                            },
                                            {
                                                questionText: "What is 'npx prisma db seed' used for?",
                                                options: {
                                                    create: [
                                                        {
                                                            optionText: 'To run the seed script to add sample data to the database',
                                                            isCorrect: true,
                                                        },
                                                        {
                                                            optionText: 'To initialize a new React project',
                                                            isCorrect: false,
                                                        },
                                                        {
                                                            optionText: 'To create a new Prisma migration',
                                                            isCorrect: false,
                                                        },
                                                    ],
                                                },
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                    {
                        title: 'Chapter 2: Data Types',
                        order: 2,
                        contents: {
                            create: [
                                {
                                    title: 'Video: Basic Data Types',
                                    order: 1,
                                    contentType: ContentType.VIDEO,
                                    videoUrl: 'https://example.com/videos/typescript-types.mp4',
                                    durationInSeconds: 840,
                                },
                                {
                                    title: 'Document: Union and Intersection',
                                    order: 2,
                                    contentType: ContentType.DOCUMENT,
                                    documentUrl: 'https://example.com/docs/typescript-union-intersection.pdf',
                                    fileType: 'application/pdf',
                                },
                            ],
                        },
                    },
                ],
            },
        },
        include: {
            modules: {
                include: {
                    contents: true,
                },
            },
        },
    });
    console.log(`Created course with ${course.modules.length} modules and nested content.`);

    const enrollment = await prisma.enrollment.create({
        data: {
            studentId: students[0].id,
            courseId: course.id,
        },
    });
    console.log(`Enrolled student ${enrollment.studentId} in course ${enrollment.courseId}`);

    console.log('Seed data created successfully.');
}

main()
    .catch((e) => {
        console.error('Error while seeding data', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });