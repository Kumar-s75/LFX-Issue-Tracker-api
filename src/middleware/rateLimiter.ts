import { Request, Response, NextFunction } from 'express';

interface RateLimitStore {
    [key: string]: {
        count: number;
        resetTime: number;
    };
}

const store: RateLimitStore = {};

export const rateLimiter = (windowMs: number = 15 * 60 * 1000, max: number = 100) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const key = req.ip || 'unknown';
        const now = Date.now();
        
        if (!store[key] || now > store[key].resetTime) {
            store[key] = {
                count: 1,
                resetTime: now + windowMs,
            };
        } else {
            store[key].count++;
        }

        if (store[key].count > max) {
            res.status(429).json({
                error: 'Too many requests, please try again later.',
            });
            return;
        }

        next();
    };
};