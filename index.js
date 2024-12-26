import express from 'express';
import dotenv from 'dotenv';

import authRouter from './routes/auth.route.js';

import { connectDB } from './lib/db.js';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/api/auth', authRouter);

app.get('/', (req, res) => {
    res.send('API is running...');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB();
});