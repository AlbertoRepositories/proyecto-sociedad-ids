import { Request, Response } from 'express';
import { Notification } from '../models/Notification';
import { User } from '../models/User';

import supabase from '../lib/connect';
let db = supabase.supabase

export class NotificationController {
  static async notify(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.body;
      // Logic to notify
      const { data, error } = await db
        .from('Notification')
        .insert([{
          notificationTime: new Date(),
          title: req.body.title,
          content: req.body.content,
          isRead: false,
          recipientId: userId,
          notificationType: req.body.notificationType
        }])
        .select();
      
      if (error) {
        res.status(400).json({ success: false, message: error.message });
        return;
      }

      res.status(200).json({ success: true, message: 'Notification sent', data: data });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async displayInSystem(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.body;
      // Logic to display in system
      const { data, error } = await db
        .from('Notification')
        .select('*')
        .eq('recipientId', userId)
        .order('notificationTime', { ascending: false });
      
      if (error) {
        res.status(400).json({ success: false, message: error.message });
        return;
      }
      
      res.status(200).json({ success: true, message: 'System notification displayed', data: data });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}
