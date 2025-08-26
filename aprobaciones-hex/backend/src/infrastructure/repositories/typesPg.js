import { pool } from '../db/pgPool.js'
export const typesRepo = {
  async list(){ const r = await pool.query('SELECT id, name FROM request_types ORDER BY name'); return r.rows },
  async findById(id){ const r = await pool.query('SELECT * FROM request_types WHERE id=$1', [id]); return r.rows[0] || null }
}
