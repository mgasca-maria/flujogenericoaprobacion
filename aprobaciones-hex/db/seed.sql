INSERT INTO app_users (username, display_name, email) VALUES
  ('juan', 'Juan Patiño', 'juan@example.com')
ON CONFLICT (username) DO NOTHING;

INSERT INTO app_users (username, display_name, email) VALUES
  ('ana', 'Ana Gómez', 'ana@example.com'),
  ('rafa', 'Rafael López', 'rafa@example.com')
ON CONFLICT (username) DO NOTHING;

INSERT INTO request_types (name) VALUES
  ('Despliegue'), ('Acceso'), ('Cambio técnico')
ON CONFLICT (name) DO NOTHING;

WITH reqr AS (SELECT id requester_id FROM app_users WHERE username='juan'),
aprv AS (SELECT id approver_id FROM app_users WHERE username='ana'),
typ AS (SELECT id type_id FROM request_types WHERE name='Despliegue')
INSERT INTO approval_requests (id, title, description, requester_id, approver_id, type_id, status)
SELECT '00000000-0000-0000-0000-000000000001',
       'Publicar release v1.2.3',
       'Aprobación para desplegar la versión v1.2.3 del microservicio de pagos.',
       reqr.requester_id, aprv.approver_id, typ.type_id, 'PENDING'
FROM reqr, aprv, typ
ON CONFLICT (id) DO NOTHING;

INSERT INTO request_history (request_id, action, user_id, comment)
SELECT '00000000-0000-0000-0000-000000000001', 'CREATED', u.id, 'Seed inicial'
FROM app_users u WHERE username='juan';

INSERT INTO notifications (user_id, request_id, channel, message, delivered)
SELECT u.id, '00000000-0000-0000-0000-000000000001', 'app',
       'Tienes una nueva solicitud pendiente: Publicar release v1.2.3', FALSE
FROM app_users u WHERE username='ana';
