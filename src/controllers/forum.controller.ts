import { Request, Response } from 'express';
import { Forum } from '../models/Forum';
import { Comment } from '../models/Comment';

import supabase from '../lib/connect';
let db = supabase.supabase


export class ForumController {
  static async displayComments(req: Request, res: Response): Promise<void> {
    try {
      const { forumId } = req.body;
      // Logic to display comments
      const { data, error } = await db
        .from('comments')
        .select('*')
        .eq('forum_id', forumId)
        .order('creation_date', { ascending: true });
      if (error) {
        res.status(400).json({ success: false, message: error.message });
        return;
      }
      res.status(200).json({ success: true, message: 'Comments displayed' , data: data });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async addComment(req: Request, res: Response): Promise<void> {
    try {
      const { comment } = req.body;
      const { forumId } = req.params;
      // Logic to add comment
      const { data, error } = await db
        .from('comments')
        .insert([
          {
            content: comment.content,
            creation_date: new Date(),
            like_count: 0,
            is_hidden_by_author: false,
            author_id: comment.authorId,
            forum_id: forumId,
            parent_comment_id: comment.parentCommentId || null
          }
        ])
        .select();

      if (error) {
        res.status(400).json({ success: false, message: error.message });
        return;
      }
      res.status(200).json({ success: true, message: 'Comment added', data: data });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async removeExpiredComments(req: Request, res: Response): Promise<void> {
    try {
      const forumId = req.params.forumId;

      const { data: forumData, error: forumError } = await db
        .from('forums')
        .select('expiration_date')  // forum tiene expiration_date? o tengo que buscarla en blogs?
        .eq('id', forumId)
        .single();
      
      if (forumError) {
        res.status(400).json({ success: false, message: forumError.message });
        return;
      }
      
      const expiredDate = forumData.expiration_date;
      // Logic to remove expired comments
      const { data, error } = await db
        .from('comments')
        .delete()
        .eq('forum_id', forumId)
        .lt('creation_date', expiredDate);

      if (error) {
        res.status(400).json({ success: false, message: error.message });
        return;
      }
      
      res.status(200).json({ success: true, message: 'Expired comments removed', data: data });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}
