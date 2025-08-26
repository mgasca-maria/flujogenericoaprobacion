const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'
export async function getUsers(){ return (await fetch(`${API_URL}/api/users`)).json() }
export async function getTypes(){ return (await fetch(`${API_URL}/api/types`)).json() }
export async function createRequest(data){ return (await fetch(`${API_URL}/api/requests`, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(data)})).json() }
export async function listRequestsByApprover(username){ return (await fetch(`${API_URL}/api/requests?approver=${encodeURIComponent(username)}`)).json() }
export async function listRequestsByRequester(username){ return (await fetch(`${API_URL}/api/requests?requester=${encodeURIComponent(username)}`)).json() }
export async function getRequest(id){ return (await fetch(`${API_URL}/api/requests/${id}`)).json() }
export async function approveRequest(id, user, comment){ return (await fetch(`${API_URL}/api/requests/${id}/approve`, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({user, comment})})).json() }
export async function rejectRequest(id, user, comment){ return (await fetch(`${API_URL}/api/requests/${id}/reject`, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({user, comment})})).json() }
export async function fetchNotifications(user){ return (await fetch(`${API_URL}/api/notifications?user=${encodeURIComponent(user)}`)).json() }
export async function ackNotification(id){ return (await fetch(`${API_URL}/api/notifications/${id}/ack`, {method:'POST'})).json() }
