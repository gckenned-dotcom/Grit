export type Priority = 'low' | 'medium' | 'high' | 'critical';

export type Stage = 'backlog' | 'todo' | 'in-progress' | 'review' | 'done';

export type Category =
  | 'development'
  | 'design'
  | 'marketing'
  | 'research'
  | 'operations'
  | 'qa'
  | 'devops'
  | 'other';

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  category: Category;
  priority: Priority;
  dueDate: string; // ISO date string YYYY-MM-DD
  stage: Stage;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  color: string;
  createdAt: string;
  updatedAt: string;
}

export interface AppState {
  projects: Project[];
  tasks: Task[];
}
