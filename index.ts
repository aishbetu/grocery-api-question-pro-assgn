// index.ts
import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './src/routes/authRoutes';
import adminRoutes from './src/routes/adminRoutes';
import userRoutes from './src/routes/userRoutes';

dotenv.config();

const app = express();
const PORT: number = 3000;

app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/user', userRoutes);

// Start server
app.listen(PORT, () => {
    console.log(process.env.DB_HOST)
    console.log(`Server is running on http://localhost:${PORT}`);
});
