BEGIN;

INSERT INTO public."User" (
    id,
    name,
    username,
    email,
    "externalAuthProvider",
    "notificationsEnabled",
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

INSERT INTO public.administrators (
    user_id,
    administrator_title
) VALUES (
    '00000000-0000-4000-8000-000000000001',
    'Administradora de la Sociedad IDS'
)
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO public.access_logs (
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

INSERT INTO public."Calendar" (
    id,
    "semesterStartDate",
    "semesterEndDate"
) VALUES (
    '00000000-0000-4000-8000-000000000201',
    '2026-08-01',
    '2026-12-20'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public."Blog" (
    id,
    title,
    content,
    "expirationDate",
    "isVisible",
    "viewCount",
    "likeCount",
    "publicationType",
    "eventStartDate",
    "eventEndDate",
    location,
    "registrationUrl",
    "imageUrls",
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

INSERT INTO public."Forum" (
    blog_id,
    last_activity_date
) VALUES (
    '00000000-0000-4000-8000-000000000301',
    '2026-11-05 12:00:00'
)
ON CONFLICT (blog_id) DO NOTHING;

INSERT INTO public."Comment" (
    id,
    content,
    "likeCount",
    "isHiddenByAuthor",
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

INSERT INTO public."Notification" (
    id,
    "notificationTime",
    title,
    content,
    "isRead",
    recipient_id,
    notification_type
) VALUES (
    '00000000-0000-4000-8000-000000000501',
    CURRENT_TIMESTAMP,
    'Nuevo taller disponible',
    'Se publicó un nuevo taller de desarrollo web.',
    FALSE,
    '00000000-0000-4000-8000-000000000002',
    'SYSTEM'
)
ON CONFLICT (id) DO NOTHING;

COMMIT;