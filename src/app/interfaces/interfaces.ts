export interface Node {
  id: number | string;
  name: string;
  children?: Node[];
  location?: string;
  rating?: number;
  date?: Date;
  tags?: string[];
}
