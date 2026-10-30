import { Blog } from './Blog';
import { User } from './User';

export interface Calendar {
  id: string;
  semesterStartDate: Date;
  semesterEndDate: Date;
  events: Blog[];
}
