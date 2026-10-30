import { UserType } from '../types/enums';

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  type: UserType;
  externalAuthProvider: string;
  notificationsEnabled: boolean;
}

export interface Administrator extends User {
  administratorTitle: string;
}
