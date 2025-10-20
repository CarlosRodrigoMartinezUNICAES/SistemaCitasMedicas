import { Router } from 'express';
import { pool } from '../utils/db';

const router = Router();

// Get all specialties
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT id_especialidad as id_especialidad, nombre, descripcion FROM Especialidad');
        res.json({
            success: true,
            data: rows
        });
    } catch (error) {
        console.error('Error fetching specialties:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener las especialidades'
        });
    }
});

export default router;
