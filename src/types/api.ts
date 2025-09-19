// Respuesta base de la API
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    error?: {
      message: string;
      details?: any;
    };
  }
  
  // Error de la API
  export interface ApiError {
    message: string;
    status?: number;
    details?: any;
    originalError?: Error;
  }
  
  // Tipos de notificación
  export type NotificationType = 'success' | 'error' | 'warning' | 'info';
  
  export interface Notification {
    id: number;
    message: string;
    type: NotificationType;
    timestamp: number;
    duration?: number;
    persistent?: boolean;
  }
  
  // Opciones para notificaciones
  export interface NotificationOptions {
    duration?: number;
    persistent?: boolean;
    action?: {
      label: string;
      onClick: () => void;
    };
  }
  
  // Tipos para autenticación (mock)
  export interface User {
    id: string | number;
    name: string;
    email: string;
    username?: string;
    first_name?: string;
    last_name?: string;
    is_active?: boolean;
    last_login?: string;
  }
  
  export interface LoginCredentials {
    email: string;
    password: string;
  }
  
  export interface AuthResponse {
    token: string;
    user: User;
  }
  
  // Estados de carga
  export interface LoadingState {
    loading: boolean;
    error: string | null;
  }
  
  // Tipos para formularios
  export interface FormState<T> {
    data: T;
    errors: Partial<Record<keyof T, string>>;
    isValid: boolean;
    isDirty: boolean;
    isSubmitting: boolean;
  }
  
  // Tipos para paginación genérica
  export interface PaginationParams {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }
  
  export interface PaginationInfo {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  }
  
  // Tipos para filtros genéricos
  export interface FilterParams {
    search?: string;
    [key: string]: any;
  }
  
  // Tipos para configuración
  export interface AppConfig {
    apiUrl: string;
    timeout: number;
    retryAttempts: number;
    enableLogging: boolean;
  }
  
  // Tipos para el estado global de la aplicación
  export interface AppState {
    isAuthenticated: boolean;
    user: User | null;
    theme: 'light' | 'dark';
    notifications: Notification[];
  }
  
  // Tipos para hooks
  export interface UseApiOptions {
    onSuccess?: (data: any) => void;
    onError?: (error: ApiError) => void;
    retry?: number;
    enabled?: boolean;
  }
  
  export interface UseTasksReturn {
    tasks: Task[];
    stats: TaskStats;
    loading: boolean;
    error: string | null;
    filters: TaskFilters;
    pagination: PaginationInfo;
    tasksByStatus: TasksByStatus;
    tasksByPriority: TasksByPriority;
    localStats: TaskStats;
    loadTasks: (filters?: Partial<TaskFilters>) => Promise<void>;
    loadStats: () => Promise<void>;
    createTask: (data: CreateTaskData) => Promise<Task>;
    updateTask: (id: string, data: UpdateTaskData) => Promise<Task>;
    patchTask: (id: string, data: Partial<UpdateTaskData>) => Promise<Task>;
    toggleTask: (id: string) => Promise<Task>;
    deleteTask: (id: string) => Promise<void>;
    updateFilters: (filters: Partial<TaskFilters>) => void;
    clearFilters: () => void;
    changePage: (page: number) => void;
    refetch: () => Promise<void>;
    isEmpty: boolean;
    hasFilters: boolean;
  }
  
  // Re-exportar tipos de task
  export type { 
    Task, 
    TaskStatus, 
    TaskPriority, 
    CreateTaskData, 
    UpdateTaskData, 
    TaskFilters,
    TaskStats,
    TasksPagination,
    TasksResponse,
    TaskResponse,
    TaskStatsResponse,
    TasksByStatus,
    TasksByPriority
  } from './task';