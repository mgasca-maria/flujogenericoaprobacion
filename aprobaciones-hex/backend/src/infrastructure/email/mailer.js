import nodemailer from 'nodemailer'
import { env } from '../../config/env.js'

let transporter = null
if (env.SMTP_HOST && env.SMTP_PORT && env.SMTP_USER && env.SMTP_PASS) {
  transporter = nodemailer.createTransport({
    host: env.SMTP_HOST, port: env.SMTP_PORT, secure: false,
    auth: { user: env.SMTP_USER, pass: env.SMTP_PASS }
  })
}

export const emailService = {
  async send(to, subject, text){
    if(!transporter) return { ok:false, reason:'smtp_not_configured' }
    try{
      const info = await transporter.sendMail({ from: env.SMTP_FROM, to, subject, text })
      return { ok:true, id: info.messageId }
    }catch(err){
      return { ok:false, reason: err.message }
    }
  }
}
