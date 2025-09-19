import { useState, useEffect, useCallback, useMemo } from 'react';
import { api } from '@/services/api';
import { useNotification } from './useNotification';
import type { 
  Task,
  TaskFilters,
  TaskStats,
  CreateTaskData,
  UpdateTaskData,
  TasksByStatus,
  TasksByPriority,
  PaginationInfo,
  UseTasksReturn
} from '@/types';

const INITIAL_FILTERS: TaskFilters = {
  status: undefined,
  priority: undefined,
  search: '',
  sortBy: 'created_at',
  sortOrder: 'desc',
  page: 1,
  limit: 20,
};

export const useTasks = (): UseTasksReturn => {
  // Estados
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<TaskStats | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<TaskFilters>(INITIAL_FILTERS);
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 20,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const { showNotification } = useNotification();

  // Función para cargar tareas
  const loadTasks = useCallback(async (customFilters: Partial<TaskFilters> = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const filterParams = { ...filters, ...customFilters };
      const response = await api.tasks.getAll(filterParams);
      
      setTasks(response.tasks || []);
      setPagination(response.pagination || {
        currentPage: 1,
        totalPages: 1,
        totalItems: response.total || 0,
        itemsPerPage: 20,
        hasNextPage: false,
        hasPrevPage: false,
      });
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      showNotification('Error al cargar tareas', 'error');
      console.error('Error loading tasks:', err);
    } finally {
      setLoading(false);
    }
  }, [filters, showNotification]);

  // Función para cargar estadísticas
  const loadStats = useCallback(async () => {
    try {
      const statsData = await api.tasks.getStats();
      setStats(statsData.statistics);
    } catch (err) {
      console.error('Error loading stats:', err);
    }
  }, []);

  // Crear nueva tarea
  const createTask = useCallback(async (taskData: CreateTaskData): Promise<Task> => {
    setLoading(true);
    try {
      const newTaskResponse = await api.tasks.create(taskData);
      const newTask = newTaskResponse.task;
      setTasks(prevTasks => [newTask, ...prevTasks]);
      showNotification('Tarea creada exitosamente', 'success');
      loadStats(); // Actualizar estadísticas
      return newTask;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear la tarea';
      setError(errorMessage);
      showNotification(errorMessage, 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [showNotification, loadStats]);

  // Actualizar tarea
  const updateTask = useCallback(async (id: string, taskData: UpdateTaskData): Promise<Task> => {
    setLoading(true);
    try {
      const updatedTaskResponse = await api.tasks.update(id, taskData);
      const updatedTask = updatedTaskResponse.task;
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === id ? updatedTask : task
        )
      );
      showNotification('Tarea actualizada exitosamente', 'success');
      loadStats();
      return updatedTask;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar la tarea';
      setError(errorMessage);
      showNotification(errorMessage, 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [showNotification, loadStats]);

  // Actualizar parcialmente una tarea
  const patchTask = useCallback(async (id: string, changes: Partial<UpdateTaskData>): Promise<Task> => {
    try {
      const updatedTaskResponse = await api.tasks.patch(id, changes);
      const updatedTask = updatedTaskResponse.task;
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === id ? updatedTask : task
        )
      );
      loadStats();
      return updatedTask;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar la tarea';
      showNotification(errorMessage, 'error');
      throw err;
    }
  }, [showNotification, loadStats]);

  // Toggle estado de tarea
  const toggleTask = useCallback(async (id: string): Promise<Task> => {
    try {
      const updatedTaskResponse = await api.tasks.toggle(id);
      const updatedTask = updatedTaskResponse.task;
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === id ? updatedTask : task
        )
      );
      const newStatus = updatedTask.status === 'completed' ? 'completada' : 'pendiente';
      showNotification(`Tarea marcada como ${newStatus}`, 'success');
      loadStats();
      return updatedTask;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cambiar estado de la tarea';
      showNotification(errorMessage, 'error');
      throw err;
    }
  }, [showNotification, loadStats]);

  // Eliminar tarea
  const deleteTask = useCallback(async (id: string): Promise<void> => {
    setLoading(true);
    try {
      await api.tasks.delete(id);
      setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
      showNotification('Tarea eliminada exitosamente', 'success');
      loadStats();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar la tarea';
      setError(errorMessage);
      showNotification(errorMessage, 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [showNotification, loadStats]);

  // Actualizar filtros
  const updateFilters = useCallback((newFilters: Partial<TaskFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  }, []);

  // Limpiar filtros
  const clearFilters = useCallback(() => {
    setFilters(INITIAL_FILTERS);
  }, []);

  // Cambiar página
  const changePage = useCallback((page: number) => {
    setFilters(prev => ({ ...prev, page }));
  }, []);

  // Tareas filtradas y ordenadas (para vista local)
  const filteredTasks = useMemo(() => {
    let filtered = [...tasks];

    // Filtrar por búsqueda local (además del filtro del servidor)
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(searchLower) ||
        task.description?.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  }, [tasks, filters.search]);

  // Tareas agrupadas por estado
  const tasksByStatus = useMemo((): TasksByStatus => ({
    pending: filteredTasks.filter(task => task.status === 'pending'),
    completed: filteredTasks.filter(task => task.status === 'completed'),
  }), [filteredTasks]);

  // Tareas agrupadas por prioridad
  const tasksByPriority = useMemo((): TasksByPriority => ({
    high: filteredTasks.filter(task => task.priority === 'high'),
    medium: filteredTasks.filter(task => task.priority === 'medium'),
    low: filteredTasks.filter(task => task.priority === 'low'),
  }), [filteredTasks]);

  // Estadísticas locales (calculadas desde las tareas cargadas)
  const localStats = useMemo((): TaskStats => ({
    total_tasks: filteredTasks.length,
    pending_tasks: tasksByStatus.pending.length,
    completed_tasks: tasksByStatus.completed.length,
    high_priority_tasks: tasksByPriority.high.length,
    medium_priority_tasks: tasksByPriority.medium.length,
    low_priority_tasks: tasksByPriority.low.length,
    completion_rate: filteredTasks.length > 0 
      ? Math.round((tasksByStatus.completed.length / filteredTasks.length) * 100)
      : 0,
  }), [filteredTasks, tasksByStatus, tasksByPriority]);

  // Cargar datos iniciales
  useEffect(() => {
    loadTasks();
    loadStats();
  }, [loadTasks, loadStats]);

  // Recargar cuando cambien los filtros
  useEffect(() => {
    loadTasks();
  }, [filters]);

  return {
    // Estados
    tasks: filteredTasks,
    stats: stats || localStats,
    loading,
    error,
    filters,
    pagination,
    
    // Datos procesados
    tasksByStatus,
    tasksByPriority,
    localStats,
    
    // Acciones
    loadTasks,
    loadStats,
    createTask,
    updateTask,
    patchTask,
    toggleTask,
    deleteTask,
    
    // Filtros y paginación
    updateFilters,
    clearFilters,
    changePage,
    
    // Utilidades
    refetch: loadTasks,
    isEmpty: filteredTasks.length === 0,
    hasFilters: Object.values(filters).some(value => 
      value !== '' && value !== INITIAL_FILTERS.page && value !== INITIAL_FILTERS.limit
    ),
  };
};