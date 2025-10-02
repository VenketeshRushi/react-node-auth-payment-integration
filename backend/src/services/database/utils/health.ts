import { pool } from '../connection.js';

export const checkDbConnection = async (): Promise<boolean> => {
  let client;
  try {
    client = await pool.connect();
    await client.query('SELECT 1'); // simple ping
    return true;
  } catch {
    return false;
  } finally {
    if (client) client.release();
  }
};
