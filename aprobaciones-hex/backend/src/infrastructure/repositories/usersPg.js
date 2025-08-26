import { pool } from '../db/pgPool.js'
export const usersRepo = {
  async list(){ const r = await pool.query('SELECT id, username, display_name, email FROM app_users ORDER BY display_name'); return r.rows },
  async findByUsername(username){ const r = await pool.query('SELECT * FROM app_users WHERE username=$1', [username]); return r.rows[0] || null }
}
