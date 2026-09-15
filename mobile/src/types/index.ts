export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface Task {
  id: string;
  _id?: string;
  title: string;
  description?: string;
  dateTime: string;
  deadline?: string;
  priority: TaskPriority;
  category: string;
  tags: string[];
  isCompleted: boolean;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
  mixScore?: number;
}

export interface TaskStats {
  total: number;
  completed: number;
  pending: number;
  urgent: number;
  completionRate: number;
}

export type SortMode = 'mix' | 'deadline' | 'priority' | 'date';
export type FilterStatus = 'all' | 'pending' | 'completed' | 'today';

export interface FilterOptions {
  status: FilterStatus;
  category: string;
  priority: string;
  search: string;
  sortBy: SortMode;
}

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  Login: undefined;
  Register: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Profile: undefined;
};
