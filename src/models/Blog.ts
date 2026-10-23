import { Comment } from './Comment';

export interface Blog {
  id: string;
  title: string;
  content: string;
  creationDate: Date;
  expirationDate: Date;
  isVisible: boolean;
  viewCount: number;
  likeCount: number;
  publicationType: string;
  eventStartDate: Date;
  eventEndDate: Date;
  location: string;
  registrationUrl: string;
  imageUrls: string[];
}

// Forum inherits from Blog as per the diagram
export interface Forum extends Blog {
  comments: Comment[];
}
