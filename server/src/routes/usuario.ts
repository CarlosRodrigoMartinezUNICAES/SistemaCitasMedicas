import { Router } from 'express';
import { pool } from '../utils/db';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// Helper function to generate IDs
const generateId = (prefix: string): string => {
    return `${prefix}${uuidv4().substring(0, 8)}`;
};

// Register a new patient
router.post('/register/paciente', async (req, res) => {
    const { username, password, nombre_completo, telefono, correo, edad, dui } = req.body;

    // Validate required fields
    if (!username || !password || !nombre_completo || !telefono || !correo || !edad || !dui) {
        return res.status(400).json({
            success: false,
            message: 'Todos los campos son requeridos'
        });
    }

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // Check if username already exists
        const [existingUser] = await connection.query(
            'SELECT id_usuario FROM Usuario WHERE username = ?',
            [username]
        );

        if (existingUser.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'El nombre de usuario ya está en uso'
            });
        }

        // In a real app, you should hash the password with bcrypt
        const passwordHash = password; // await bcrypt.hash(password, 10);
        const userId = generateId('P');
        
        // Create user
        await connection.query(
            'INSERT INTO Usuario (id_usuario, username, password_hash, tipo_usuario) VALUES (?, ?, ?, "Paciente")',
            [userId, username, passwordHash]
        );

        // Create patient
        await connection.query(
            'INSERT INTO Paciente (id_paciente, id_usuario, nombre_completo, telefono, correo, edad, dui) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [userId, userId, nombre_completo, telefono, correo, edad, dui]
        );

        await connection.commit();

        res.status(201).json({
            success: true,
            message: 'Paciente registrado exitosamente',
            userId
        });
    } catch (error) {
        await connection.rollback();
        console.error('Error registering patient:', error);
        res.status(500).json({
            success: false,
            message: 'Error al registrar el paciente'
        });
    } finally {
        connection.release();
    }
});

// Register a new doctor (no approval needed in this version)
router.post('/register/doctor', async (req, res) => {
    const { username, password, nombre_completo, codigo_trabajador, telefono, id_especialidad } = req.body;

    // Validate required fields
    if (!username || !password || !nombre_completo || !codigo_trabajador || !id_especialidad) {
        return res.status(400).json({
            success: false,
            message: 'Todos los campos son requeridos'
        });
    }

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // Check if username already exists
        const [existingUser] = await connection.query(
            'SELECT id_usuario FROM Usuario WHERE username = ?',
            [username]
        );

        if (existingUser.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'El nombre de usuario ya está en uso'
            });
        }

        // Check if worker code is already in use
        const [existingDoctor] = await connection.query(
            'SELECT id_doctor FROM Doctor WHERE codigo_trabajador = ?',
            [codigo_trabajador]
        );

        if (existingDoctor.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'El código de trabajador ya está en uso'
            });
        }

        // In a real app, you should hash the password with bcrypt
        const passwordHash = password; // await bcrypt.hash(password, 10);
        const userId = generateId('D');
        
        // Create user
        await connection.query(
            'INSERT INTO Usuario (id_usuario, username, password_hash, tipo_usuario) VALUES (?, ?, ?, "Doctor")',
            [userId, username, passwordHash]
        );

        // Create doctor
        await connection.query(
            'INSERT INTO Doctor (id_doctor, id_usuario, nombre_completo, codigo_trabajador, telefono, id_especialidad) VALUES (?, ?, ?, ?, ?, ?)',
            [userId, userId, nombre_completo, codigo_trabajador, telefono || null, id_especialidad]
        );

        // Update user status to active
        await connection.query(
            'UPDATE Usuario SET estado = "Activo" WHERE id_usuario = ?',
            [userId]
        );

        // Remove from pending registrations
        await connection.query(
            'DELETE FROM RegistroPendiente WHERE id_registro = ?',
            [registroId]
        );

        await connection.commit();

        res.json({
            success: true,
            message: 'Médico aprobado exitosamente',
            doctorId: userId
        });
    } catch (error) {
        await connection.rollback();
        console.error('Error approving doctor:', error);
        res.status(500).json({
            success: false,
            message: 'Error al aprobar el médico'
        });
    } finally {
        connection.release();
    }
});

export default router;
