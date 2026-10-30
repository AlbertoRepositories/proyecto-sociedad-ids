import { Blog } from './Blog';
import { Comment } from './Comment';

export interface Forum extends Blog {
  comments: Comment[];
  lastActivityDate: Date;
}
