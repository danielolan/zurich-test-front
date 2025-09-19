import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useTasks } from '../hooks/useTasks';
import { useNotification } from '../hooks/useNotification';
import TaskList from '../components/tasks/TaskList';
import TaskStatsComponent from '../components/tasks/TaskStats';
import TaskForm from '../components/tasks/TaskForm';
import Modal, { ModalBody, ModalFooter } from '../components/ui/Modal';
import Button from '../components/ui/Button';
import { LoadingOverlay } from '../components/ui/LoadingSpinner';
import type { Task, CreateTaskData, UpdateTaskData } from '../types';

const TasksPage: React.FC = () => {
  // Estados locales
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [deleteConfirmTask, setDeleteConfirmTask] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  // Hooks
  const {
    tasks,
    stats,
    loading,
    error,
    filters,
    tasksByStatus,
    isEmpty,
    hasFilters,
    createTask,
    updateTask,
    toggleTask,
    deleteTask,
    updateFilters,
    clearFilters,
  } = useTasks();

  const { showNotification } = useNotification();

  // Manejadores de tareas
  const handleCreateTask = () => {
    setSelectedTask(null);
    setIsCreateModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setIsEditModalOpen(true);
  };

  const handleDeleteTask = (taskId: string) => {
    setDeleteConfirmTask(taskId);
  };

  const handleToggleTask = async (taskId: string) => {
    try {
      await toggleTask(taskId);
    } catch (error) {
      // Error ya manejado en el hook
    }
  };

  // Manejadores de formulario
  const handleCreateSubmit = async (data: CreateTaskData) => {
    setFormLoading(true);
    try {
      await createTask(data);
      setIsCreateModalOpen(false);
      showNotification('¡Tarea creada exitosamente!', 'success');
    } catch (error) {
      // Error ya manejado en el hook
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditSubmit = async (data: UpdateTaskData) => {
    if (!selectedTask) return;
    
    setFormLoading(true);
    try {
      await updateTask(selectedTask.id, data);
      setIsEditModalOpen(false);
      setSelectedTask(null);
      showNotification('¡Tarea actualizada exitosamente!', 'success');
    } catch (error) {
      // Error ya manejado en el hook
    } finally {
      setFormLoading(false);
    }
  };

  // Confirmar eliminación
  const confirmDelete = async () => {
    if (!deleteConfirmTask) return;
    
    try {
      await deleteTask(deleteConfirmTask);
      setDeleteConfirmTask(null);
      showNotification('Tarea eliminada exitosamente', 'success');
    } catch (error) {
      // Error ya manejado en el hook
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                Gestión de Tareas
              </h1>
              <p className="text-slate-600">
                Organiza y gestiona tus tareas de manera eficiente
              </p>
            </div>
            
            <Button
              variant="primary"
              size="lg"
              icon={<Plus className="w-5 h-5" />}
              onClick={handleCreateTask}
              className="hidden sm:flex"
            >
              Nueva Tarea
            </Button>

            {/* Botón móvil */}
            <Button
              variant="primary"
              icon={<Plus className="w-5 h-5" />}
              onClick={handleCreateTask}
              className="sm:hidden"
            />
          </div>
        </motion.div>

        {/* Estadísticas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <TaskStatsComponent stats={stats} loading={loading} />
        </motion.div>

        {/* Lista de tareas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <TaskList
            tasks={tasks}
            tasksByStatus={tasksByStatus}
            loading={loading}
            error={error}
            filters={filters}
            isEmpty={isEmpty}
            hasFilters={hasFilters}
            onTaskEdit={handleEditTask}
            onTaskDelete={handleDeleteTask}
            onTaskToggle={handleToggleTask}
            onCreateTask={handleCreateTask}
            onFiltersChange={updateFilters}
            onClearFilters={clearFilters}
          />
        </motion.div>
      </div>

      {/* Modal de creación */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="✨ Crear Nueva Tarea"
        size="lg"
      >
        <ModalBody>
          <TaskForm
            onSubmit={handleCreateSubmit}
            onCancel={() => setIsCreateModalOpen(false)}
            loading={formLoading}
          />
        </ModalBody>
      </Modal>

      {/* Modal de edición */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="✏️ Editar Tarea"
        size="lg"
      >
        <ModalBody>
          <TaskForm
            task={selectedTask}
            onSubmit={handleEditSubmit}
            onCancel={() => setIsEditModalOpen(false)}
            loading={formLoading}
          />
        </ModalBody>
      </Modal>

      {/* Modal de confirmación de eliminación */}
      <Modal
        isOpen={!!deleteConfirmTask}
        onClose={() => setDeleteConfirmTask(null)}
        title="🗑️ Confirmar Eliminación"
        size="sm"
      >
        <ModalBody>
          <div className="text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              ¿Estás seguro?
            </h3>
            <p className="text-slate-600 mb-4">
              Esta acción eliminará permanentemente la tarea. 
              No podrás deshacer esta acción.
            </p>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            variant="secondary"
            onClick={() => setDeleteConfirmTask(null)}
          >
            Cancelar
          </Button>
          <Button
            variant="danger"
            onClick={confirmDelete}
          >
            Eliminar Tarea
          </Button>
        </ModalFooter>
      </Modal>

      {/* Overlay de carga global */}
      <LoadingOverlay isLoading={formLoading} />
    </div>
  );
};

export default TasksPage;