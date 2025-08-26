import React, { useState } from 'react'
import Inbox from '../widgets/Inbox'
import CreateRequest from '../widgets/CreateRequest'
import MyRequests from '../widgets/MyRequests'
import RequestDetail from '../widgets/RequestDetail'

export default function App(){
  const [view, setView] = useState('inbox')
  const [currentUser, setCurrentUser] = useState('ana') // simulación
  const [selectedId, setSelectedId] = useState(null)

  return (
    <div>
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 grid place-items-center">
              <span className="text-primary font-bold">FA</span>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Flujo de Aprobaciones</h1>
              <p className="text-xs text-gray-500">Demo SPA profesional</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <select className="select" value={currentUser} onChange={e=>setCurrentUser(e.target.value)}>
              <option value="ana">ana (aprobador)</option>
              <option value="juan">juan</option>
              <option value="rafa">rafa</option>
            </select>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 grid gap-6">
        <nav className="flex items-center gap-3">
          <button className={"btn " + (view==='inbox'?'btn-primary':'btn-ghost')} onClick={()=>setView('inbox')}>Bandeja del aprobador</button>
          <button className={"btn " + (view==='create'?'btn-primary':'btn-ghost')} onClick={()=>setView('create')}>Crear solicitud</button>
          <button className={"btn " + (view==='mine'?'btn-primary':'btn-ghost')} onClick={()=>setView('mine')}>Mis solicitudes</button>
        </nav>

        {view==='inbox' && <Inbox currentUser={currentUser} onOpen={id=>{setSelectedId(id); setView('detail')}} />}
        {view==='create' && <CreateRequest currentUser={currentUser} onCreated={id=>{setSelectedId(id); setView('detail')}} />}
        {view==='mine' && <MyRequests currentUser={currentUser} onOpen={id=>{setSelectedId(id); setView('detail')}} />}
        {view==='detail' && <RequestDetail id={selectedId} currentUser={currentUser} onBack={()=>setView('inbox')} />}
      </main>
    </div>
  )
}
