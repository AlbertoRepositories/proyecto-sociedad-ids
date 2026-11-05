import { Request, Response } from 'express';
import { Comment } from '../models/Comment';

import supabase from '../lib/connect';


let db = supabase.supabase

if(db === null){
  throw new Error("Database connection is not initialized.");
}

export class CommentController {
  static async publishComment(req: Request, res: Response): Promise<void> {
    try {
      // Logic to publish comment
      const { comment } = req.body;
      if (!comment) {
        res.status(400).json({ success: false, message: 'All fields are required' });
        return;
      }

      const { data, error } = await db
        .from('comments') 
        .insert([{
          content: comment.content,
          creation_date: comment.creationDate || new Date(),
          like_count: comment.likeCount || 0,
          is_hidden_by_author: comment.isHiddenByAuthor || false,
          author_id: comment.author.id,
          forum_id: comment.forumId,
          parent_comment_id: null  // For replies, otherwise null
        }])
        .select(); 

      if (error) {
        res.status(400).json({ success: false, message: error.message });
        return;
      }
      
      res.status(200).json({ success: true, message: 'Comment published', data: data });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async hideComment(req: Request, res: Response): Promise<void> {
    try {
      // Logic to hide comment
      const { commentId } = req.body;
      const { data, error } = await db
        .from('comments')
        .update([
          {
            is_hidden_by_author: true
          }
        ])
        .eq('id', commentId)
        .select();

      if (error) {
        res.status(400).json({ success: false, message: error.message });
        return;
      }

      res.status(200).json({ success: true, message: 'Comment hidden', data: data });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async displayComment(req: Request, res: Response): Promise<void> {
    try {
      // Logic to display comment
      const { commentId } = req.body;
      const { data, error } = await db
        .from('comments')
        .update([
          {
            is_hidden_by_author: false
          }
        ])
        .eq('id', commentId)
        .select();

      if (error) {
        res.status(400).json({ success: false, message: error.message });
        return;
      }
      res.status(200).json({ success: true, data: data[0] });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async deleteComment(req: Request, res: Response): Promise<void> {
    try {
      // Logic to delete comment
      const { commentId } = req.body;
      const { error } = await db
        .from('comments')
        .delete()
        .eq('id', commentId);

      if (error) {
        res.status(400).json({ success: false, message: error.message });
        return;
      }
      
      res.status(200).json({ success: true, message: 'Comment deleted' });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async addReply(req: Request, res: Response): Promise<void> {
    try {
      const { reply } = req.body;
      // Logic to add reply
      if (!reply) {
        res.status(400).json({ success: false, message: 'All fields are required' });
        return;
      }

      const { data, error } = await db
        .from('comments') 
        .insert([{
          content: reply.content,
          creation_date: reply.creationDate || new Date(),
          like_count: reply.likeCount || 0,
          is_hidden_by_author: reply.isHiddenByAuthor || false,
          author_id: reply.author.id,
          forum_id: reply.forumId,
          parent_comment_id: reply.parentCommentId 
        }])
        .select(); 

      if (error) {
        res.status(400).json({ success: false, message: error.message });
        return;
      }
      
      res.status(200).json({ success: true, message: 'Reply added', data: data });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}
