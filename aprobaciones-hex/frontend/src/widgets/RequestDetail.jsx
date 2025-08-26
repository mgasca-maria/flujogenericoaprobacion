import React, { useEffect, useState } from 'react'
import { getRequest, approveRequest, rejectRequest } from '../lib/api'

function StatusBadge({ status }){
  if(status==='APPROVED') return <span className="badge-green">Aprobado</span>
  if(status==='REJECTED') return <span className="badge-red">Rechazado</span>
  return <span className="badge-yellow">Pendiente</span>
}

export default function RequestDetail({ id, currentUser, onBack }){
  const [data, setData] = useState(null)
  const [comment, setComment] = useState('')

  async function load(){ setData(await getRequest(id)) }
  useEffect(()=>{ if(id) load() }, [id])

  if(!data) return <div className="card p-6">Cargando...</div>
  const { request, history } = data

  async function approve(){ const r = await approveRequest(id, currentUser, comment); if(r.ok){ load() } else alert(JSON.stringify(r)) }
  async function reject(){ const r = await rejectRequest(id, currentUser, comment); if(r.ok){ load() } else alert(JSON.stringify(r)) }

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <button className="btn btn-ghost" onClick={onBack}>← Volver</button>
      </div>

      <div className="card p-6 grid gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">{request.title}</h2>
          <StatusBadge status={request.status} />
        </div>
        <div className="text-sm text-gray-600">Tipo: <span className="font-medium text-gray-800">{request.type}</span></div>
        <div className="text-sm text-gray-600">Solicitante: <span className="font-medium text-gray-800">{request.requester}</span></div>
        <div className="text-sm text-gray-600">Aprobador: <span className="font-medium text-gray-800">{request.approver}</span></div>
        <p className="text-gray-800 leading-relaxed">{request.description}</p>
      </div>

      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-3">Histórico</h3>
        <ul className="grid gap-2">
          {history.map(h => (
            <li key={h.id} className="flex items-center justify-between bg-gray-50 rounded-xl p-3">
              <div>
                <div className="font-medium">{h.action} — {h.user}</div>
                <div className="text-xs text-gray-500">{new Date(h.event_at).toLocaleString()}</div>
              </div>
              {h.comment ? <em className="text-sm text-gray-600">{h.comment}</em> : null}
            </li>
          ))}
        </ul>
      </div>

      {request.status==='PENDING' && (
        <div className="card p-6 grid gap-3">
          <textarea className="textarea" placeholder="Comentario (opcional)" value={comment} onChange={e=>setComment(e.target.value)} />
          <div className="flex items-center gap-3">
            <button className="btn btn-primary" onClick={approve}>Aprobar</button>
            <button className="btn btn-ghost" onClick={reject}>Rechazar</button>
          </div>
        </div>
      )}
    </div>
  )
}
