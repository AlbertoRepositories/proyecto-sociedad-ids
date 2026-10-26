CREATE TABLE users (
    id UUID PRIMARY KEY, -- Se espera un UUID v7
    name VARCHAR(255) NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    external_auth_provider VARCHAR(100),
    notifications_enabled BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE administrators (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    administrator_title VARCHAR(255) NOT NULL
);

CREATE TABLE calendars (
    id UUID PRIMARY KEY,
    semester_start_date DATE NOT NULL,
    semester_end_date DATE NOT NULL
);

CREATE TABLE blogs (
    id UUID PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    creation_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expiration_date DATE,
    is_visible BOOLEAN NOT NULL DEFAULT TRUE,
    view_count INTEGER NOT NULL DEFAULT 0,
    like_count INTEGER NOT NULL DEFAULT 0,
    publication_type VARCHAR(100) NOT NULL,
    image_urls TEXT[], 
    calendar_id UUID REFERENCES calendars(id) ON DELETE SET NULL,
    administrator_id UUID REFERENCES administrators(user_id) ON DELETE SET NULL
);

CREATE TABLE forums (
    blog_id UUID PRIMARY KEY REFERENCES blogs(id) ON DELETE CASCADE,
    last_activity_date TIMESTAMP
);

CREATE TABLE comments (
    id UUID PRIMARY KEY,
    content TEXT NOT NULL,
    creation_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    like_count INTEGER NOT NULL DEFAULT 0,
    is_hidden_by_author BOOLEAN NOT NULL DEFAULT FALSE,
    author_id UUID REFERENCES users(id) ON DELETE SET NULL,
    forum_id UUID REFERENCES forums(blog_id) ON DELETE CASCADE,
    parent_comment_id UUID REFERENCES comments(id) ON DELETE CASCADE -- Para las respuestas (replies)
);

CREATE TABLE notifications (
    id UUID PRIMARY KEY,
    notification_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    recipient_id UUID REFERENCES users(id) ON DELETE CASCADE,
    notification_type VARCHAR(50) NOT NULL
);