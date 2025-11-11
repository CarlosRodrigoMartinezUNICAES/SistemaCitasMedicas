import { Router } from 'express';
import { pool } from '../utils/db';

const router = Router();

// Create a new cita
router.post('/', async (req, res) => {
    console.log('\n=== Create Cita Request ===');
    console.log('Time:', new Date().toISOString());
    console.log('Body:', req.body);

    const { id_paciente, fecha, hora, especialidad, id_doctor } = req.body;

    if (!id_paciente || !fecha || !hora || !especialidad) {
        console.log('❌ Validation failed: missing fields');
        return res.status(400).json({ success: false, message: 'Faltan campos requeridos' });
    }

    let conn: any;
    try {
        conn = await pool.getConnection();
        console.log('✓ DB connection acquired');

        let selected_doctor_id = id_doctor;

        // If no doctor was specifically selected, find one for the requested especialidad
        if (!selected_doctor_id) {
            const doctorRows: any = await conn.query(
                `SELECT d.id_doctor FROM Doctor d
                 JOIN Especialidad e ON d.id_especialidad = e.id_especialidad
                 WHERE e.nombre = ? LIMIT 1`,
                [especialidad]
            );

            if (!doctorRows || doctorRows.length === 0) {
                console.log('❌ No doctor found for especialidad', especialidad);
                conn.release();
                return res.status(400).json({ success: false, message: 'No se encontró un doctor para la especialidad indicada' });
            }

            selected_doctor_id = doctorRows[0].id_doctor;
            console.log('Auto-selected doctor:', selected_doctor_id);
        } else {
            // Validate that the selected doctor exists and has the correct specialty
            const doctorValidation: any = await conn.query(
                `SELECT d.id_doctor FROM Doctor d
                 JOIN Especialidad e ON d.id_especialidad = e.id_especialidad
                 WHERE d.id_doctor = ? AND e.nombre = ?`,
                [selected_doctor_id, especialidad]
            );

            if (!doctorValidation || doctorValidation.length === 0) {
                console.log('❌ Selected doctor does not match specialty', { id_doctor: selected_doctor_id, especialidad });
                conn.release();
                return res.status(400).json({ success: false, message: 'El doctor seleccionado no se especializa en la especialidad indicada' });
            }

            console.log('Validated doctor:', selected_doctor_id);
        }

        // Check for existing appointment at the same time or within the 1-hour window for this doctor
        // If appointment is at 9:00, block 9:00-10:00 (the whole hour)
        // Two appointments overlap if: new_start < existing_end AND new_end > existing_start
        // We consider each appointment to last 1 hour
        const conflictCheck: any = await conn.query(
            `SELECT id_cita, hora FROM Cita 
             WHERE id_doctor = ? AND fecha = ?
             AND TIME(?) < ADDTIME(hora, '01:00:00')  -- new appointment start < existing appointment end
             AND ADDTIME(TIME(?), '01:00:00') > hora  -- new appointment end > existing appointment start`,
            [selected_doctor_id, fecha, hora, hora]
        );

        if (conflictCheck.length > 0) {
            console.log('❌ Conflict: Doctor already has an appointment at this date and time', { 
                id_doctor: selected_doctor_id, 
                fecha, 
                hora 
            });
            conn.release();
            return res.status(409).json({ 
                success: false, 
                message: 'El doctor ya tiene una cita agendada en esta fecha y hora' 
            });
        }

        // Generate next id_cita using numeric part
        const maxRes: any = await conn.query("SELECT MAX(CAST(SUBSTRING(id_cita,2) AS UNSIGNED)) as maxId FROM Cita");
        const maxId = (maxRes && maxRes[0] && maxRes[0].maxId) ? Number(maxRes[0].maxId) : 0;
        const nextNum = maxId + 1;
        const id_cita = 'C' + String(nextNum).padStart(4, '0');

        const estado = 'Pendiente';

        console.log('Inserting cita', { id_cita, fecha, hora, estado, id_paciente, id_doctor: selected_doctor_id });

        await conn.query(
            'INSERT INTO Cita (id_cita, fecha, hora, estado, id_paciente, id_doctor) VALUES (?,?,?,?,?,?)',
            [id_cita, fecha, hora, estado, id_paciente, selected_doctor_id]
        );

        conn.release();
        console.log('✅ Cita created:', id_cita);

        res.json({ success: true, cita: { id_cita, fecha, hora, estado, id_paciente, id_doctor: selected_doctor_id } });
    } catch (error: any) {
        console.error('❌ Error creating cita:', error);
        if (conn) conn.release();
        res.status(500).json({ success: false, message: 'Error del servidor al crear la cita' });
    }
});

