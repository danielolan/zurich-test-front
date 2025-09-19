import axios from 'axios';
import type { 
  ApiResponse, 
  ApiError,
  Task,
  CreateTaskData,
  UpdateTaskData,
  TaskFilters,
  TasksResponse,
  TaskResponse,
  TaskStatsResponse,
  User,
  LoginCredentials,
  AuthResponse
} from '../types';

// Configuración base de la API - VITE usa import.meta.env en lugar de process.env
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Crear instancia de axios - Sin AxiosInstance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para requests
apiClient.interceptors.request.use(
  (config) => {
    // Agregar token de autenticación si existe
    const token = localStorage.getItem('auth_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log de requests en desarrollo - VITE usa import.meta.env.DEV
    if (import.meta.env.DEV) {
      console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`, config.data);
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// Interceptor para responses - Sin tipos específicos de Axios
apiClient.interceptors.response.use(
  (response) => {
    // Log de responses en desarrollo
    if (import.meta.env.DEV) {
      console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url}`, response.data);
    }
    
    return response;
  },
  (error) => {
    // Manejo centralizado de errores
    const errorMessage = error.response?.data?.error?.message || error.message || 'Ha ocurrido un error';
    
    console.error('❌ Response error:', {
      status: error.response?.status,
      message: errorMessage,
      url: error.config?.url,
    });

    // Redireccionar al login si el token expiró
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      // window.location.href = '/login';
    }

    // Crear un error más descriptivo
    const enhancedError: ApiError = {
      message: errorMessage,
      status: error.response?.status,
      originalError: error,
    };
    
    return Promise.reject(enhancedError);
  }
);

// Función para manejar respuestas de la API - Sin tipos específicos
const handleApiResponse = <T>(response: any): T => {
  if (response.data.success) {
    return response.data.data as T;
  } else {
    throw new Error(response.data.error?.message || 'Error en la respuesta de la API');
  }
};

// Funciones de la API
export const api = {
  // Health check
  health: (): Promise<any> => apiClient.get('/health').then(handleApiResponse),
  
  // Tasks
  tasks: {
    // Obtener todas las tareas
    getAll: (params: TaskFilters = {}): Promise<TasksResponse> => {
      const queryParams = new URLSearchParams();
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          queryParams.append(key, String(value));
        }
      });
      
      const queryString = queryParams.toString();
      const url = queryString ? `/tasks?${queryString}` : '/tasks';
      
      return apiClient.get(url).then(handleApiResponse);
    },
    
    // Obtener tarea por ID
    getById: (id: string): Promise<TaskResponse> => 
      apiClient.get(`/tasks/${id}`).then(handleApiResponse),
    
    // Crear nueva tarea
    create: (taskData: CreateTaskData): Promise<TaskResponse> => 
      apiClient.post('/tasks', taskData).then(handleApiResponse),
    
    // Actualizar tarea completa
    update: (id: string, taskData: UpdateTaskData): Promise<TaskResponse> => 
      apiClient.put(`/tasks/${id}`, taskData).then(handleApiResponse),
    
    // Actualizar tarea parcial
    patch: (id: string, taskData: Partial<UpdateTaskData>): Promise<TaskResponse> => 
      apiClient.patch(`/tasks/${id}`, taskData).then(handleApiResponse),
    
    // Toggle estado de tarea
    toggle: (id: string): Promise<TaskResponse> => 
      apiClient.patch(`/tasks/${id}/toggle`).then(handleApiResponse),
    
    // Eliminar tarea
    delete: (id: string): Promise<void> => 
      apiClient.delete(`/tasks/${id}`).then(() => undefined),
    
    // Obtener estadísticas
    getStats: (): Promise<TaskStatsResponse> => 
      apiClient.get('/tasks/stats').then(handleApiResponse),
  },
  
  // Auth (mock para cumplir con requisitos opcionales)
  auth: {
    login: (credentials: LoginCredentials): Promise<AuthResponse> => {
      // Mock login - implementar según necesidades
      return new Promise((resolve) => {
        setTimeout(() => {
          const mockToken = 'mock_jwt_token_' + Date.now();
          localStorage.setItem('auth_token', mockToken);
          resolve({
            token: mockToken,
            user: {
              id: 1,
              name: 'Usuario Demo',
              email: credentials.email,
            }
          });
        }, 1000);
      });
    },
    
    logout: (): Promise<void> => {
      localStorage.removeItem('auth_token');
      return Promise.resolve();
    },
    
    getCurrentUser: (): Promise<User> => {
      const token = localStorage.getItem('auth_token');
      if (!token) return Promise.reject(new Error('No token found'));
      
      return Promise.resolve({
        id: 1,
        name: 'Usuario Demo',
        email: 'demo@zurich.com',
      });
    }
  }
};

// Funciones de utilidad
export const apiUtils = {
  // Verificar si hay conexión con el backend
  checkConnection: async (): Promise<boolean> => {
    try {
      await api.health();
      return true;
    } catch (error) {
      return false;
    }
  },
  
  // Retry de operaciones
  retry: async <T>(
    operation: () => Promise<T>, 
    maxRetries: number = 3, 
    delay: number = 1000
  ): Promise<T> => {
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await operation();
      } catch (error) {
        if (i === maxRetries - 1) throw error;
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
      }
    }
    throw new Error('Max retries reached');
  },
  
  // Cancelar requests (para cleanup en unmount)
  createCancelToken: () => axios.CancelToken.source(),
};

export default apiClient;