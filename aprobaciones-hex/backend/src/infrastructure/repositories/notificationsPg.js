import { pool } from '../db/pgPool.js'
export const notificationsRepo = {
  async listPending(userId){
    const r = await pool.query(`SELECT id, request_id, message, delivered, created_at, delivered_at
                                FROM notifications WHERE user_id=$1 AND delivered=false
                                ORDER BY created_at DESC`, [userId])
    return r.rows
  },
  async create({ userId, requestId, channel, message }){
    await pool.query(`INSERT INTO notifications (user_id, request_id, channel, message, delivered)
                      VALUES ($1,$2,$3,$4,false)`, [userId, requestId, channel, message])
  },
  async ack(id){
    await pool.query('UPDATE notifications SET delivered=true, delivered_at=NOW() WHERE id=$1', [id])
  }
}
