export class UsersRepo { list(){throw 0} findByUsername(){throw 0} }
export class TypesRepo { list(){throw 0} findById(){throw 0} }
export class RequestsRepo {
  create(){throw 0} listByApprover(){throw 0} listByRequester(){throw 0}
  getWithJoins(){throw 0} getRaw(){throw 0} updateStatus(){throw 0} addHistory(){throw 0}
}
export class NotificationsRepo { listPending(){throw 0} create(){throw 0} ack(){throw 0} }
export class EmailService { send(){throw 0} }
