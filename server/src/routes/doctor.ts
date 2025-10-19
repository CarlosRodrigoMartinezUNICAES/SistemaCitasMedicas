import { Router } from 'express';
import { pool } from '../utils/db';

const router = Router();

// GET /api/doctor/:id_usuario
router.get('/:id', async (req, res) => {
    const id = req.params.id;
    console.log('\n=== Fetch doctor request ===');
    console.log('id param:', id);

    try {
        const conn = await pool.getConnection();
        console.log('DB connection acquired');

        // Get doctor info
        const doctorQuery = `SELECT d.id_doctor, d.nombre_completo, d.codigo_trabajador, d.telefono, 
                                   e.nombre AS especialidad, e.descripcion AS especialidad_descripcion,
                                   u.username
                            FROM Doctor d
                            JOIN Usuario u ON d.id_usuario = u.id_usuario
                            JOIN Especialidad e ON d.id_especialidad = e.id_especialidad
                            WHERE d.id_usuario = ? OR d.id_doctor = ?`;
        const doctorResults = await conn.query(doctorQuery, [id, id]);

        if (doctorResults.length === 0) {
            conn.release();
            console.log('No doctor found for id:', id);
            return res.status(404).json({ success: false, message: 'Doctor no encontrado' });
        }
        const doctor = doctorResults[0];
        const doctorId = doctor.id_doctor.toString();

        // Get statistics
        // Build today's date in local timezone: YYYY-MM-DD
        const now = new Date();
        const yyyy = now.getFullYear();
        const mm = String(now.getMonth() + 1).padStart(2, '0');
        const dd = String(now.getDate()).padStart(2, '0');
        const today = `${yyyy}-${mm}-${dd}`;
        
        // Total citas
        const totalCitasQuery = `SELECT COUNT(*) as total FROM Cita WHERE id_doctor = ?`;
        const totalCitasResult = await conn.query(totalCitasQuery, [doctorId]);
        
        // Citas hoy
        const citasHoyQuery = `SELECT COUNT(*) as total FROM Cita WHERE id_doctor = ? AND fecha = ?`;
        const citasHoyResult = await conn.query(citasHoyQuery, [doctorId, today]);
        
        // Citas pendientes
        const citasPendientesQuery = `SELECT COUNT(*) as total FROM Cita WHERE id_doctor = ? AND estado = 'Pendiente'`;
        const citasPendientesResult = await conn.query(citasPendientesQuery, [doctorId]);
        
        // Total pacientes únicos
        const totalPacientesQuery = `SELECT COUNT(DISTINCT id_paciente) as total FROM Cita WHERE id_doctor = ?`;
        const totalPacientesResult = await conn.query(totalPacientesQuery, [doctorId]);

        // Get all appointments for calendar
        const appointmentsQuery = `SELECT c.id_cita,
                                         DATE(c.fecha) AS fecha,
                                         DATE_FORMAT(c.hora, '%H:%i') AS hora,
                                         c.estado, 
                                         p.nombre_completo AS paciente_nombre, p.telefono AS paciente_telefono,
                                         e.nombre AS especialidad
                                  FROM Cita c
                                  JOIN Paciente p ON c.id_paciente = p.id_paciente
                                  JOIN Doctor d ON c.id_doctor = d.id_doctor
                                  JOIN Especialidad e ON d.id_especialidad = e.id_especialidad
                                  WHERE c.id_doctor = ?
                                  ORDER BY c.fecha ASC, c.hora ASC`;
        const appointments = (await conn.query(appointmentsQuery, [doctorId])).map((appt: any) => ({
            ...appt,
            id_cita: appt.id_cita.toString() // Convert BigInt to string
        }));

        conn.release();

        // Convert BigInt counts to numbers for the stats
        const stats = {
            total_citas: Number(totalCitasResult[0]?.total) || 0,
            citas_hoy: Number(citasHoyResult[0]?.total) || 0,
            citas_pendientes: Number(citasPendientesResult[0]?.total) || 0,
            total_pacientes: Number(totalPacientesResult[0]?.total) || 0
        };

        console.log('Doctor found:', doctor);
        console.log('Stats:', stats);
        console.log('Appointments found:', appointments.length);
        
        res.json({ 
            success: true, 
            doctor: {
                id_doctor: doctor.id_doctor.toString(),
                nombre_completo: doctor.nombre_completo,
                especialidad: doctor.especialidad,
                codigo_trabajador: doctor.codigo_trabajador,
                telefono: doctor.telefono,
                username: doctor.username
            },
            stats,
            appointments
        });
    } catch (error: any) {
        console.error('Error fetching doctor:', error.message);
        res.status(500).json({ success: false, message: 'Error del servidor' });
    }
});

export default router;
