CREATE TABLE public."User" (
    id UUID PRIMARY KEY, -- UUID v7
    name VARCHAR(64) NOT NULL,
    username VARCHAR(64) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    "externalAuthProvider" VARCHAR(100) NOT NULL,
    "notificationsEnabled" BOOLEAN NOT NULL DEFAULT FALSE,
    type VARCHAR(50) NOT NULL -- Corresponds to UserType
);

CREATE TABLE public."Administrator" (
    "userId" UUID PRIMARY KEY 
        REFERENCES public."User"(id) ON DELETE CASCADE,
    "administratorTitle" VARCHAR(255) NOT NULL
);

CREATE TABLE public."AccessLog" (
    id UUID PRIMARY KEY, -- UUID v7
    "userId" UUID REFERENCES public."User"(id) ON DELETE SET NULL,
    action VARCHAR(50) NOT NULL, -- e.g., 'LOGIN, LOGOUT, DENIED'
    "ipAddress" VARCHAR(45),
    "userAgent" TEXT,
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public."Calendar" (
    id UUID PRIMARY KEY, --UUID v7
    "semesterStartDate" DATE NOT NULL,
    "semesterEndDate" DATE NOT NULL
);

CREATE TABLE public."Blog" (
    id UUID PRIMARY KEY, -- UUID v7
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    "creationDate" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expirationDate" DATE,
    "isVisible" BOOLEAN NOT NULL DEFAULT TRUE,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "likeCount" INTEGER NOT NULL DEFAULT 0,
    "publicationType" VARCHAR(100) NOT NULL,
    "eventStartDate" TIMESTAMP NOT NULL,
    "eventEndDate" TIMESTAMP NOT NULL,
    location VARCHAR(255),
    "registrationUrl" VARCHAR (255),
    "imageUrls" TEXT[],
    "calendarId" UUID REFERENCES public."Calendar"(id) ON DELETE SET NULL,
    "administratorId" UUID REFERENCES public."Administrator"("userId") ON DELETE SET NULL
);

CREATE TABLE public."Forum" (
    "blogId" UUID PRIMARY KEY REFERENCES public."Blog"(id) ON DELETE CASCADE,
    "lastActivityDate" TIMESTAMP
);

CREATE TABLE public."Comment" (
    id UUID PRIMARY KEY, -- UUID v7
    content TEXT NOT NULL,
    "creationDate" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "likeCount" INTEGER NOT NULL DEFAULT 0,
    "isHiddenByAuthor" BOOLEAN NOT NULL DEFAULT FALSE,
    "authorId" UUID REFERENCES public."User"(id) ON DELETE SET NULL,
    "forumId" UUID REFERENCES public."Forum"("blogId") ON DELETE CASCADE,
    "parentCommentId" UUID REFERENCES public."Comment"(id) ON DELETE CASCADE
);

CREATE TABLE public."Notification" (
    id UUID PRIMARY KEY, -- UUID v7
    "notificationTime" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT FALSE,
    "recipientId" UUID REFERENCES public."User"(id) ON DELETE CASCADE,
    "notificationType" VARCHAR(50) NOT NULL
);