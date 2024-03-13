// authController.ts
import { Request, Response } from 'express';
import { sign } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import pool from '../../database';

interface User {
    id: number;
    username: string;
    password: string;
    email?: string;
    full_name?: string;
}

interface SignupRequest {
    username: string;
    password: string;
    email?: string;
    full_name?: string;
    role: 'admin' | 'user';
}

interface InsertResult extends ResultSetHeader {
    insertId: number;
}


export const login = async (req: Request, res: Response) => {
    const { username, password, role } = req.body;

    try {
        const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM ?? WHERE username = ?', [role === 'admin' ? 'admins' : 'users', username]);

        const users: User[] = rows.map(row => ({ id: row.id, username: row.username, password: row.password, email: row.email, full_name: row.full_name }));

        if (users.length === 1) {
            const user = users[0];
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (passwordMatch) {
                const token = sign({ id: user.id, username, role: 'admin' }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
                res.json({ token });
            } else {
                res.status(401).json({ message: 'Invalid username or password' });
            }
        } else {
            res.status(401).json({ message: 'Invalid username or password' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const signup = async (req: Request<{}, {}, SignupRequest>, res: Response) => {
    const { username, password, email, full_name, role } = req.body;

    try {
        // Check if username already exists
        const [existingUsers] = await pool.query<RowDataPacket[]>('SELECT * FROM ?? WHERE username = ?', [role === 'admin' ? 'admins' : 'users', username]);

        if (existingUsers.length > 0) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        // Encrypt password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user into the appropriate table based on role
        const tableName = role === 'admin' ? 'admins' : 'users';

        const [result] = await pool.query<InsertResult>(`INSERT INTO ${tableName} (username, password, email, full_name) VALUES (?, ?, ?, ?)`, [username, hashedPassword, email, full_name]);
        
        const insertId: number = result.insertId;

        // Generate JWT token
        const token = sign({ id: insertId, username, role }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });

        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
