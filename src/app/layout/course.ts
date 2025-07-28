export interface Course {
  id: number;
  title: string;
  description: string;
  image: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  url: string;
}
