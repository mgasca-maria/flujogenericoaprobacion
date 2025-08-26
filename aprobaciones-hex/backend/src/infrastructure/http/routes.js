import express from 'express'

export function buildRouter(uc){
  const router = express.Router()

  router.get('/health', (req,res)=> res.json({ ok:true, ts: new Date().toISOString() }))

  router.get('/users', async (req,res)=> res.json(await uc.usersRepo.list()))
  router.get('/types', async (req,res)=> res.json(await uc.typesRepo.list()))

  router.post('/requests', async (req,res)=>{
    const { title, description, requester, approver, typeId } = req.body
    try{
      const result = await uc.createRequest({ title, description, requesterUsername: requester, approverUsername: approver, typeId })
      res.status(201).json(result)
    }catch(err){
      const m = err.message
      if (m==='missing_fields') return res.status(400).json({ error:'Missing fields' })
      if (m==='invalid_refs') return res.status(400).json({ error:'Invalid requester/approver/typeId' })
      console.error(err); return res.status(500).json({ error:'internal_error' })
    }
  })

  router.get('/requests', async (req,res)=>{
    const { approver, requester } = req.query
    try{
      if(approver) return res.json(await uc.listByApprover({ approverUsername: approver }))
      if(requester) return res.json(await uc.listByRequester({ requesterUsername: requester }))
      res.json([])
    }catch(err){
      const m = err.message
      if (m==='user_not_found') return res.status(400).json({ error:'user_not_found' })
      console.error(err); return res.status(500).json({ error:'internal_error' })
    }
  })

  router.get('/requests/:id', async (req,res)=>{
    const data = await uc.getDetail({ id: req.params.id })
    if(!data) return res.status(404).json({ error:'not_found' })
    res.json(data)
  })

  router.post('/requests/:id/approve', async (req,res)=>{
    const { user, comment } = req.body
    try{
      const detail = await uc.getDetail({ id: req.params.id })
      if(!detail) return res.status(404).json({ error:'not_found' })
      if (detail.request.approver_username !== user) return res.status(403).json({ error:'forbidden_user_not_approver' })
      await uc.approveOrReject({ id: req.params.id, actorUsername: user, action:'APPROVED', comment })
      res.json({ ok:true })
    }catch(err){
      const m = err.message
      if (m==='user_not_found') return res.status(400).json({ error:'user_not_found' })
      if (m==='not_found') return res.status(404).json({ error:'not_found' })
      if (m==='already_final') return res.status(409).json({ error:'already_final' })
      console.error(err); return res.status(500).json({ error:'internal_error' })
    }
  })

  router.post('/requests/:id/reject', async (req,res)=>{
    const { user, comment } = req.body
    try{
      const detail = await uc.getDetail({ id: req.params.id })
      if(!detail) return res.status(404).json({ error:'not_found' })
      if (detail.request.approver_username !== user) return res.status(403).json({ error:'forbidden_user_not_approver' })
      await uc.approveOrReject({ id: req.params.id, actorUsername: user, action:'REJECTED', comment })
      res.json({ ok:true })
    }catch(err){
      const m = err.message
      if (m==='user_not_found') return res.status(400).json({ error:'user_not_found' })
      if (m==='not_found') return res.status(404).json({ error:'not_found' })
      if (m==='already_final') return res.status(409).json({ error:'already_final' })
      console.error(err); return res.status(500).json({ error:'internal_error' })
    }
  })

  router.get('/notifications', async (req,res)=>{
    const { user } = req.query
    if(!user) return res.status(400).json({ error:'user query param required' })
    try{
      const list = await uc.listNotifications({ username: user })
      res.json(list)
    }catch(err){
      const m = err.message
      if (m==='user_not_found') return res.status(404).json({ error:'user not found' })
      console.error(err); return res.status(500).json({ error:'internal_error' })
    }
  })

  router.post('/notifications/:id/ack', async (req,res)=>{
    await uc.ackNotification({ id: req.params.id })
    res.json({ ok:true })
  })

  return router
}
