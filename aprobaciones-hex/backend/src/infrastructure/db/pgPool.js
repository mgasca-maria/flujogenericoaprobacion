import pkg from 'pg'
import { env } from '../../config/env.js'
const { Pool } = pkg
export const pool = new Pool({
  host: env.DB_HOST, port: env.DB_PORT, user: env.DB_USER, password: env.DB_PASS, database: env.DB_NAME
})
