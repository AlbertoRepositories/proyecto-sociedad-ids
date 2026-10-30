import { Forum } from '../models/Forum';
import { Comment } from '../models/Comment';

export class ForumService {
  static async displayComments(forumId: string): Promise<Comment[]> {
    console.log(`Fetching comments for forum ${forumId}...`);
    return [];
  }

  static async addComment(forumId: string, comment: Comment): Promise<Comment> {
    console.log(`Adding comment to forum ${forumId}...`);
    return comment;
  }

  static async removeExpiredComments(forumId: string): Promise<boolean> {
    console.log(`Removing expired comments from forum ${forumId}...`);
    return true;
  }
}
