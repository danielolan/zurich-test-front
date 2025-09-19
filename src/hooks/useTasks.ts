import { useState, useEffect, useCallback, useMemo } from 'react';
import { api } from '../services/api';
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
} from '../types';

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
      console.log('🔄 Loading tasks with filters:', filterParams);
      
      const response = await api.tasks.getAll(filterParams);
      console.log('✅ Raw API response:', response);
      console.log('✅ Response type:', typeof response);
      console.log('✅ Response keys:', Object.keys(response));
      console.log('✅ Response.data:', response.data);
      console.log('✅ Response.data?.tasks:', response.data?.tasks);
      
      // Manejar múltiples estructuras posibles
      let tasksData = [];
      let totalData = 0;
      
      if (Array.isArray(response)) {
        // Si la respuesta es directamente un array
        console.log('📋 Response is direct array');
        tasksData = response;
        totalData = response.length;
      } else if (response.data?.tasks) {
        // Estructura: {data: {tasks: []}}
        console.log('📋 Response has data.tasks structure');
        tasksData = response.data.tasks;
        totalData = response.data.total || response.data.tasks.length;
      } else if (response.tasks) {
        // Estructura: {tasks: []}
        console.log('📋 Response has tasks structure');
        tasksData = response.tasks;
        totalData = response.total || response.tasks.length;
      } else if (response.data && Array.isArray(response.data)) {
        // Estructura: {data: []}
        console.log('📋 Response has data array structure');
        tasksData = response.data;
        totalData = response.data.length;
      } else {
        console.log('📋 Unknown response structure, using fallback');
        tasksData = [];
        totalData = 0;
      }
      const paginationData = response.data?.pagination || response.pagination || {
        currentPage: filterParams.page || 1,
        totalPages: Math.ceil(totalData / (filterParams.limit || 20)),
        totalItems: totalData,
        itemsPerPage: filterParams.limit || 20,
        hasNextPage: false,
        hasPrevPage: false,
      };
      
      console.log('📝 Tasks data:', tasksData);
      console.log('📊 Total count:', totalData);
      console.log('📄 Pagination:', paginationData);
      
      setTasks(tasksData);
      setPagination(paginationData);
      
      // Log después de setear
      console.log('✅ Tasks set in state, length:', tasksData.length);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      console.error('❌ Error loading tasks:', err);
      setError(errorMessage);
      showNotification('Error al cargar tareas', 'error');
    } finally {
      setLoading(false);
    }
  }, [filters, showNotification]);

  // Función para cargar estadísticas
  const loadStats = useCallback(async () => {
    try {
      console.log('📊 Loading stats...');
      const statsData = await api.tasks.getStats();
      console.log('✅ Stats loaded:', statsData);
      // Manejar la estructura del backend: response.data.statistics
      setStats(statsData.data?.statistics || statsData.statistics || statsData);
    } catch (err) {
      console.error('❌ Error loading stats:', err);
    }
  }, []);

  // Crear nueva tarea
  const createTask = useCallback(async (taskData: CreateTaskData): Promise<Task> => {
    setLoading(true);
    try {
      console.log('➕ Creating task:', taskData);
      const newTaskResponse = await api.tasks.create(taskData);
      // Manejar la estructura del backend: response.data.task
      const newTask = newTaskResponse.data?.task || newTaskResponse.task || newTaskResponse;
      
      setTasks(prevTasks => [newTask, ...prevTasks]);
      showNotification('Tarea creada exitosamente', 'success');
      loadStats();
      return newTask;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear la tarea';
      console.error('❌ Error creating task:', err);
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
      console.log('✏️ Updating task:', id, taskData);
      const updatedTaskResponse = await api.tasks.update(id, taskData);
      // Manejar la estructura del backend: response.data.task
      const updatedTask = updatedTaskResponse.data?.task || updatedTaskResponse.task || updatedTaskResponse;
      
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
      console.error('❌ Error updating task:', err);
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
      console.log('🔧 Patching task:', id, changes);
      const updatedTaskResponse = await api.tasks.patch(id, changes);
      // Manejar la estructura del backend: response.data.task
      const updatedTask = updatedTaskResponse.data?.task || updatedTaskResponse.task || updatedTaskResponse;
      
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === id ? updatedTask : task
        )
      );
      loadStats();
      return updatedTask;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar la tarea';
      console.error('❌ Error patching task:', err);
      showNotification(errorMessage, 'error');
      throw err;
    }
  }, [showNotification, loadStats]);

  // Toggle estado de tarea
  const toggleTask = useCallback(async (id: string): Promise<Task> => {
    try {
      console.log('🔄 Toggling task:', id);
      const updatedTaskResponse = await api.tasks.toggle(id);
      // Manejar la estructura del backend: response.data.task
      const updatedTask = updatedTaskResponse.data?.task || updatedTaskResponse.task || updatedTaskResponse;
      
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
      console.error('❌ Error toggling task:', err);
      showNotification(errorMessage, 'error');
      throw err;
    }
  }, [showNotification, loadStats]);

  // Eliminar tarea
  const deleteTask = useCallback(async (id: string): Promise<void> => {
    setLoading(true);
    try {
      console.log('🗑️ Deleting task:', id);
      await api.tasks.delete(id);
      setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
      showNotification('Tarea eliminada exitosamente', 'success');
      loadStats();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar la tarea';
      console.error('❌ Error deleting task:', err);
      setError(errorMessage);
      showNotification(errorMessage, 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [showNotification, loadStats]);

  // Actualizar filtros
  const updateFilters = useCallback((newFilters: Partial<TaskFilters>) => {
    console.log('🔍 Updating filters:', newFilters);
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  }, []);

  // Limpiar filtros
  const clearFilters = useCallback(() => {
    console.log('🧹 Clearing filters');
    setFilters(INITIAL_FILTERS);
  }, []);

  // Cambiar página
  const changePage = useCallback((page: number) => {
    console.log('📄 Changing page to:', page);
    setFilters(prev => ({ ...prev, page }));
  }, []);

  // NO aplicar filtro de búsqueda adicional aquí, ya que viene del servidor
  // Solo usar las tareas directamente del estado
  const filteredTasks = useMemo(() => {
    console.log('📝 Using tasks directly from state, count:', tasks.length);
    return tasks;
  }, [tasks]);

  // Tareas agrupadas por estado
  const tasksByStatus = useMemo((): TasksByStatus => {
    const result = {
      pending: filteredTasks.filter(task => task.status === 'pending'),
      completed: filteredTasks.filter(task => task.status === 'completed'),
    };
    console.log('📋 Tasks by status:', {
      pending: result.pending.length,
      completed: result.completed.length
    });
    return result;
  }, [filteredTasks]);

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

  // Log estado actual
  useEffect(() => {
    console.log('🔄 Hook state updated:', {
      tasksCount: tasks.length,
      filteredTasksCount: filteredTasks.length,
      loading,
      error,
      isEmpty: filteredTasks.length === 0
    });
  }, [tasks, filteredTasks, loading, error]);

  // Cargar datos iniciales
  useEffect(() => {
    console.log('🚀 Component mounted, loading initial data');
    loadTasks();
    loadStats();
  }, []); // Sin dependencias para evitar loops

  // CORREGIDO: Separar el effect de filtros para evitar loops infinitos
  useEffect(() => {
    console.log('🔄 Filters effect triggered:', filters);
    // Solo recargar si hay cambios reales en filtros (excluyendo la carga inicial)
    const hasFiltersChanged = JSON.stringify(filters) !== JSON.stringify(INITIAL_FILTERS);
    if (hasFiltersChanged) {
      console.log('🔄 Filters changed, reloading tasks');
      loadTasks();
    }
  }, [filters.status, filters.priority, filters.search, filters.sortBy, filters.sortOrder, filters.page, filters.limit]); // Solo dependencias específicas

  const returnValue = {
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

  console.log('🎯 Hook returning:', {
    tasksCount: returnValue.tasks.length,
    isEmpty: returnValue.isEmpty,
    loading: returnValue.loading,
    tasks: returnValue.tasks.slice(0, 3) // Solo los primeros 3 para debug
  });

  return returnValue;
};