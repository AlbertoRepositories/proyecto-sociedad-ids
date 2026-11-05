import { Request, Response } from 'express';
import { Notification } from '../models/Notification';
import { User } from '../models/User';

import supabase from '../lib/connect';
let db = supabase.supabase

if(db === null){
  throw new Error("Database connection is not initialized.");
}

export class NotificationController {
  static async notify(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.body;
      // Logic to notify
      res.status(200).json({ success: true, message: 'Notification sent' });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async displayInSystem(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.body;
      // Logic to display in system
      res.status(200).json({ success: true, message: 'System notification displayed' });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}
