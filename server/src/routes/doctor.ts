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

// GET /api/doctor/:id_usuario/pacientes - Get all patients for a specific doctor
router.get('/:id/pacientes', async (req, res) => {
    const id = req.params.id;
    console.log('\n=== Fetch doctor patients request ===');
    console.log('id param:', id);

    try {
        const conn = await pool.getConnection();
        console.log('DB connection acquired');

        // Get doctor info first
        const doctorQuery = `SELECT d.id_doctor FROM Doctor d WHERE d.id_usuario = ? OR d.id_doctor = ?`;
        const doctorResults = await conn.query(doctorQuery, [id, id]);

        if (doctorResults.length === 0) {
            conn.release();
            console.log('No doctor found for id:', id);
            return res.status(404).json({ success: false, message: 'Doctor no encontrado' });
        }
        const doctorId = doctorResults[0].id_doctor.toString();

        // Get all unique patients who have had appointments with this doctor
        const pacientesQuery = `
            SELECT DISTINCT 
                p.id_paciente,
                p.nombre_completo,
                p.edad,
                p.telefono,
                p.correo,
                p.dui,
                (SELECT MAX(c.fecha) 
                 FROM Cita c 
                 WHERE c.id_paciente = p.id_paciente AND c.id_doctor = ?) as ultima_consulta,
                (SELECT COUNT(*) 
                 FROM Cita c 
                 WHERE c.id_paciente = p.id_paciente AND c.id_doctor = ?) as total_citas
            FROM Paciente p
            INNER JOIN Cita c ON p.id_paciente = c.id_paciente
            WHERE c.id_doctor = ?
            ORDER BY ultima_consulta DESC, p.nombre_completo ASC
        `;
        const pacientes = await conn.query(pacientesQuery, [doctorId, doctorId, doctorId]);

        conn.release();

        // Format the response
        const formattedPacientes = pacientes.map((p: any) => ({
            id_paciente: p.id_paciente,
            nombre_completo: p.nombre_completo,
            edad: p.edad,
            telefono: p.telefono,
            correo: p.correo,
            dui: p.dui,
            ultima_consulta: p.ultima_consulta,
            total_citas: Number(p.total_citas) || 0
        }));

        console.log('Patients found:', formattedPacientes.length);
        
        res.json({ 
            success: true, 
            pacientes: formattedPacientes
        });
    } catch (error: any) {
        console.error('Error fetching doctor patients:', error.message);
        res.status(500).json({ success: false, message: 'Error del servidor' });
    }
});

// GET /api/doctor/:id_usuario/reportes - Get report data for a specific doctor
router.get('/:id/reportes', async (req, res) => {
    const id = req.params.id;
    console.log('\n=== Fetch doctor reports request ===');
    console.log('id param:', id);

    try {
        const conn = await pool.getConnection();
        console.log('DB connection acquired');

        // Get doctor info first
        const doctorQuery = `SELECT d.id_doctor FROM Doctor d WHERE d.id_usuario = ? OR d.id_doctor = ?`;
        const doctorResults = await conn.query(doctorQuery, [id, id]);

        if (doctorResults.length === 0) {
            conn.release();
            console.log('No doctor found for id:', id);
            return res.status(404).json({ success: false, message: 'Doctor no encontrado' });
        }
        const doctorId = doctorResults[0].id_doctor.toString();

        // Citas por estado
        const citasPorEstadoQuery = `
            SELECT estado, COUNT(*) as total
            FROM Cita
            WHERE id_doctor = ?
            GROUP BY estado
        `;
        const citasPorEstado = await conn.query(citasPorEstadoQuery, [doctorId]);

        // Citas por mes (últimos 6 meses)
        const citasPorMesQuery = `
            SELECT 
                DATE_FORMAT(fecha, '%Y-%m') as mes,
                COUNT(*) as total
            FROM Cita
            WHERE id_doctor = ?
                AND fecha >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
            GROUP BY DATE_FORMAT(fecha, '%Y-%m')
            ORDER BY mes ASC
        `;
        const citasPorMes = await conn.query(citasPorMesQuery, [doctorId]);

        // Distribución por edad de pacientes
        const edadesPacientesQuery = `
            SELECT 
                CASE 
                    WHEN p.edad < 18 THEN 'Menores de 18'
                    WHEN p.edad BETWEEN 18 AND 35 THEN '18-35 años'
                    WHEN p.edad BETWEEN 36 AND 50 THEN '36-50 años'
                    WHEN p.edad BETWEEN 51 AND 65 THEN '51-65 años'
                    ELSE 'Mayores de 65'
                END as rango_edad,
                COUNT(DISTINCT p.id_paciente) as total
            FROM Paciente p
            INNER JOIN Cita c ON p.id_paciente = c.id_paciente
            WHERE c.id_doctor = ?
            GROUP BY rango_edad
            ORDER BY MIN(p.edad)
        `;
        const edadesPacientes = await conn.query(edadesPacientesQuery, [doctorId]);

        // Pacientes más frecuentes
        const pacientesFrecuentesQuery = `
            SELECT 
                p.nombre_completo,
                COUNT(*) as total_citas
            FROM Cita c
            JOIN Paciente p ON c.id_paciente = p.id_paciente
            WHERE c.id_doctor = ?
            GROUP BY p.id_paciente, p.nombre_completo
            ORDER BY total_citas DESC
            LIMIT 5
        `;
        const pacientesFrecuentes = await conn.query(pacientesFrecuentesQuery, [doctorId]);

        conn.release();

        // Format the response
        const reportData = {
            citas_por_estado: citasPorEstado.map((item: any) => ({
                estado: item.estado,
                total: Number(item.total)
            })),
            citas_por_mes: citasPorMes.map((item: any) => ({
                mes: item.mes,
                total: Number(item.total)
            })),
            edades_pacientes: edadesPacientes.map((item: any) => ({
                rango_edad: item.rango_edad,
                total: Number(item.total)
            })),
            pacientes_frecuentes: pacientesFrecuentes.map((item: any) => ({
                nombre_completo: item.nombre_completo,
                total_citas: Number(item.total_citas)
            }))
        };

        console.log('Report data generated');
        
        res.json({ 
            success: true, 
            reportes: reportData
        });
    } catch (error: any) {
        console.error('Error fetching doctor reports:', error.message);
        res.status(500).json({ success: false, message: 'Error del servidor' });
    }
});

export default router;
