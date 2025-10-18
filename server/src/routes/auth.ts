import { Router } from 'express';
import { pool } from '../utils/db';

const router = Router();

router.post('/login', async (req, res) => {
    const { username, password, tipo_usuario } = req.body;

    try {
        const conn = await pool.getConnection();
        
        // Check if user exists with given credentials
        const user = await conn.query(
            'SELECT id_usuario, tipo_usuario FROM Usuario WHERE username = ? AND password_hash = ? AND tipo_usuario = ?',
            [username, password, tipo_usuario]
        );

        conn.release();

        if (user.length > 0) {
            // User found
            res.json({
                success: true,
                user: {
                    id: user[0].id_usuario,
                    tipo: user[0].tipo_usuario
                }
            });
        } else {
            // No user found with those credentials
            res.status(401).json({
                success: false,
                message: 'Usuario o contraseña incorrectos'
            });
        }
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).json({
            success: false,
            message: 'Error del servidor'
        });
    }
});

export default router;