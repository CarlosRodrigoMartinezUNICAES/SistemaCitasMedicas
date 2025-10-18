import { Router } from 'express';
import { pool } from '../utils/db';

const router = Router();

// GET /api/paciente/:id_usuario
router.get('/:id', async (req, res) => {
    const id = req.params.id;
    console.log('\n=== Fetch paciente request ===');
    console.log('id param:', id);

    try {
        const conn = await pool.getConnection();
        console.log('DB connection acquired');

        // Get paciente info
        const pacienteQuery = `SELECT p.id_paciente, p.nombre_completo, p.telefono, p.correo, p.edad, p.dui, u.username
                       FROM Paciente p
                       JOIN Usuario u ON p.id_usuario = u.id_usuario
                       WHERE p.id_usuario = ? OR p.id_paciente = ?`;
        const pacienteResults = await conn.query(pacienteQuery, [id, id]);

        if (pacienteResults.length === 0) {
            conn.release();
            console.log('No paciente found for id:', id);
            return res.status(404).json({ success: false, message: 'Paciente no encontrado' });
        }
        const paciente = pacienteResults[0];

        // Get citas for this paciente
        const citasQuery = `SELECT c.id_cita, c.fecha, c.hora, c.estado, c.id_doctor, d.nombre_completo AS doctor_nombre, e.nombre AS especialidad
            FROM Cita c
            JOIN Doctor d ON c.id_doctor = d.id_doctor
            JOIN Especialidad e ON d.id_especialidad = e.id_especialidad
            WHERE c.id_paciente = ?
            ORDER BY c.fecha DESC, c.hora DESC`;
        const citas = await conn.query(citasQuery, [paciente.id_paciente]);
        conn.release();

        console.log('Paciente found:', paciente);
        console.log('Citas found:', citas.length);
        res.json({ success: true, paciente, citas });
    } catch (error: any) {
        console.error('Error fetching paciente:', error.message);
        res.status(500).json({ success: false, message: 'Error del servidor' });
    }
});

export default router;
