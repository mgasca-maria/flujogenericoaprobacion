export class ApprovalRequest {
  constructor({ id, title, description, requesterId, approverId, typeId, status, createdAt, updatedAt }) {
    Object.assign(this, { id, title, description, requesterId, approverId, typeId, status, createdAt, updatedAt })
  }
}
export class RequestHistory {
  constructor({ id, requestId, action, userId, comment, eventAt }) {
    Object.assign(this, { id, requestId, action, userId, comment, eventAt })
  }
}
export class AppUser {
  constructor({ id, username, displayName, email }) {
    Object.assign(this, { id, username, displayName, email })
  }
}
export class RequestType { constructor({ id, name }) { Object.assign(this, { id, name }) } }
