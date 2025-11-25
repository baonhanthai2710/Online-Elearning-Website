import { Request, Response } from 'express';
import { sendContactEmail } from '../services/email.service';

export async function sendContactController(req: Request, res: Response): Promise<Response> {
    try {
        const { name, email, subject, message } = req.body as {
            name?: string;
            email?: string;
            subject?: string;
            message?: string;
        };

        if (!name || !email || !subject || !message) {
            return res.status(400).json({
                error: 'Name, email, subject, and message are required',
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                error: 'Invalid email format',
            });
        }

        const sent = await sendContactEmail(name, email, subject, message);

        if (sent) {
            return res.status(200).json({
                message: 'Contact form submitted successfully. We will respond within 24 hours.',
            });
        } else {
            return res.status(500).json({
                error: 'Failed to send contact email. Please try again later or contact us directly.',
            });
        }
    } catch (error) {
        return res.status(500).json({
            error: 'Unable to process contact request',
            details: (error as Error).message,
        });
    }
}

