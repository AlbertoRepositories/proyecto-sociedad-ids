import { Request, Response } from 'express';
import { User } from '../models/User';

import supabase from '../lib/connect';
let db = supabase.supabase

if(db === null){
  throw new Error("Database connection is not initialized.");
}

export class UserController {
  static async changeUsername(req: Request, res: Response): Promise<void> {
    try {
      const { newUsername } = req.body;
      const userId = req.user?.id; // Assuming auth middleware sets user

      if (!newUsername) {
        res.status(400).json({ message: 'Username is required' });
        return;
      }

      // Logic to update username
      // ...

      res.status(200).json({ success: true, message: 'Username changed successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async updateNotificationPreference(req: Request, res: Response): Promise<void> {
    try {
      const { enabled } = req.body;
      const userId = req.user?.id;

      if (userId === undefined) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      // Logic to update notificationsEnabled
      // ...

      res.status(200).json({ success: true, message: 'Notification preference updated' });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}
