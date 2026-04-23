import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import connectDB from './config/db';

// Load env vars
dotenv.config();

// Connect to database
connectDB();

import userRoutes from './routes/userRoutes';
import jobRoutes from './routes/jobRoutes';
import candidateRoutes from './routes/candidateRoutes';
import screeningRoutes from './routes/screeningRoutes';
import dashboardRoutes from './routes/dashboardRoutes';
import aiRoutes from './routes/aiRoutes';

const app = express();

// Body parser
app.use(express.json());
app.use(cookieParser());

// setting proxy
app.set('trust proxy', 1);

// Enable CORS
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Cookie']
}));

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Routes
app.use('/api/users', userRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/candidates', candidateRoutes);
app.use('/api/screenings', screeningRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/ai', aiRoutes);

app.get('/', (req: Request, res: Response) => {
    res.send('API is running...');
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});

const PORT = process.env.PORT || 4000;

app.listen(
    PORT,
    () => console.log(
        `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
    )
);
