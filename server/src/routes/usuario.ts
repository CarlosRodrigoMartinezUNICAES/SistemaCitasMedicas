import { Router } from 'express';
import { pool } from '../utils/db';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// Helper function to generate IDs
const generateId = (prefix: string): string => {
    // Generate a random 8-digit number and ensure it starts with P followed by numbers
    const randomNumber = Math.floor(10000000 + Math.random() * 90000000);
    return `${prefix}${randomNumber}`.substring(0, 9); // Ensures P followed by 8 digits
};

// Register a new patient
router.post('/register/paciente', async (req, res) => {
    const { username, password, nombre_completo, telefono, correo, edad, dui } = req.body;

    // Validate required fields (application-level validation remains)
    if (!username || !password || !nombre_completo || !telefono || !correo || !edad || !dui) {
        return res.status(400).json({
            success: false,
            message: 'Todos los campos son requeridos'
        });
    }

    // More specific validations (application-level validation remains)
    if (password.length < 8) {
        return res.status(400).json({ success: false, message: 'La contraseña debe tener al menos 8 caracteres' });
    }
    if (!/^\d{8}-\d$/.test(dui)) {
        return res.status(400).json({ success: false, message: 'El formato del DUI no es válido' });
    }
    if (!/^\d+$/.test(telefono)) {
        return res.status(400).json({ success: false, message: 'El teléfono solo debe contener números' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
        return res.status(400).json({ success: false, message: 'El formato del correo electrónico no es válido' });
    }
    if (!Number.isInteger(edad) || edad <= 0) {
        return res.status(400).json({ success: false, message: 'La edad debe ser un número entero positivo' });
    }
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(nombre_completo)) {
        return res.status(400).json({ success: false, message: 'El nombre completo solo debe contener letras y espacios' });
    }

    const connection = await pool.getConnection();
    try {
        // In a real app, you should hash the password with bcrypt
        const passwordHash = password; // await bcrypt.hash(password, 10);

        // Call the stored procedure
        await connection.query(
            'CALL RegistrarPaciente(?, ?, ?, ?, ?, ?, ?, @p_id_paciente_generado, @p_mensaje)',
            [username, passwordHash, nombre_completo, telefono, correo, edad, dui]
        );

        const rawResult = await connection.query(
            'SELECT @p_id_paciente_generado AS p_id_paciente_generado, @p_mensaje AS p_mensaje'
        );
        console.log('Raw result from SELECTing output vars:', rawResult);
        const { p_id_paciente_generado: generatedId, p_mensaje: message } = rawResult[0];

        if (message.startsWith('Error:')) {
            return res.status(400).json({
                success: false,
                message: message
            });
        }

        res.status(201).json({
            success: true,
            message: message,
            userId: generatedId
        });
    } catch (error) {
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
    const { username, password, nombre_completo, telefono, id_especialidad } = req.body;

    // Validate required fields
    if (!username || !password || !nombre_completo || !id_especialidad) {
        return res.status(400).json({
            success: false,
            message: 'Todos los campos son requeridos'
        });
    }

    // More specific validations
    if (password.length < 8) {
        return res.status(400).json({ success: false, message: 'La contraseña debe tener al menos 8 caracteres' });
    }
    if (telefono && !/^\d+$/.test(telefono)) {
        return res.status(400).json({ success: false, message: 'El teléfono solo debe contener números' });
    }
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(nombre_completo)) {
        return res.status(400).json({ success: false, message: 'El nombre completo solo debe contener letras y espacios' });
    }

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // Check if username already exists
        const existingUsers = await connection.query(
            'SELECT id_usuario FROM Usuario WHERE username = ?',
            [username]
        );

        if (Array.isArray(existingUsers) && existingUsers.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'El nombre de usuario ya está en uso'
            });
        }

        // Generate sequential id_doctor
        const maxIdResult = await connection.query("SELECT MAX(id_usuario) as maxId FROM Usuario WHERE id_usuario LIKE 'D%'");
        let nextIdNumber = 1;
        if (maxIdResult && maxIdResult.length > 0 && maxIdResult[0].maxId) {
            const lastId = maxIdResult[0].maxId;
            const lastIdNumber = parseInt(lastId.substring(1), 10);
            nextIdNumber = lastIdNumber + 1;
        }
        const newDoctorId = `D${nextIdNumber.toString().padStart(4, '0')}`;

        // Generate sequential codigo_trabajador
        const maxCodeResult = await connection.query('SELECT MAX(codigo_trabajador) as maxCode FROM Doctor');
        let nextCodeNumber = 1;
        if (maxCodeResult && maxCodeResult.length > 0 && maxCodeResult[0].maxCode) {
            const lastCode = maxCodeResult[0].maxCode;
            const lastCodeNumber = parseInt(lastCode.substring(3), 10);
            nextCodeNumber = lastCodeNumber + 1;
        }
        const newCodigoTrabajador = `DOC${nextCodeNumber.toString().padStart(3, '0')}`;

        // In a real app, you should hash the password with bcrypt
        const passwordHash = password; // await bcrypt.hash(password, 10);
        const userId = newDoctorId;
        
        // Create user
        await connection.query(
            'INSERT INTO Usuario (id_usuario, username, password_hash, tipo_usuario) VALUES (?, ?, ?, "Doctor")',
            [userId, username, passwordHash]
        );

        // Create doctor
        await connection.query(
            'INSERT INTO Doctor (id_doctor, id_usuario, nombre_completo, codigo_trabajador, telefono, id_especialidad) VALUES (?, ?, ?, ?, ?, ?)',
            [newDoctorId, userId, nombre_completo, newCodigoTrabajador, telefono || null, id_especialidad]
        );

        await connection.commit();

        res.json({
            success: true,
            message: 'Médico registrado exitosamente',
            doctorId: userId
        });
    } catch (error) {
        await connection.rollback();
        console.error('Error registering doctor:', error);
        res.status(500).json({
            success: false,
            message: 'Error al registrar el médico'
        });
    } finally {
        connection.release();
    }
});

export default router;
