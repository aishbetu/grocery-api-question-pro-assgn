import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthRequest extends Request {
    user?: {
        id: string;
        username: string;
        role: string;
    };
}

export const userAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as { id: string, username: string, role: string };
        
        if (decoded.role !== 'user') {
            return res.status(403).json({ message: 'Forbidden: You do not have the necessary permissions' });
        }
        req.user = { id: decoded.id, username: decoded.username, role: decoded.role };
        next();
    } catch (error) {
        console.error(error);
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
};
