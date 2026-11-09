import { ContentType, UserType } from "./enums";

export interface UserInput {
  id?: string;
  name: string;
  username: string;
  email: string;
  externalAuthProvider: string;
  type: UserType;
  notificationsEnabled?: boolean;
}

export interface UserUpdateInput {
  username?: string;
  notificationsEnabled?: boolean;
}

export interface BlogInput {
  id?: string;
  title: string;
  content: string;
  creationDate?: string;
  expirationDate?: string | null;
  isVisible?: boolean;
  publicationType: ContentType;
  eventStartDate: string;
  eventEndDate: string;
  location?: string | null;
  registrationUrl?: string | null;
  imageUrls?: string[];
  calendarId?: string | null;
  administratorId?: string | null;
}

export interface BlogCreateInput {
  id: string;
  title: string;
  content: string;
  creationDate: string;
  expirationDate: string | null;
  isVisible: boolean;
  viewCount: number;
  likeCount: number;
  publicationType: ContentType;
  eventStartDate: string;
  eventEndDate: string;
  location: string | null;
  registrationUrl: string | null;
  imageUrls: string[];
  calendarId: string | null;
  administratorId: string | null;
}

export type BlogUpdateInput = Partial<
  Omit<
    BlogCreateInput,
    "id" | "viewCount" | "likeCount"
  >
>;

export interface CalendarInput {
  id?: string;
  semesterStartDate: string;
  semesterEndDate: string;
}

export interface CommentInput {
  id?: string;
  content: string;
  authorId: string;
  forumId: string;
  parentCommentId?: string | null;
}

export interface CommentUpdateInput {
  content?: string;
  isHiddenByAuthor?: boolean;
}

export interface ForumInput {
  blogId: string;
  lastActivityDate?: string | null;
}

export interface NotificationInput {
  id?: string;
  title: string;
  content: string;
  recipientId: string;
  notificationType: string;
  isRead?: boolean;
}