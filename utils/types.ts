export interface Task {
  id: string;
  description: string;
  title: string;
  dueDate?: number;
  dueTime?: number;
}

export interface Column {
  id: string;
  title: string;
  cards?: Array<Task>;
  position: number;
}

export interface Link {
  color: string;
  label: string;
  link: string;
}
