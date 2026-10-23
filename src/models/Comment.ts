import { User } from './User';

export interface Comment {
  id: string;
  content: string;
  creationDate: Date;
  likeCount: number;
  isHiddenByAuthor: boolean;
  author: User;
  replies: Comment[];
}