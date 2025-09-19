// Exportar todos los tipos desde un lugar centralizado
export type {
    // Tipos de tareas
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
    TasksByPriority,
  } from './task';
  
  export type {
    // Tipos de API
    ApiResponse,
    ApiError,
    NotificationType,
    Notification,
    NotificationOptions,
    User,
    LoginCredentials,
    AuthResponse,
    LoadingState,
    FormState,
    PaginationParams,
    PaginationInfo,
    FilterParams,
    AppConfig,
    AppState,
    UseApiOptions,
    UseTasksReturn,
  } from './api';