import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/auth.routes';
import courseRoutes from './routes/course.routes';
import uploadRoutes from './routes/upload.routes';
import enrollRoutes from './routes/enroll.routes';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3001;
const frontendOrigin = process.env.FRONTEND_URL || 'http://localhost:3000';
const prisma = new PrismaClient();

app.use(cors({
    origin: frontendOrigin,
    credentials: true,
}));
app.use(express.json({
    verify: (req: Request & { rawBody?: Buffer }, _res, buffer) => {
        if (req.originalUrl === '/api/stripe-webhook') {
            req.rawBody = buffer;
        }
    },
}));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api', courseRoutes);
app.use('/api', uploadRoutes);
app.use('/api', enrollRoutes);

app.get('/', (req: Request, res: Response) => {
    res.send('Express + TypeScript Server for E-Learning Platform');
});

app.get('/api/health', async (_req: Request, res: Response) => {
    try {
        await prisma.$queryRaw`SELECT 1`;
        res.status(200).json({ status: 'ok' });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Database unreachable',
            error: (error as Error).message,
        });
    }
});

const server = app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});

const shutdown = async () => {
    console.log('Shutting down server...');
    await prisma.$disconnect();
    server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
    });
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
