import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import authRouter from './routes/auth.route.js';
import productRouter from './routes/product.route.js';
import cartRouter from "./routes/cart.route.js"
import couponRouter from './routes/coupon.route.js';
import paymentRouter from './routes/payment.route.js'

import { connectDB } from './lib/db.js';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/coupon', couponRouter);
app.use('/api/payments', paymentRouter);

app.get('/', (req, res) => {
    res.send('API is running...');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB();
});