// UPDATE appointment status
router.put('/:id/estado', async (req, res) => {
    console.log('\n=== Update Appointment Status ===');
    const id_cita = req.params.id;
    const { estado } = req.body;

    if (!estado) {
        return res.status(400).json({ success: false, message: 'Estado es requerido' });
    }

    const validEstados = ['Pendiente', 'Confirmada', 'Cancelada', 'Atendida'];
    if (!validEstados.includes(estado)) {
        return res.status(400).json({ 
            success: false, 
            message: 'Estado inválido. Debe ser: Pendiente, Confirmada, Cancelada o Atendida' 
        });
    }

    let conn: any;
    try {
        conn = await pool.getConnection();
        
        // Check if appointment exists
        const existingCita = await conn.query('SELECT * FROM Cita WHERE id_cita = ?', [id_cita]);
        if (existingCita.length === 0) {
            conn.release();
            return res.status(404).json({ success: false, message: 'Cita no encontrada' });
        }

        // Update status
        await conn.query('UPDATE Cita SET estado = ? WHERE id_cita = ?', [estado, id_cita]);
        
        conn.release();
        console.log('✅ Appointment status updated:', id_cita, '→', estado);

        res.json({ success: true, message: 'Estado actualizado correctamente', estado });
    } catch (error: any) {
        console.error('❌ Error updating appointment status:', error);
        if (conn) conn.release();
        res.status(500).json({ success: false, message: 'Error del servidor' });
    }
});

// GET all especialidades
router.get('/especialidades/list', async (req, res) => {
    console.log('\n=== Fetch Especialidades ===');
    
    let conn: any;
    try {
        conn = await pool.getConnection();
        const [especialidades]: any = await conn.query('SELECT id_especialidad, nombre, descripcion FROM Especialidad ORDER BY nombre');
        conn.release();
        
        console.log('✅ Especialidades found:', especialidades.length);
        res.json({ success: true, especialidades });
    } catch (error: any) {
        console.error('❌ Error fetching especialidades:', error);
        if (conn) conn.release();
        res.status(500).json({ success: false, message: 'Error del servidor' });
    }
});

// Check for conflicting appointments
router.get('/check-conflict', async (req, res) => {
    console.log('\n=== Check Appointment Conflict ===');
    console.log('Query params:', req.query);
    
    const { fecha, hora, id_doctor } = req.query;
    
    if (!fecha || !hora || !id_doctor) {
        return res.status(400).json({ 
            success: false, 
            message: 'Fecha, hora e id_doctor son requeridos' 
        });
    }
    
    let conn: any;
    try {
        conn = await pool.getConnection();
        
        // Check for existing appointment at the same time or within the 1-hour window for this doctor
        // Two appointments overlap if: new_start < existing_end AND new_end > existing_start
        // Each appointment is considered to last 1 hour
        const conflictCheck: any = await conn.query(
            `SELECT id_cita, hora FROM Cita 
             WHERE id_doctor = ? AND fecha = ?
             AND TIME(?) < ADDTIME(hora, '01:00:00')  -- new appointment start < existing appointment end
             AND ADDTIME(TIME(?), '01:00:00') > hora  -- new appointment end > existing appointment start`,
            [id_doctor, fecha, hora, hora]
        );
        
        conn.release();
        
        const hasConflict = conflictCheck.length > 0;
        
        console.log('Conflict check result:', { 
            id_doctor, 
            fecha, 
            hora, 
            hasConflict 
        });
        
        res.json({ 
            success: true, 
            hasConflict,
            message: hasConflict 
                ? 'El doctor ya tiene una cita agendada en esta fecha y hora' 
                : 'No hay conflictos para esta fecha y hora'
        });
    } catch (error: any) {
        console.error('❌ Error checking appointment conflict:', error);
        if (conn) conn.release();
        res.status(500).json({ success: false, message: 'Error del servidor al verificar conflictos' });
    }
});

// Get available time slots for a doctor on a specific date
router.get('/disponibilidad/:id_doctor/:fecha', async (req, res) => {
    console.log('\n=== Fetch Doctor Availability ===');
    console.log('Params:', req.params);
    
    const { id_doctor, fecha } = req.params;
    
    if (!id_doctor || !fecha) {
        return res.status(400).json({ 
            success: false, 
            message: 'id_doctor y fecha son requeridos' 
        });
    }
    
    let conn: any;
    try {
        conn = await pool.getConnection();
        
        // Get all reserved appointments for this doctor on the specific date
        // Calculate the busy time slots (appointment time + 1 hour) directly in SQL
        const reservedSlots: any = await conn.query(
            `SELECT hora AS start_time, ADDTIME(hora, '01:00:00') AS end_time FROM Cita 
             WHERE id_doctor = ? AND fecha = ?
             ORDER BY hora`,
            [id_doctor, fecha]
        );
        
        conn.release();
        
        // Format the time ranges
        const busySlots = reservedSlots.map((slot: any) => {
            return {
                start: slot.start_time,
                end: slot.end_time
            };
        });
        
        console.log(`Reserved slots for doctor ${id_doctor} on ${fecha}:`, busySlots);
        
        res.json({ 
            success: true, 
            busySlots,
            message: `Horarios ocupados para el doctor ${id_doctor} en la fecha ${fecha}`
        });
    } catch (error: any) {
        console.error('❌ Error fetching doctor availability:', error);
        if (conn) conn.release();
        res.status(500).json({ success: false, message: 'Error del servidor al obtener disponibilidad' });
    }
});

export default router;
