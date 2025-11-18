import { Router } from 'express';
import { pool } from '../utils/db';

const router = Router();

router.post('/login', async (req, res) => {

    
    const { username, password, tipo_usuario } = req.body;
    
    // Validate required fields
    console.log('\nValidating request fields:');
    console.log('- username:', username ? 'provided' : 'missing');
    console.log('- password:', password ? 'provided' : 'missing');
    console.log('- tipo_usuario:', tipo_usuario ? `provided (${tipo_usuario})` : 'missing');

    if (!username || !password || !tipo_usuario) {
        console.log('❌ Validation failed: Missing required fields');
        return res.status(400).json({
            success: false,
            message: 'Todos los campos son requeridos'
        });
    }

    try {
        console.log('\nAttempting database connection...');
        const conn = await pool.getConnection();
        console.log('✓ Database connection established');

        console.log('\nExecuting query with parameters:');
        console.log('- username:', username);
        console.log('- tipo_usuario:', tipo_usuario);
        console.log('- password hash length:', password.length);
        
        // Check if user exists with given credentials
        const query = 'SELECT id_usuario, tipo_usuario FROM Usuario WHERE username = ? AND password_hash = ? AND tipo_usuario = ?';
        console.log('\nSQL Query:', query);
        
        const user = await conn.query(query, [username, password, tipo_usuario]);
        console.log('\nQuery results:', 
            user.length > 0 
                ? `Found user with ID: ${user[0].id_usuario}` 
                : 'No matching user found'
        );

        conn.release();
        console.log('✓ Database connection released');

        if (user.length > 0) {
            console.log('\n✅ Login successful');
            console.log('User details:', {
                id: user[0].id_usuario,
                tipo: user[0].tipo_usuario
            });
            
            res.json({
                success: true,
                user: {
                    id: user[0].id_usuario,
                    tipo: user[0].tipo_usuario
                }
            });
        } else {
            console.log('\n❌ Login failed: Invalid credentials');
            res.status(401).json({
                success: false,
                message: 'Usuario o contraseña incorrectos'
            });
        }
    } catch (error: any) {
        console.error('\n❌ Error during login:');
        console.error('Error details:', error);
        console.error('Stack trace:', error.stack);
        
        res.status(500).json({
            success: false,
            message: 'Error del servidor'
        });
    }
    console.log('\n=== End Login Attempt ===\n');
});

export default router;