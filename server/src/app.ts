import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
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

// Simple request logger
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Routes
app.use('/api', authRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/paciente', pacienteRoutes);
app.use('/api/cita', citaRoutes);
app.use('/api/doctor', doctorRoutes);
app.use('/api/especialidad', especialidadRoutes);
app.use('/api', consultaRoutes);

export default app;
