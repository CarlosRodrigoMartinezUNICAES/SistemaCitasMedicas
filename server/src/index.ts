import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './utils/db';
import authRoutes from './routes/auth';
import pacienteRoutes from './routes/paciente';
import citaRoutes from './routes/cita';
import doctorRoutes from './routes/doctor';
import usuarioRoutes from './routes/usuario';
import especialidadRoutes from './routes/especialidad';
import consultaRoutes from './routes/consulta';

// Load environment variables
dotenv.config();

// Initialize express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', authRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/paciente', pacienteRoutes);
app.use('/api/cita', citaRoutes);
app.use('/api/doctor', doctorRoutes);
app.use('/api/especialidad', especialidadRoutes);
app.use('/api', consultaRoutes);

// Connect to database and start server
const PORT = process.env.PORT || 3000;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});