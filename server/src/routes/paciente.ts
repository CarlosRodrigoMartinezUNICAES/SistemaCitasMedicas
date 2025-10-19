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

        // Get consultas for this paciente
        const consultasQuery = `
            SELECT co.id_consulta, co.reporte_paciente, co.fecha_consulta,
                   c.id_cita, d.nombre_completo AS doctor_nombre, e.nombre AS especialidad
            FROM Consulta co
            JOIN Cita c ON co.id_cita = c.id_cita
            JOIN Doctor d ON c.id_doctor = d.id_doctor
            JOIN Especialidad e ON d.id_especialidad = e.id_especialidad
            WHERE c.id_paciente = ?
            ORDER BY co.fecha_consulta DESC`;
        const consultas = await conn.query(consultasQuery, [paciente.id_paciente]);

        conn.release();

        console.log('Paciente found:', paciente);
        console.log('Citas found:', citas.length);
        console.log('Consultas found:', consultas.length);
        res.json({ success: true, paciente, citas, consultas });
    } catch (error: any) {
        console.error('Error fetching paciente:', error.message);
        res.status(500).json({ success: false, message: 'Error del servidor' });
    }
});

// PUT /api/paciente/:id - Update patient data
router.put('/:id', async (req, res) => {
    const id = req.params.id;
    const { nombre_completo, telefono, correo, edad, dui } = req.body;
    
    console.log('\n=== Update paciente request ===');
    console.log('id param:', id);
    console.log('update data:', { nombre_completo, telefono, correo, edad, dui });

    // Validate required fields
    if (!nombre_completo || !telefono || !correo || !edad || !dui) {
        console.log('❌ Validation failed: Missing required fields');
        return res.status(400).json({ 
            success: false, 
            message: 'Todos los campos son requeridos' 
        });
    }

    // Validate data format according to DB constraints
    const duiRegex = /^[0-9]{8}-[0-9]$/;
    const telefonoRegex = /^[267][0-9]{7}$/;
    const emailRegex = /^[^@]+@[^@]+\.[^@]+$/;
    const nombreRegex = /^[A-Za-zÁÉÍÓÚÑáéíóúñ ]+$/;

    if (!duiRegex.test(dui)) {
        return res.status(400).json({ 
            success: false, 
            message: 'Formato de DUI inválido (debe ser: 12345678-9)' 
        });
    }

    if (!telefonoRegex.test(telefono)) {
        return res.status(400).json({ 
            success: false, 
            message: 'Formato de teléfono inválido (debe empezar con 2, 6 o 7 y tener 8 dígitos)' 
        });
    }

    if (!emailRegex.test(correo)) {
        return res.status(400).json({ 
            success: false, 
            message: 'Formato de correo electrónico inválido' 
        });
    }

    if (!nombreRegex.test(nombre_completo)) {
        return res.status(400).json({ 
            success: false, 
            message: 'El nombre solo puede contener letras y espacios' 
        });
    }

    if (edad < 0 || edad > 120) {
        return res.status(400).json({ 
            success: false, 
            message: 'La edad debe estar entre 0 y 120 años' 
        });
    }

    let conn: any;
    try {
        conn = await pool.getConnection();
        console.log('✓ DB connection acquired');

        // Check if paciente exists
        const pacienteExists = await conn.query(
            'SELECT id_paciente FROM Paciente WHERE id_usuario = ? OR id_paciente = ?',
            [id, id]
        );

        if (pacienteExists.length === 0) {
            conn.release();
            console.log('❌ Paciente not found for id:', id);
            return res.status(404).json({ 
                success: false, 
                message: 'Paciente no encontrado' 
            });
        }

        const pacienteId = pacienteExists[0].id_paciente;

        // Check for duplicate DUI (excluding current patient)
        const duiCheck = await conn.query(
            'SELECT id_paciente FROM Paciente WHERE dui = ? AND id_paciente != ?',
            [dui, pacienteId]
        );

        if (duiCheck.length > 0) {
            conn.release();
            console.log('❌ DUI already exists');
            return res.status(400).json({ 
                success: false, 
                message: 'El DUI ya está registrado por otro paciente' 
            });
        }

        // Check for duplicate email (excluding current patient)
        const emailCheck = await conn.query(
            'SELECT id_paciente FROM Paciente WHERE correo = ? AND id_paciente != ?',
            [correo, pacienteId]
        );

        if (emailCheck.length > 0) {
            conn.release();
            console.log('❌ Email already exists');
            return res.status(400).json({ 
                success: false, 
                message: 'El correo electrónico ya está registrado por otro paciente' 
            });
        }

        // Update paciente data
        const updateQuery = `
            UPDATE Paciente 
            SET nombre_completo = ?, telefono = ?, correo = ?, edad = ?, dui = ?
            WHERE id_paciente = ?
        `;

        await conn.query(updateQuery, [
            nombre_completo, 
            telefono, 
            correo, 
            edad, 
            dui, 
            pacienteId
        ]);

        conn.release();
        console.log('✅ Paciente updated successfully:', pacienteId);

        res.json({ 
            success: true, 
            message: 'Información actualizada correctamente',
            paciente: {
                id_paciente: pacienteId,
                nombre_completo,
                telefono,
                correo,
                edad,
                dui
            }
        });

    } catch (error: any) {
        console.error('❌ Error updating paciente:', error);
        if (conn) conn.release();
        res.status(500).json({ 
            success: false, 
            message: 'Error del servidor al actualizar la información' 
        });
    }
});

export default router;
