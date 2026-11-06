CREATE TABLE public."User" (
    id UUID PRIMARY KEY,
    name VARCHAR NOT NULL,
    username VARCHAR NOT NULL UNIQUE,
    email VARCHAR NOT NULL UNIQUE,
    "externalAuthProvider" VARCHAR NOT NULL,
    "notificationsEnabled" BOOLEAN NOT NULL DEFAULT FALSE,
    type VARCHAR NOT NULL
);

CREATE TABLE public.administrators (
    user_id UUID PRIMARY KEY
        REFERENCES public."User"(id),
    administrator_title VARCHAR NOT NULL
);

CREATE TABLE public.access_logs (
    id UUID PRIMARY KEY,
    user_id UUID
        REFERENCES public."User"(id),
    action VARCHAR NOT NULL,
    ip_address VARCHAR,
    user_agent TEXT,
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public."Calendar" (
    id UUID PRIMARY KEY,
    "semesterStartDate" DATE NOT NULL,
    "semesterEndDate" DATE NOT NULL
);

CREATE TABLE public."Blog" (
    id UUID PRIMARY KEY,
    title VARCHAR NOT NULL,
    content TEXT NOT NULL,
    "creationDate" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expirationDate" DATE,
    "isVisible" BOOLEAN NOT NULL DEFAULT TRUE,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "likeCount" INTEGER NOT NULL DEFAULT 0,
    "publicationType" VARCHAR NOT NULL,
    "eventStartDate" TIMESTAMP NOT NULL,
    "eventEndDate" TIMESTAMP NOT NULL,
    location VARCHAR,
    "registrationUrl" VARCHAR,
    "imageUrls" TEXT[],
    calendar_id UUID
        REFERENCES public."Calendar"(id),
    administrator_id UUID
        REFERENCES public.administrators(user_id)
);

CREATE TABLE public."Forum" (
    blog_id UUID PRIMARY KEY
        REFERENCES public."Blog"(id),
    last_activity_date TIMESTAMP
);

CREATE TABLE public."Comment" (
    id UUID PRIMARY KEY,
    content TEXT NOT NULL,
    creationDate TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    likeCount INTEGER NOT NULL DEFAULT 0,
    isHiddenByAuthor BOOLEAN NOT NULL DEFAULT FALSE,
    author_id UUID
        REFERENCES public."User"(id),
    forum_id UUID
        REFERENCES public."Forum"(blog_id),
    parent_comment_id UUID
        REFERENCES public."Comment"(id)
);

CREATE TABLE public."Notification" (
    id UUID PRIMARY KEY,
    notificationTime TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    title VARCHAR NOT NULL,
    content TEXT NOT NULL,
    isRead BOOLEAN NOT NULL DEFAULT FALSE,
    recipient_id UUID
        REFERENCES public."User"(id),
    notification_type VARCHAR NOT NULL
);