import { Request, Response } from 'express';
import { User } from '../models/User';

import supabase from '../lib/connect';
let db = supabase.supabase

export class AuthController {
  static async addEmail(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;
      if (!email) {
        res.status(400).json({ message: 'Email is required' });
        return;
      }
      // Logic to add email to whitelist
      const { data, error } = await db
        .from('whitelist') 
        .insert([{
          email: email,
          added_at: new Date()
        }])
        .select(); 

      if (error) {
        res.status(400).json({ success: false, message: error.message });
        return;
      }

      res.status(200).json({ success: true, message: 'Email added to whitelist', data: data });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async removeEmail(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;
      if (!email) {
        res.status(400).json({ message: 'Email is required' });
        return;
      }
      // Logic to remove email from whitelist
      const { error } = await db
        .from('whitelist')
        .delete()
        .eq('email', email);

      if (error) {
        res.status(400).json({ success: false, message: error.message });
        return;
      }

      res.status(200).json({ success: true, message: 'Email removed from whitelist' });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async isEmailWhitelisted(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;
      if (!email) {
        res.status(400).json({ message: 'Email is required' });
        return;
      }
      // Logic to check whitelist
      const { data, error } = await db
        .from('whitelist')
        .select('*')
        .eq('email', email)
        .single();

      if (error) {
        res.status(400).json({ success: false, message: error.message });
        return;
      }

      res.status(200).json({ success: true, isWhitelisted: data.length > 0 });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async checkPermission(req: Request, res: Response): Promise<void> {
    try {
      const { action } = req.body;
      const user = req.user as User; // Assuming auth middleware sets user

      if (!user || !action) {
        res.status(400).json({ message: 'User and action are required' });
        return;
      }
      // Logic to check permission
      const { data, error } = await db
        .from('whitelist')
        .select('*')
        .eq('email', user.email)
        .single();
      
      if (error) {
        res.status(400).json({ success: false, message: error.message });
        return;
      }
      
      res.status(200).json({ success: true, hasPermission: true,data: data });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}
