BEGIN;

-- Users
INSERT INTO users (
    id,
    name,
    username,
    email,
    external_auth_provider,
    notifications_enabled,
    type
) VALUES
(
    '00000000-0000-4000-8000-000000000001',
    'Ana Administradora',
    'ana.admin',
    'ana.admin@example.com',
    'google',
    TRUE,
    'ADMINISTRATOR'
),
(
    '00000000-0000-4000-8000-000000000002',
    'Bruno Estudiante',
    'bruno.student',
    'bruno.student@example.com',
    'google',
    TRUE,
    'REGULAR_USER'
),
(
    '00000000-0000-4000-8000-000000000003',
    'Carla Estudiante',
    'carla.student',
    'carla.student@example.com',
    'github',
    FALSE,
    'REGULAR_USER'
)
ON CONFLICT (id) DO NOTHING;

-- Administrators
INSERT INTO administrators (
    user_id,
    administrator_title
) VALUES (
    '00000000-0000-4000-8000-000000000001',
    'Administradora de la Sociedad IDS'
)
ON CONFLICT (user_id) DO NOTHING;

-- Current whitelist table
INSERT INTO whitelist (
    id,
    email
) VALUES (
    '00000000-0000-4000-8000-000000000101',
    'ana.admin@example.com'
)
ON CONFLICT (id) DO NOTHING;

-- Calendar
INSERT INTO calendars (
    id,
    semester_start_date,
    semester_end_date
) VALUES (
    '00000000-0000-4000-8000-000000000201',
    '2026-08-01',
    '2026-12-20'
)
ON CONFLICT (id) DO NOTHING;

-- Blog/event publication
INSERT INTO blogs (
    id,
    title,
    content,
    expiration_date,
    is_visible,
    view_count,
    like_count,
    publication_type,
    event_start_date,
    event_end_date,
    location,
    registration_url,
    image_urls,
    calendar_id,
    administrator_id
) VALUES (
    '00000000-0000-4000-8000-000000000301',
    'Taller de desarrollo web',
    'Taller introductorio sobre desarrollo web para estudiantes de IDS.',
    '2026-12-20',
    TRUE,
    12,
    4,
    'EVENT',
    '2026-11-15 10:00:00',
    '2026-11-15 13:00:00',
    'Laboratorio de cómputo',
    'https://example.com/registro-taller',
    ARRAY[
        'https://example.com/taller-web-1.jpg'
    ]::TEXT[],
    '00000000-0000-4000-8000-000000000201',
    '00000000-0000-4000-8000-000000000001'
)
ON CONFLICT (id) DO NOTHING;

-- Forum based on the blog publication
INSERT INTO forums (
    blog_id,
    last_activity_date
) VALUES (
    '00000000-0000-4000-8000-000000000301',
    '2026-11-05 12:00:00'
)
ON CONFLICT (blog_id) DO NOTHING;

-- Comments
INSERT INTO comments (
    id,
    content,
    like_count,
    is_hidden_by_author,
    author_id,
    forum_id,
    parent_comment_id
) VALUES
(
    '00000000-0000-4000-8000-000000000401',
    '¿El taller requiere experiencia previa?',
    2,
    FALSE,
    '00000000-0000-4000-8000-000000000002',
    '00000000-0000-4000-8000-000000000301',
    NULL
),
(
    '00000000-0000-4000-8000-000000000402',
    'No, está dirigido a estudiantes de cualquier semestre.',
    1,
    FALSE,
    '00000000-0000-4000-8000-000000000001',
    '00000000-0000-4000-8000-000000000301',
    '00000000-0000-4000-8000-000000000401'
)
ON CONFLICT (id) DO NOTHING;

-- Notifications
INSERT INTO notifications (
    id,
    title,
    content,
    is_read,
    recipient_id,
    notification_type
) VALUES (
    '00000000-0000-4000-8000-000000000501',
    'Nuevo taller disponible',
    'Se publicó un nuevo taller de desarrollo web.',
    FALSE,
    '00000000-0000-4000-8000-000000000002',
    'SYSTEM'
)
ON CONFLICT (id) DO NOTHING;

-- Access logs
INSERT INTO access_logs (
    id,
    user_id,
    action,
    ip_address,
    user_agent
) VALUES (
    '00000000-0000-4000-8000-000000000601',
    '00000000-0000-4000-8000-000000000001',
    'LOGIN',
    '127.0.0.1',
    'PostmanRuntime'
)
ON CONFLICT (id) DO NOTHING;

-- Existing events table shown in Supabase.
-- This is temporary test data until the team decides whether
-- events will remain separate from blogs.
INSERT INTO events (
    id,
    title,
    description,
    start_at,
    end_at,
    location,
    registration_url,
    image_urls,
    is_visible,
    expires_at
) VALUES (
    '00000000-0000-4000-8000-000000000701',
    'Evento temporal de prueba',
    'Registro temporal para probar la tabla events desde Postman.',
    '2026-11-20 09:00:00',
    '2026-11-20 12:00:00',
    'Auditorio IDS',
    'https://example.com/registro-evento',
    ARRAY[
        'https://example.com/evento-prueba.jpg'
    ]::TEXT[],
    TRUE,
    '2026-12-20 23:59:59'
)
ON CONFLICT (id) DO NOTHING;

COMMIT;