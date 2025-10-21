import { Role } from '@prisma/client';

export type AuthenticatedUser = {
    userId: number;
    role: Role;
};
