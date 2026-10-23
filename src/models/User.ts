export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  externalAuthProvider: string;
  notificationsEnabled: boolean;
}

export interface Administrator extends User {
  administratorTitle: string;
}