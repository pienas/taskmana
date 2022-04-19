export type Task = {
  id: string;
  description: string;
  title: string;
  dueDate?: number;
  dueTime?: number;
};

export type Column = {
  id: string;
  title: string;
  cards?: Array<Task>;
  position: number;
};

export type Link = {
  color: string;
  label: string;
  link: string;
};
