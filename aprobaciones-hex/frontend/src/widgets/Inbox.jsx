import React, { useEffect, useState } from 'react'
import { fetchNotifications, ackNotification, listRequestsByApprover } from '../lib/api'

function StatusBadge({ status }){
  if(status==='APPROVED') return <span className="badge-green">Aprobado</span>
  if(status==='REJECTED') return <span className="badge-red">Rechazado</span>
  return <span className="badge-yellow">Pendiente</span>
}

export default function Inbox({ currentUser, onOpen }){
  const [notifs, setNotifs] = useState([])
  const [requests, setRequests] = useState([])

  async function load(){
    const [n, r] = await Promise.all([fetchNotifications(currentUser), listRequestsByApprover(currentUser)])
    setNotifs(n); setRequests(r)
  }
  useEffect(()=>{ load() }, [currentUser])

  return (
    <div className="grid gap-6">
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Notificaciones</h2>
          <button className="btn btn-ghost" onClick={load}>Actualizar</button>
        </div>
        <ul className="grid gap-3">
          {notifs.map(n => (
            <li key={n.id} className="flex items-center justify-between bg-gray-50 rounded-xl p-3">
              <div>
                <div className="font-medium">{n.message}</div>
                <div className="text-xs text-gray-500">{new Date(n.created_at).toLocaleString()}</div>
              </div>
              <div className="flex items-center gap-2">
                <button className="btn btn-ghost" onClick={()=>ackNotification(n.id).then(load)}>Marcar leída</button>
                <button className="btn btn-primary" onClick={()=>onOpen(n.request_id)}>Abrir</button>
              </div>
            </li>
          ))}
          {notifs.length===0 && <li className="text-gray-500">No hay notificaciones pendientes.</li>}
        </ul>
      </div>

      <div className="card p-6">
        <h2 className="text-xl font-semibold mb-4">Solicitudes a aprobar</h2>
        <div className="overflow-auto">
          <table className="table">
            <thead><tr><th>Título</th><th>Tipo</th><th>Estado</th><th>Fecha</th><th></th></tr></thead>
            <tbody>
              {requests.map(r => (
                <tr key={r.id}>
                  <td className="font-medium">{r.title}</td>
                  <td>{r.type}</td>
                  <td><StatusBadge status={r.status} /></td>
                  <td>{new Date(r.created_at).toLocaleString()}</td>
                  <td><button className="btn btn-primary" onClick={()=>onOpen(r.id)}>Abrir</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
