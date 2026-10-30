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
