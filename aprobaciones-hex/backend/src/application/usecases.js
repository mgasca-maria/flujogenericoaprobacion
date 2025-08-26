import { v4 as uuidv4 } from 'uuid'

export function makeCreateRequest({ usersRepo, typesRepo, requestsRepo, notificationsRepo, emailService }){
  return async ({ title, description, requesterUsername, approverUsername, typeId }) => {
    if(!title || !description || !requesterUsername || !approverUsername || !typeId) throw new Error('missing_fields')
    const requester = await usersRepo.findByUsername(requesterUsername)
    const approver = await usersRepo.findByUsername(approverUsername)
    const type = await typesRepo.findById(typeId)
    if(!requester || !approver || !type) throw new Error('invalid_refs')

    const id = uuidv4()
    await requestsRepo.create({ id, title, description, requesterId: requester.id, approverId: approver.id, typeId })
    await requestsRepo.addHistory({ requestId: id, action: 'CREATED', userId: requester.id, comment: 'Solicitud creada' })
    await notificationsRepo.create({ userId: approver.id, requestId: id, channel: 'app', message: `Tienes una nueva solicitud pendiente: ${title}` })
    await emailService.send(approver.email, '[Aprobaciones] Nueva solicitud pendiente', 
      `Hola ${approver.display_name}\n\nTienes una nueva solicitud para revisar: "${title}".\n\nDescripción: ${description}\n\nID: ${id}`
    )
    return { id }
  }
}

export function makeListRequestsByApprover({ usersRepo, requestsRepo }){
  return async ({ approverUsername }) => {
    const u = await usersRepo.findByUsername(approverUsername)
    if(!u) throw new Error('user_not_found')
    return requestsRepo.listByApprover(u.id)
  }
}

export function makeListRequestsByRequester({ usersRepo, requestsRepo }){
  return async ({ requesterUsername }) => {
    const u = await usersRepo.findByUsername(requesterUsername)
    if(!u) throw new Error('user_not_found')
    return requestsRepo.listByRequester(u.id)
  }
}

export function makeGetRequestDetail({ requestsRepo }){
  return async ({ id }) => {
    return requestsRepo.getWithJoins(id)
  }
}

export function makeApproveOrReject({ usersRepo, requestsRepo, notificationsRepo }){
  return async ({ id, actorUsername, action, comment }) => {
    const u = await usersRepo.findByUsername(actorUsername)
    if(!u) throw new Error('user_not_found')
    const req = await requestsRepo.getRaw(id)
    if(!req) throw new Error('not_found')
    if(req.status !== 'PENDING') throw new Error('already_final')
    const next = action === 'APPROVED' ? 'APPROVED' : 'REJECTED'
    await requestsRepo.updateStatus(id, next)
    await requestsRepo.addHistory({ requestId: id, action, userId: u.id, comment })
    await notificationsRepo.create({ userId: req.requester_id, requestId: id, channel: 'app', message: `Tu solicitud ${req.title} fue ${next}` })
    return { ok: true }
  }
}

export function makeListNotifications({ usersRepo, notificationsRepo }){
  return async ({ username }) => {
    const u = await usersRepo.findByUsername(username)
    if(!u) throw new Error('user_not_found')
    return notificationsRepo.listPending(u.id)
  }
}

export function makeAckNotification({ notificationsRepo }){
  return async ({ id }) => {
    await notificationsRepo.ack(id)
    return { ok: true }
  }
}
