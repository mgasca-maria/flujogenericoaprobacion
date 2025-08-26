import React, { useEffect, useState } from 'react'
import { listRequestsByRequester } from '../lib/api'

function StatusBadge({ status }){
  if(status==='APPROVED') return <span className="badge-green">Aprobado</span>
  if(status==='REJECTED') return <span className="badge-red">Rechazado</span>
  return <span className="badge-yellow">Pendiente</span>
}

export default function MyRequests({ currentUser, onOpen }){
  const [requests, setRequests] = useState([])
  useEffect(()=>{ listRequestsByRequester(currentUser).then(setRequests) }, [currentUser])

  return (
    <div className="card p-6">
      <h2 className="text-xl font-semibold mb-4">Mis solicitudes</h2>
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
  )
}
