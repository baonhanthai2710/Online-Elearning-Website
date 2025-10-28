import { PrismaClient, Role, ContentType } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main(): Promise<void> {
    console.log('Đang xóa dữ liệu cũ...');

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

    console.log('Đã xóa dữ liệu cũ');

    const hashedPassword = await bcrypt.hash('Password123!', 10);

    const teacher = await prisma.user.create({
        data: {
            email: 'teacher@gmail.com',
            username: 'teacher01',
            hashedPassword,
            firstName: 'Thầy',
            lastName: 'Giáo',
            role: Role.TEACHER,
        },
    });
    console.log('Đã tạo 1 teacher');

    const students = await Promise.all([
        prisma.user.create({
            data: {
                email: 'student1@gmail.com',
                username: 'student01',
                hashedPassword,
                firstName: 'Sinh',
                lastName: 'VienMot',
                role: Role.STUDENT,
            },
        }),
        prisma.user.create({
            data: {
                email: 'student2@gmail.com',
                username: 'student02',
                hashedPassword,
                firstName: 'Sinh',
                lastName: 'VienHai',
                role: Role.STUDENT,
            },
        }),
    ]);
    console.log(`Đã tạo ${students.length} student`);

    const categoryProgramming = await prisma.category.create({
        data: {
            name: 'Lập trình',
        },
    });

    const categoryDesign = await prisma.category.create({
        data: {
            name: 'Thiết kế',
        },
    });
    console.log('Đã tạo 2 category');

    const course = await prisma.course.create({
        data: {
            title: 'Khóa học TypeScript cơ bản',
            description: 'Học TypeScript từ cơ bản đến nâng cao trong 4 tuần.',
            price: 49.99,
            teacherId: teacher.id,
            categoryId: categoryProgramming.id,
            modules: {
                create: [
                    {
                        title: 'Chương 1: Giới thiệu TypeScript',
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
                                    title: 'Tài liệu: Cài đặt môi trường',
                                    order: 2,
                                    contentType: ContentType.DOCUMENT,
                                    documentUrl: 'https://example.com/docs/setup-typescript.pdf',
                                    fileType: 'application/pdf',
                                },
                            ],
                        },
                    },
                    {
                        title: 'Chương 2: Kiểu dữ liệu',
                        order: 2,
                        contents: {
                            create: [
                                {
                                    title: 'Video: Kiểu dữ liệu cơ bản',
                                    order: 1,
                                    contentType: ContentType.VIDEO,
                                    videoUrl: 'https://example.com/videos/typescript-types.mp4',
                                    durationInSeconds: 840,
                                },
                                {
                                    title: 'Tài liệu: Union và Intersection',
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
    console.log(`Đã tạo khóa học với ${course.modules.length} chương và nội dung lồng nhau`);

    console.log('Seed data đã được tạo thành công');
}

main()
    .catch((e) => {
        console.error('Lỗi khi seed dữ liệu', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
