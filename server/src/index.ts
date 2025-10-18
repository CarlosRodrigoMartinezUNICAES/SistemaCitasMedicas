import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './utils/db';
import authRoutes from './routes/auth';
import pacienteRoutes from './routes/paciente';

// Load environment variables
dotenv.config();

// Initialize express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', authRoutes);
app.use('/api/paciente', pacienteRoutes);

// Connect to database and start server
const PORT = process.env.PORT || 3000;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});