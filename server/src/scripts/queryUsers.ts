import { pool } from '../utils/db';

const queryUsers = async () => {
  try {
    const conn = await pool.getConnection();
    const users = await conn.query('SELECT * FROM Usuario');
    conn.release();
    console.log('Available users:', users);
  } catch (err) {
    console.error('Error querying users:', err);
  }
};

queryUsers();