import { pool } from '../db/pgPool.js'

export const requestsRepo = {
  async create({ id, title, description, requesterId, approverId, typeId }){
    await pool.query('BEGIN')
    await pool.query(
      `INSERT INTO approval_requests (id, title, description, requester_id, approver_id, type_id, status)
       VALUES ($1,$2,$3,$4,$5,$6,'PENDING')`,
      [id, title, description, requesterId, approverId, typeId]
    )
    await pool.query('COMMIT')
  },
  async listByApprover(approverId){
    const q = `SELECT r.id, r.title, r.status, r.created_at, rt.name as type,
                      req.display_name as requester, app.display_name as approver
               FROM approval_requests r
               JOIN request_types rt ON rt.id=r.type_id
               JOIN app_users req ON req.id=r.requester_id
               JOIN app_users app ON app.id=r.approver_id
               WHERE r.approver_id=$1
               ORDER BY r.created_at DESC`
    const r = await pool.query(q, [approverId])
    return r.rows
  },
  async listByRequester(requesterId){
    const q = `SELECT r.id, r.title, r.status, r.created_at, rt.name as type,
                      req.display_name as requester, app.display_name as approver
               FROM approval_requests r
               JOIN request_types rt ON rt.id=r.type_id
               JOIN app_users req ON req.id=r.requester_id
               JOIN app_users app ON app.id=r.approver_id
               WHERE r.requester_id=$1
               ORDER BY r.created_at DESC`
    const r = await pool.query(q, [requesterId])
    return r.rows
  },
  async getWithJoins(id){
    const rq = await pool.query(`SELECT r.id, r.title, r.description, r.status, r.created_at, r.updated_at,
                                        rt.name as type,
                                        req.username as requester_username, req.display_name as requester,
                                        app.username as approver_username, app.display_name as approver
                                 FROM approval_requests r
                                 JOIN request_types rt ON rt.id=r.type_id
                                 JOIN app_users req ON req.id=r.requester_id
                                 JOIN app_users app ON app.id=r.approver_id
                                 WHERE r.id=$1`, [id])
    if(!rq.rows.length) return null
    const hist = await pool.query(`SELECT h.id, h.action, u.display_name as user, h.comment, h.event_at
                                   FROM request_history h
                                   JOIN app_users u ON u.id=h.user_id
                                   WHERE h.request_id=$1
                                   ORDER BY h.event_at ASC`, [id])
    return { request: rq.rows[0], history: hist.rows }
  },
  async getRaw(id){
    const r = await pool.query('SELECT * FROM approval_requests WHERE id=$1', [id])
    return r.rows[0] || null
  },
  async updateStatus(id, status){
    await pool.query('UPDATE approval_requests SET status=$1, updated_at=NOW() WHERE id=$2', [status, id])
  },
  async addHistory({ requestId, action, userId, comment }){
    await pool.query('INSERT INTO request_history (request_id, action, user_id, comment) VALUES ($1,$2,$3,$4)',
                     [requestId, action, userId, comment || null])
  }
}
