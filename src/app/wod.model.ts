export interface WOD {
  title: string;
  activities: string[];
  id: string;
  author: string;
  date_created: string; // I don't know how to get the "Date" object as Date() returns a string
}
