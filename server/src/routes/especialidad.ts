import { Router } from 'express';
import { pool } from '../utils/db';

const router = Router();

// Get all specialties
router.get('/', async (req, res) => {
    try {
        const [rows]: any = await pool.query('SELECT id_especialidad as id_especialidad, nombre, descripcion FROM Especialidad');
        console.log('Especialidades from DB:', rows);
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

// Get doctors by specialty
router.get('/:especialidadId/doctores', async (req, res) => {
    try {
        const especialidadId = req.params.especialidadId;
        
        let query = '';
        let params: any[] = [];
        
        // Check if the parameter is an ID or name
        if (especialidadId.startsWith('E')) {
            // It's an ID
            query = `
                SELECT 
                    d.id_doctor,
                    d.nombre_completo,
                    d.codigo_trabajador,
                    d.telefono,
                    e.nombre AS especialidad
                FROM Doctor d
                JOIN Especialidad e ON d.id_especialidad = e.id_especialidad
                WHERE d.id_especialidad = ?
                ORDER BY d.nombre_completo
            `;
            params = [especialidadId];
        } else {
            // It's a name
            query = `
                SELECT 
                    d.id_doctor,
                    d.nombre_completo,
                    d.codigo_trabajador,
                    d.telefono,
                    e.nombre AS especialidad
                FROM Doctor d
                JOIN Especialidad e ON d.id_especialidad = e.id_especialidad
                WHERE e.nombre = ?
                ORDER BY d.nombre_completo
            `;
            params = [especialidadId];
        }
        
        const [rows]: any = await pool.query(query, params);
        console.log('Doctors by specialty from DB:', rows);
        res.json({
            success: true,
            data: rows
        });
    } catch (error) {
        console.error('Error fetching doctors by specialty:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener los doctores por especialidad'
        });
    }
});

export default router;
