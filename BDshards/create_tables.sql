-- Base tables
CREATE TABLE users (
    id UUID PRIMARY KEY, -- UUID v7
    name VARCHAR(255) NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    external_auth_provider VARCHAR(100),
    notifications_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    type VARCHAR(50) NOT NULL -- Corresponds to UserType
);

CREATE TABLE administrators (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    administrator_title VARCHAR(255) NOT NULL
);

-- AuthManager Tables
CREATE TABLE whitelist (
    id UUID PRIMARY KEY, -- UUID v7
    email VARCHAR(255) UNIQUE NOT NULL,
    added_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE access_logs (
    id UUID PRIMARY KEY, -- UUID v7
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(50) NOT NULL, -- e.g., 'LOGIN', 'LOGOUT', 'DENIED'
    ip_address VARCHAR(45),
    user_agent TEXT,
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Calendar Tables
CREATE TABLE calendars (
    id UUID PRIMARY KEY, -- UUID v7
    semester_start_date DATE NOT NULL,
    semester_end_date DATE NOT NULL
);

-- Blog Tables
CREATE TABLE blogs (
    id UUID PRIMARY KEY, -- UUID v7
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    creation_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expiration_date DATE,
    is_visible BOOLEAN NOT NULL DEFAULT TRUE,
    view_count INTEGER NOT NULL DEFAULT 0,
    like_count INTEGER NOT NULL DEFAULT 0,
    publication_type VARCHAR(100) NOT NULL,
    event_start_date TIMESTAMP NOT NULL,
    event_end_date TIMESTAMP NOT NULL,
    location VARCHAR(255),
    registration_url VARCHAR(255),
    image_urls TEXT[],
    calendar_id UUID REFERENCES calendars(id) ON DELETE SET NULL,
    administrator_id UUID REFERENCES administrators(user_id) ON DELETE SET NULL
);

-- Forum Tables
CREATE TABLE forums (
    blog_id UUID PRIMARY KEY REFERENCES blogs(id) ON DELETE CASCADE,
    last_activity_date TIMESTAMP
);

-- Comment Tables
CREATE TABLE comments (
    id UUID PRIMARY KEY, -- UUID v7
    content TEXT NOT NULL,
    creation_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    like_count INTEGER NOT NULL DEFAULT 0,
    is_hidden_by_author BOOLEAN NOT NULL DEFAULT FALSE,
    author_id UUID REFERENCES users(id) ON DELETE SET NULL,
    forum_id UUID REFERENCES forums(blog_id) ON DELETE CASCADE,
    parent_comment_id UUID REFERENCES comments(id) ON DELETE CASCADE
);

-- Notification Tables
CREATE TABLE notifications (
    id UUID PRIMARY KEY, -- UUID v7
    notification_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    recipient_id UUID REFERENCES users(id) ON DELETE CASCADE,
    notification_type VARCHAR(50) NOT NULL
);
