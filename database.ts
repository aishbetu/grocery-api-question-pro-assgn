// database.ts
import { createPool, Pool } from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool: Pool = createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'test',
});

export default pool;
