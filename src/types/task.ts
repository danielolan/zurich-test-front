export type TaskStatus = 'pending' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  due_date?: string;
  completed_at?: string;
  user_id?: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
  
  // Campos de relación (del JOIN con users)
  username?: string;
  first_name?: string;
  last_name?: string;
}

export interface CreateTaskData {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  due_date?: string;
  user_id?: string;
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  due_date?: string;
  user_id?: string;
}

export interface TaskFilters {
  status?: TaskStatus;
  priority?: TaskPriority;
  search?: string;
  sortBy?: 'title' | 'status' | 'priority' | 'created_at' | 'updated_at' | 'due_date';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
  user_id?: string;
}

export interface TaskStats {
  total_tasks: number;
  pending_tasks: number;
  completed_tasks: number;
  high_priority_tasks: number;
  medium_priority_tasks: number;
  low_priority_tasks: number;
  completion_rate?: number;
  overdue_tasks?: number;
}

export interface TasksPagination {
  current_page: number;
  total_pages: number;
  total_items: number;
  items_per_page: number;
  has_next_page: boolean;
  has_prev_page: boolean;
}

export interface TasksResponse {
  tasks: Task[];
  total: number;
  pagination?: TasksPagination;
}

export interface TaskResponse {
  task: Task;
}

export interface TaskStatsResponse {
  statistics: TaskStats;
}

// Tipos para el estado del componente
export interface TasksByStatus {
  pending: Task[];
  completed: Task[];
}

export interface TasksByPriority {
  high: Task[];
  medium: Task[];
  low: Task[];
}