import { createPool } from 'mariadb';
import dotenv from 'dotenv';

console.log('\n=== Loading Database Configuration ===');
dotenv.config();

// Log database configuration (excluding sensitive data)
console.log('Database Configuration:');
console.log('- Host:', process.env.DB_HOST || 'not set');
console.log('- User:', process.env.DB_USER || 'not set');
console.log('- Database:', process.env.DB_NAME || 'not set');
console.log('- Connection Limit:', 5);

export const pool = createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectionLimit: 5,
    debug: true // Enable detailed connection debugging
});

// Add event listeners to the pool
pool.on('acquire', function (connection) {
    console.log('Connection %d acquired', connection.threadId);
});

pool.on('connection', function (connection) {
    console.log('New connection established. ThreadId:', connection.threadId);
});

pool.on('enqueue', function () {
    console.log('Waiting for available connection slot');
});

pool.on('release', function (connection) {
    console.log('Connection %d released', connection.threadId);
});

export const connectDB = async () => {
    console.log('\n=== Testing Database Connection ===');
    try {
        const connection = await pool.getConnection();
        console.log('✅ Successfully connected to MariaDB');
        console.log('Connection info:', {
            threadId: connection.threadId,
            serverVersion: connection.serverVersion()
        });

        // Test query to verify permissions
        const testResult = await connection.query('SELECT 1 as testQuery');
        console.log('✓ Test query successful:', testResult);

        connection.release();
        console.log('✓ Test connection released');
    } catch (error: any) {
        console.error('\n❌ Database Connection Error');
        console.error('Error details:', error.message);
        console.error('Error code:', error.code);
        console.error('Stack trace:', error.stack);
        
        if (error.errno === 1045) {
            console.error('Authentication failed - Check username and password');
        } else if (error.errno === 1049) {
            console.error('Database does not exist - Check database name');
        } else if (error.errno === -111 || error.errno === 'ECONNREFUSED') {
            console.error('Cannot reach database server - Check host and port');
        }
        
        process.exit(1);
    }
};