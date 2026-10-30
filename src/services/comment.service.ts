import { Comment } from '../models/Comment';

export class CommentService {
  static async publishComment(id: string): Promise<Comment> {
    console.log(`Publishing comment ${id}...`);
    return { id } as Comment;
  }

  static async hideComment(id: string): Promise<boolean> {
    console.log(`Hiding comment ${id}...`);
    return true;
  }

  static async displayComment(id: string): Promise<Comment> {
    console.log(`Fetching comment ${id}...`);
    return { id } as Comment;
  }

  static async deleteComment(id: string): Promise<boolean> {
    console.log(`Deleting comment ${id}...`);
    return true;
  }

  static async addReply(parentCommentId: string, reply: string): Promise<Comment> {
    console.log(`Adding reply to ${parentCommentId}...`);
    return { id: 'reply1' } as Comment;
  }
}
