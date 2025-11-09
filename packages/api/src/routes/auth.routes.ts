import { Router, Request, Response } from 'express';
import { Role } from '@prisma/client';
import { loginController, registerController } from '../controllers/auth.controller';
import { isAuthenticated, isAuthorized } from '../middleware/auth.middleware';
import { AuthenticatedUser } from '../types/auth';

const router = Router();

type AuthenticatedRequest = Request & { user?: AuthenticatedUser };

router.post('/register', registerController);
router.post('/login', loginController);

// Demo route to verify auth/authorization middleware. Remove or adjust once tested.
router.get(
    '/me/admin',
    isAuthenticated,
    isAuthorized([Role.ADMIN]),
    (req: AuthenticatedRequest, res: Response) => {
        if (!req.user) {
            return res.status(500).json({ error: 'Authenticated user context missing' });
        }

        return res.json({ message: 'You reached an admin-only route!', user: req.user });
    }
);

export default router;
