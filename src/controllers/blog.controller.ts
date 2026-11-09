import { Request, Response } from 'express';
import { Blog } from '../models/Blog';

import supabase from '../lib/connect';

import { ContentType } from '../types/enums';

let db = supabase.supabase

export class BlogController {
  static async publishPost(req: Request, res: Response): Promise<void> {
    try {
      // Logic to publish post
      const {blogData} = req.body;
      if (!blogData) {
        res.status(400).json({ success: false, message: 'All fields are required' });
        return;
      }

      const { data, error } = await db
        .from('blogs')
        .insert([
          {
            title: blogData.title,
            content: blogData.content,
            creation_date: blogData.creationDate || new Date(),
            expiration_date: blogData.expirationDate,
            is_visible: blogData.isVisible ?? true,
            view_count: blogData.viewCount || 0,
            like_count: blogData.likeCount || 0,
            publication_type: ContentType.BLOG,
            event_start_date: blogData.eventStartDate,
            event_end_date: blogData.eventEndDate,
            location: blogData.location,
            registration_url: blogData.registrationUrl,
            image_urls: blogData.imageUrls || [],
            calendar_id: blogData.calendarId || null,
            administrator_id: blogData.adminId || null
          }
        ])
        .select();

      if (error) {
        res.status(400).json({ success: false, message: error.message });
        return;
      }
      
      res.status(200).json({ success: true, message: 'Post published', data: data });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async editPost(req: Request, res: Response): Promise<void> {
    try {
      const { title, content } = req.body;
      const { postId } = req.params;
      // Logic to edit post

      const { data, error } = await db
        .from('blogs')
        .update([
          {
            title: title,
            content: content
          }
        ])
        .eq('id', postId)
        .select();

      if (error) {
        res.status(400).json({ success: false, message: error.message });
        return;
      }

      res.status(200).json({ success: true, message: 'Post edited', data: data });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async displayPost(req: Request, res: Response): Promise<void> {
    try {
      // Logic to display post
      const { postId } = req.params;

      const { error } = await db
        .from('blogs')
        .update([
          {
            is_visible: true
          }
        ])
        .eq('id', postId)
        .select();

      if (error) {
        res.status(400).json({ success: false, message: error.message });
        return;
      }
      
      res.status(200).json({ success: true, data: 'Post content' });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async deletePost(req: Request, res: Response): Promise<void> {
    try {
      // Logic to delete post
      const { postId } = req.params;

      const { error } = await db
        .from('blogs')
        .delete()
        .eq('id', postId);

      if (error) {
        res.status(400).json({ success: false, message: error.message });
        return;
      }
      

      res.status(200).json({ success: true, message: 'Post deleted' });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async hidePost(req: Request, res: Response): Promise<void> {
    try {
      // Logic to hide post
      const { postId } = req.params;

      const { error } = await db
        .from('blogs')
        .update([
          {
            is_visible: false
          }
        ])
        .eq('id', postId);

      if (error) {
        res.status(400).json({ success: false, message: error.message });
        return;
      }

      res.status(200).json({ success: true, message: 'Post hidden' });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async registerView(req: Request, res: Response): Promise<void> {
    try {
      // Logic to register view
      const { postId } = req.params;

      const { data, error} = await db
        .from('blogs')
        .select('*')
        .eq('id', postId)
        .single();

      if (error || !data) {
        res.status(404).json({ success: false, message: 'Blog no encontrado' });
        return;
      }

      const updatedViewCount = data.view_count + 1;

      const { error: updateError } = await db
        .from('blogs')
        .update([
          {
            view_count: updatedViewCount
          }
        ])
        .eq('id', postId);

      if (updateError) {
        res.status(400).json({ success: false, message: updateError.message });
        return;
      }

      res.status(200).json({ success: true, message: 'View registered' });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async registerLike(req: Request, res: Response): Promise<void> {
    try {
      // Logic to register like
      const { postId } = req.params;

      const { data, error} = await db
        .from('blogs')
        .select('*')
        .eq('id', postId)
        .single();

      if (error || !data) {
        res.status(404).json({ success: false, message: 'Blog no encontrado' });
        return;
      }

      const updatedLikeCount = data.like_count + 1;

      const { error: updateError } = await db
        .from('blogs')
        .update([
          {
            like_count: updatedLikeCount
          }
        ])
        .eq('id', postId);

      if (updateError) {
        res.status(400).json({ success: false, message: updateError.message });
        return;
      }
      res.status(200).json({ success: true, message: 'Like registered' });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}
