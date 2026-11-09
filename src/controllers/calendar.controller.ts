import { Request, Response } from 'express';
import { Calendar } from '../models/Calendar';
import { Blog } from '../models/Blog';
import { User } from '../models/User';

import supabase from '../lib/connect';
import { ContentType } from '../types/enums';


let db = supabase.supabase


export class CalendarController {
  static async registerEvent(req: Request, res: Response): Promise<void> {
    try {
      const { eventData } = req.body;
      // Logic to register event
      if (!eventData) {
        res.status(400).json({ success: false, message: 'All fields are required' });
        return;
      }

      const { data, error } = await db
        .from('blogs')
        .insert([
          {
            title: eventData.title,
            content: eventData.content,
            creation_date: eventData.creationDate || new Date(),
            expiration_date: eventData.expirationDate,
            is_visible: eventData.isVisible ?? true,
            view_count: eventData.viewCount || 0,
            like_count: eventData.likeCount || 0,
            publication_type: ContentType.EVENT,
            event_start_date: eventData.eventStartDate,
            event_end_date: eventData.eventEndDate,
            location: eventData.location,
            registration_url: eventData.registrationUrl,
            image_urls: eventData.imageUrls || [],
            calendar_id: eventData.calendarId || null,
            administrator_id: eventData.adminId || null
          }
        ])
        .select(); 

      if (error) {
        res.status(400).json({ success: false, message: error.message });
        return;
      }
      
      res.status(200).json({ success: true, message: 'Event registered', data: data });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async editEvent(req: Request, res: Response): Promise<void> {
    try {
      const { eventData } = req.body;
      const { eventId } = req.params;
      // Logic to edit event

      const { data, error } = await db
        .from('blogs')
        .update([
          {
            title: eventData.title,
            content: eventData.content
            //agregar campos adicionales según sea necesario
          }
        ])
        .eq('id', eventId)
        .select();

      if (error) {
        res.status(400).json({ success: false, message: error.message });
        return;
      }
      res.status(200).json({ success: true, message: 'Event edited', data: data });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async hideEvent(req: Request, res: Response): Promise<void> {
    try {
      const { eventId } = req.body;
      // Logic to hide event
      const { error } = await db
        .from('blogs')
        .update([
          {
            is_visible: false
          }
        ])
        .eq('id', eventId);

      if (error) {
        res.status(400).json({ success: false, message: error.message });
        return;
      }

      res.status(200).json({ success: true, message: 'Event hidden' });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async deleteEvent(req: Request, res: Response): Promise<void> {
    try {
      const { eventId } = req.body;
      // Logic to delete event
      const { error } = await db
        .from('blogs')
        .delete()
        .eq('id', eventId);

      if (error) {
        res.status(400).json({ success: false, message: error.message });
        return;
      }
      
      res.status(200).json({ success: true, message: 'Event deleted' });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async displayEvents(req: Request, res: Response): Promise<void> {
    try {
      // Logic to display events
      const { data, error } = await db
        .from('blogs')
        .select('*')
        .eq('publication_type', ContentType.EVENT)
        .eq('is_visible', true)
        .order('creation_date', { ascending: false });

      if (error) {
        res.status(400).json({ success: false, message: error.message });
        return;
      }
      res.status(200).json({ success: true, data: data });

    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async requestEventNotification(req: Request, res: Response): Promise<void> {
    try {
      const { event, recipients } = req.body;
      const { error } = await db
        .from('event_notifications')
        .insert([
          {
            event_id: event.id, // Las notifivaciones están asociadas a un evento específico? o solo sueltas?
            notification_time: new Date(),
            title: event.title,
            content: event.content,
            is_read: false,
            recipient_id: recipients[0], // Assuming the first recipient is the one to notify
            notification_type: 'EVENT_NOTIFICATION'
          }
        ])
        .select(); 

      if (error) {
        res.status(400).json({ success: false, message: error.message });
        return;
      }

      res.status(200).json({ success: true, message: 'Event notification requested' });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}
