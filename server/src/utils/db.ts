import { createPool } from 'mariadb';
import dotenv from 'dotenv';

dotenv.config();

export const pool = createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectionLimit: 5
});

export const connectDB = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('Successfully connected to MariaDB');
        connection.release();
    } catch (err) {
        console.error('Error connecting to MariaDB:', err);
        process.exit(1);
    }
};