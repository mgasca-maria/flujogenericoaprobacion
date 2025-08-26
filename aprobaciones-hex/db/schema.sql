CREATE TABLE IF NOT EXISTS app_users (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  email TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS request_types (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS approval_requests (
  id UUID PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  requester_id INTEGER NOT NULL REFERENCES app_users(id),
  approver_id INTEGER NOT NULL REFERENCES app_users(id),
  type_id INTEGER NOT NULL REFERENCES request_types(id),
  status TEXT NOT NULL CHECK (status IN ('PENDING','APPROVED','REJECTED')),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS request_history (
  id BIGSERIAL PRIMARY KEY,
  request_id UUID NOT NULL REFERENCES approval_requests(id) ON DELETE CASCADE,
  action TEXT NOT NULL CHECK (action IN ('CREATED','APPROVED','REJECTED')),
  user_id INTEGER NOT NULL REFERENCES app_users(id),
  comment TEXT,
  event_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS notifications (
  id BIGSERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES app_users(id),
  request_id UUID NOT NULL REFERENCES approval_requests(id) ON DELETE CASCADE,
  channel TEXT NOT NULL DEFAULT 'app',
  message TEXT NOT NULL,
  delivered BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  delivered_at TIMESTAMP
);
