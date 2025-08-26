import express from 'express'
import cors from 'cors'
import { env } from './config/env.js'
import { buildRouter } from './infrastructure/http/routes.js'

import { usersRepo } from './infrastructure/repositories/usersPg.js'
import { typesRepo } from './infrastructure/repositories/typesPg.js'
import { requestsRepo } from './infrastructure/repositories/requestsPg.js'
import { notificationsRepo } from './infrastructure/repositories/notificationsPg.js'
import { emailService as _emailService } from './infrastructure/email/mailer.js'

import { makeCreateRequest, makeListRequestsByApprover, makeListRequestsByRequester,
         makeGetRequestDetail, makeApproveOrReject, makeListNotifications, makeAckNotification } from './application/usecases.js'

const app = express()
app.use(cors())
app.use(express.json())

const uc = {
  usersRepo, typesRepo, requestsRepo, notificationsRepo,
  createRequest: makeCreateRequest({ usersRepo, typesRepo, requestsRepo, notificationsRepo, emailService: _emailService }),
  listByApprover: makeListRequestsByApprover({ usersRepo, requestsRepo }),
  listByRequester: makeListRequestsByRequester({ usersRepo, requestsRepo }),
  getDetail: makeGetRequestDetail({ requestsRepo }),
  approveOrReject: makeApproveOrReject({ usersRepo, requestsRepo, notificationsRepo }),
  listNotifications: makeListNotifications({ usersRepo, notificationsRepo }),
  ackNotification: makeAckNotification({ notificationsRepo }),
}

app.use('/api', buildRouter(uc))

app.listen(env.PORT, () => console.log(`Backend listening on ${env.PORT}`))
