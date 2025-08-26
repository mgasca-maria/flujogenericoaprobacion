import React, { useEffect, useState } from 'react'
import { getUsers, getTypes, createRequest } from '../lib/api'

export default function CreateRequest({ currentUser, onCreated }){
  const [users, setUsers] = useState([])
  const [types, setTypes] = useState([])
  const [form, setForm] = useState({ title:'', description:'', requester: currentUser, approver:'', typeId:'' })
  const [msg, setMsg] = useState('')

  useEffect(()=>{ getUsers().then(setUsers); getTypes().then(setTypes) }, [])

  function handleChange(e){ const {name, value} = e.target; setForm(p=>({...p,[name]:value})) }

  async function submit(e){
    e.preventDefault()
    setMsg('')
    const res = await createRequest({ 
      title: form.title, description: form.description, requester: form.requester,
      approver: form.approver, typeId: Number(form.typeId)
    })
    if(res.id){ setMsg('Creada con ID ' + res.id); onCreated && onCreated(res.id) }
    else setMsg('Error: ' + (res.error || 'desconocido'))
  }

  return (
    <div className="card p-6">
      <h2 className="text-xl font-semibold mb-4">Nueva solicitud</h2>
      <form onSubmit={submit} className="grid md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <input className="input" name="title" placeholder="Título" value={form.title} onChange={handleChange} required />
        </div>
        <div className="md:col-span-2">
          <textarea className="textarea" name="description" placeholder="Descripción" value={form.description} onChange={handleChange} required />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Solicitante</label>
          <select className="select" name="requester" value={form.requester} onChange={handleChange}>
            {users.map(u=> <option key={u.username} value={u.username}>{u.display_name} ({u.username})</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Responsable (aprobador)</label>
          <select className="select" name="approver" value={form.approver} onChange={handleChange} required>
            <option value="">-- Selecciona --</option>
            {users.map(u=> <option key={u.username} value={u.username}>{u.display_name} ({u.username})</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Tipo</label>
          <select className="select" name="typeId" value={form.typeId} onChange={handleChange} required>
            <option value="">-- Selecciona --</option>
            {types.map(t=> <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </div>
        <div className="md:col-span-2 flex items-center gap-3">
          <button className="btn btn-primary" type="submit">Crear</button>
          {msg && <div className="text-sm text-gray-600">{msg}</div>}
        </div>
      </form>
    </div>
  )
}
