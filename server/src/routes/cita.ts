import { Router } from 'express';
import { pool } from '../utils/db';

const router = Router();

// Create a new cita
router.post('/', async (req, res) => {
    console.log('\n=== Create Cita Request ===');
    console.log('Time:', new Date().toISOString());
    console.log('Body:', req.body);

    const { id_paciente, fecha, hora, especialidad } = req.body;

    if (!id_paciente || !fecha || !hora || !especialidad) {
        console.log('❌ Validation failed: missing fields');
        return res.status(400).json({ success: false, message: 'Faltan campos requeridos' });
    }

    let conn: any;
    try {
        conn = await pool.getConnection();
        console.log('✓ DB connection acquired');

        // Find a doctor for the requested especialidad
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

        const id_doctor = doctorRows[0].id_doctor;
        console.log('Found doctor:', id_doctor);

        // Generate next id_cita using numeric part
        const maxRes: any = await conn.query("SELECT MAX(CAST(SUBSTRING(id_cita,2) AS UNSIGNED)) as maxId FROM Cita");
        const maxId = (maxRes && maxRes[0] && maxRes[0].maxId) ? Number(maxRes[0].maxId) : 0;
        const nextNum = maxId + 1;
        const id_cita = 'C' + String(nextNum).padStart(4, '0');

        const estado = 'Pendiente';

        console.log('Inserting cita', { id_cita, fecha, hora, estado, id_paciente, id_doctor });

        await conn.query(
            'INSERT INTO Cita (id_cita, fecha, hora, estado, id_paciente, id_doctor) VALUES (?,?,?,?,?,?)',
            [id_cita, fecha, hora, estado, id_paciente, id_doctor]
        );

        conn.release();
        console.log('✅ Cita created:', id_cita);

        res.json({ success: true, cita: { id_cita, fecha, hora, estado, id_paciente, id_doctor } });
    } catch (error: any) {
        console.error('❌ Error creating cita:', error);
        if (conn) conn.release();
        res.status(500).json({ success: false, message: 'Error del servidor al crear la cita' });
    }
});

export default router;
