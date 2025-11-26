import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // Update all existing users to be verified
    const result = await prisma.user.updateMany({
        where: {
            isVerified: false,
        },
        data: {
            isVerified: true,
            verificationToken: null,
            verificationTokenExpiry: null,
        },
    });

    console.log(`✅ Updated ${result.count} users to verified status`);
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());

