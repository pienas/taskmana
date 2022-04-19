export type Task = {
  id: string;
  description: string;
  title: string;
  date?: Date | null;
  time?: Date | null;
};

export type Column = {
  id: string;
  title: string;
  cards?: Array<Task>;
  position: number;
};

export type Link = {
  icon: React.ReactNode;
  color: string;
  label: string;
};
