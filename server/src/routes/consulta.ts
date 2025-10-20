import { Router } from 'express';
import { pool } from '../utils/db';

const router = Router();



// Add a new consultation (for doctors)
router.post('/citas/:citaId/consulta', async (req, res) => {
    const { citaId } = req.params;
    const { reporte_paciente } = req.body;
    
    // In a real app, you would get this from the authentication token
    const doctorId = req.headers['x-user-id'] as string;
    const userType = req.headers['x-user-type'] as string;

    if (userType !== 'Doctor') {
        return res.status(403).json({
            success: false,
            message: 'No autorizado: Se requiere ser médico para esta acción'
        });
    }

    if (!reporte_paciente || reporte_paciente.length < 10) {
        return res.status(400).json({
            success: false,
            message: 'El reporte del paciente es requerido y debe tener al menos 10 caracteres'
        });
    }

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // Verify the appointment exists and is assigned to this doctor
        const cita = await connection.query(
            'SELECT * FROM Cita WHERE id_cita = ? AND id_doctor = ?',
            [citaId, doctorId]
        );

        if (cita.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Cita no encontrada o no autorizada'
            });
        }

        // Check if a consultation already exists for this appointment
        const existingConsulta = await connection.query(
            'SELECT id_consulta FROM Consulta WHERE id_cita = ?',
            [citaId]
        );

        if (existingConsulta.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Ya existe una consulta para esta cita'
            });
        }

        // Generate new consultation ID
        const maxRes: any = await connection.query("SELECT MAX(CAST(SUBSTRING(id_consulta,3) AS UNSIGNED)) as maxId FROM Consulta");
        const maxId = (maxRes && maxRes[0] && maxRes[0].maxId) ? Number(maxRes[0].maxId) : 0;
        const nextNum = maxId + 1;
        const consultaId = 'CO' + String(nextNum).padStart(4, '0');
        
        await connection.query(
            'INSERT INTO Consulta (id_consulta, reporte_paciente, fecha_consulta, id_cita) VALUES (?, ?, CURDATE(), ?)',
            [consultaId, reporte_paciente, citaId]
        );

        // Update appointment status to 'Atendida'
        await connection.query(
            'UPDATE Cita SET estado = "Atendida" WHERE id_cita = ?',
            [citaId]
        );

        await connection.commit();

        res.status(201).json({
            success: true,
            message: 'Consulta registrada exitosamente',
            consultaId
        });
    } catch (error) {
        await connection.rollback();
        console.error('Error creating consultation:', error);
        res.status(500).json({
            success: false,
            message: 'Error al registrar la consulta'
        });
    } finally {
        connection.release();
    }
});

// Get consultations for a patient (for patients)
router.get('/paciente/consultas', async (req, res) => {
    // In a real app, you would get this from the authentication token
    const pacienteId = req.headers['x-user-id'] as string;
    const userType = req.headers['x-user-type'] as string;

    if (userType !== 'Paciente') {
        return res.status(403).json({
            success: false,
            message: 'No autorizado: Se requiere ser paciente para ver este historial'
        });
    }

    try {
        const [consultas] = await pool.query(
            `SELECT 
                c.id_consulta,
                c.reporte_paciente,
                c.fecha_consulta,
                ci.fecha as fecha_cita,
                ci.hora as hora_cita,
                d.nombre_completo as nombre_doctor,
                e.nombre as especialidad
            FROM Consulta c
            JOIN Cita ci ON c.id_cita = ci.id_cita
            JOIN Doctor d ON ci.id_doctor = d.id_doctor
            JOIN Especialidad e ON d.id_especialidad = e.id_especialidad
            WHERE ci.id_paciente = ?
            ORDER BY c.fecha_consulta DESC, ci.hora DESC`,
            [pacienteId]
        );

        res.json({
            success: true,
            data: consultas
        });
    } catch (error) {
        console.error('Error fetching consultations:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener las consultas'
        });
    }
});

// Get consultation details (for both patient and doctor)
router.get('/consultas/:consultaId', async (req, res) => {
    const { consultaId } = req.params;
    const userId = req.headers['x-user-id'] as string;
    const userType = req.headers['x-user-type'] as string;

    try {
        let query = `
            SELECT 
                c.id_consulta,
                c.reporte_paciente,
                c.fecha_consulta,
                ci.fecha as fecha_cita,
                ci.hora as hora_cita,
                d.nombre_completo as nombre_doctor,
                e.nombre as especialidad,
                p.nombre_completo as nombre_paciente,
                ci.id_paciente,
                ci.id_doctor
            FROM Consulta c
            JOIN Cita ci ON c.id_cita = ci.id_cita
            JOIN Doctor d ON ci.id_doctor = d.id_doctor
            JOIN Especialidad e ON d.id_especialidad = e.id_especialidad
            JOIN Paciente p ON ci.id_paciente = p.id_paciente
            WHERE c.id_consulta = ?
        `;

        const params = [consultaId];

        const [consultas] = await pool.query(query, params);

        if (consultas.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Consulta no encontrada'
            });
        }

        const consulta = consultas[0];

        // Check authorization
        if (userType === 'Paciente' && consulta.id_paciente !== userId) {
            return res.status(403).json({
                success: false,
                message: 'No autorizado: No tienes permiso para ver esta consulta'
            });
        }

        if (userType === 'Doctor' && consulta.id_doctor !== userId) {
            return res.status(403).json({
                success: false,
                message: 'No autorizado: No tienes permiso para ver esta consulta'
            });
        }

        // Remove sensitive data from response
        delete consulta.id_paciente;
        delete consulta.id_doctor;

        res.json({
            success: true,
            data: consulta
        });
    } catch (error) {
        console.error('Error fetching consultation:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener la consulta'
        });
    }
});

export default router;
