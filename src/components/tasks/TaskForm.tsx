import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Calendar, FileText, Save, X } from 'lucide-react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { PriorityBadge, StatusBadge } from '../../components/ui/Badge';
import { clsx } from 'clsx';
import type { Task, CreateTaskData, UpdateTaskData, TaskPriority, TaskStatus } from '../../types';

interface TaskFormData {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  due_date: string;
}

interface TaskFormProps {
  task?: Task | null;
  onSubmit: (data: CreateTaskData | UpdateTaskData) => void;
  onCancel: () => void;
  loading?: boolean;
  className?: string;
}

const TaskForm: React.FC<TaskFormProps> = ({
  task = null,
  onSubmit,
  onCancel,
  loading = false,
  className,
}) => {
  const isEditing = Boolean(task);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    watch,
    setValue,
  } = useForm<TaskFormData>({
    defaultValues: {
      title: task?.title || '',
      description: task?.description || '',
      status: task?.status || 'pending',
      priority: task?.priority || 'medium',
      due_date: task?.due_date ? new Date(task.due_date).toISOString().split('T')[0] : '',
    },
  });

  // Watch para cambios en tiempo real
  const watchedPriority = watch('priority');
  const watchedStatus = watch('status');
  const watchedTitle = watch('title');

  // Reiniciar formulario cuando cambie la tarea
  useEffect(() => {
    if (task) {
      reset({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'pending',
        priority: task.priority || 'medium',
        due_date: task.due_date ? new Date(task.due_date).toISOString().split('T')[0] : '',
      });
    }
  }, [task, reset]);

  // Manejar envío del formulario
  const handleFormSubmit = (data: TaskFormData) => {
    const formattedData: CreateTaskData | UpdateTaskData = {
      ...data,
      due_date: data.due_date || undefined,
      description: data.description || undefined,
    };
    
    onSubmit(formattedData);
  };

  // Configuración de prioridades
  const priorityOptions: Array<{
    value: TaskPriority;
    label: string;
    icon: string;
    description: string;
  }> = [
    { value: 'high', label: 'Alta', icon: '🔴', description: 'Urgente y importante' },
    { value: 'medium', label: 'Media', icon: '🟡', description: 'Importante pero no urgente' },
    { value: 'low', label: 'Baja', icon: '🟢', description: 'Puede esperar' },
  ];

  // Configuración de estados
  const statusOptions: Array<{
    value: TaskStatus;
    label: string;
    icon: string;
    description: string;
  }> = [
    { value: 'pending', label: 'Pendiente', icon: '⏳', description: 'Tarea por realizar' },
    { value: 'completed', label: 'Completada', icon: '✅', description: 'Tarea finalizada' },
  ];

  // Estilos de prioridad
  const priorityColors: Record<TaskPriority, string> = {
    high: 'border-error-200 bg-error-50 text-error-700 hover:border-error-300',
    medium: 'border-warning-200 bg-warning-50 text-warning-700 hover:border-warning-300',
    low: 'border-success-200 bg-success-50 text-success-700 hover:border-success-300',
  };

  // Estilos de estado
  const statusColors: Record<TaskStatus, string> = {
    pending: 'border-primary-200 bg-primary-50 text-primary-700 hover:border-primary-300',
    completed: 'border-success-200 bg-success-50 text-success-700 hover:border-success-300',
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={clsx('space-y-6', className)}
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Título */}
        <Input
          label="Título de la tarea"
          placeholder="Ej: Completar informe mensual..."
          icon={<FileText className="w-5 h-5" />}
          error={errors.title?.message}
          {...register('title', {
            required: 'El título es obligatorio',
            minLength: {
              value: 3,
              message: 'El título debe tener al menos 3 caracteres',
            },
            maxLength: {
              value: 255,
              message: 'El título no puede exceder 255 caracteres',
            },
          })}
        />

        {/* Descripción */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-slate-700">
            Descripción
            <span className="text-slate-400 font-normal ml-1">(opcional)</span>
          </label>
          <textarea
            placeholder="Describe los detalles, objetivos o pasos necesarios para completar esta tarea..."
            rows={4}
            className={clsx(
              'input-base resize-none',
              errors.description && 'input-error'
            )}
            {...register('description', {
              maxLength: {
                value: 1000,
                message: 'La descripción no puede exceder 1000 caracteres',
              },
            })}
          />
          {errors.description && (
            <p className="text-sm text-error-600">{errors.description.message}</p>
          )}
          <p className="text-xs text-slate-500">
            {watch('description')?.length || 0}/1000 caracteres
          </p>
        </div>

        {/* Grid de campos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Prioridad */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-slate-700">
              Prioridad *
            </label>
            <div className="space-y-2">
              {priorityOptions.map((priority) => (
                <motion.button
                  key={priority.value}
                  type="button"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className={clsx(
                    'w-full p-4 rounded-lg border-2 text-sm transition-all duration-200',
                    'flex items-center gap-3 text-left',
                    watchedPriority === priority.value
                      ? priorityColors[priority.value]
                      : 'border-slate-200 hover:border-slate-300 text-slate-600 hover:bg-slate-50'
                  )}
                  onClick={() => setValue('priority', priority.value)}
                >
                  <span className="text-lg">{priority.icon}</span>
                  <div className="flex-1">
                    <div className="font-medium">{priority.label}</div>
                    <div className="text-xs opacity-75">{priority.description}</div>
                  </div>
                  {watchedPriority === priority.value && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-2 h-2 bg-current rounded-full"
                    />
                  )}
                </motion.button>
              ))}
            </div>
            <input
              type="hidden"
              {...register('priority', { required: 'La prioridad es obligatoria' })}
            />
          </div>

          {/* Estado */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-slate-700">
              Estado *
            </label>
            <div className="space-y-2">
              {statusOptions.map((status) => (
                <motion.button
                  key={status.value}
                  type="button"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className={clsx(
                    'w-full p-4 rounded-lg border-2 text-sm transition-all duration-200',
                    'flex items-center gap-3 text-left',
                    watchedStatus === status.value
                      ? statusColors[status.value]
                      : 'border-slate-200 hover:border-slate-300 text-slate-600 hover:bg-slate-50'
                  )}
                  onClick={() => setValue('status', status.value)}
                >
                  <span className="text-lg">{status.icon}</span>
                  <div className="flex-1">
                    <div className="font-medium">{status.label}</div>
                    <div className="text-xs opacity-75">{status.description}</div>
                  </div>
                  {watchedStatus === status.value && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-2 h-2 bg-current rounded-full"
                    />
                  )}
                </motion.button>
              ))}
            </div>
            <input
              type="hidden"
              {...register('status', { required: 'El estado es obligatorio' })}
            />
          </div>
        </div>

        {/* Fecha de vencimiento */}
        <Input
          label="Fecha de vencimiento"
          type="date"
          icon={<Calendar className="w-5 h-5" />}
          helperText="Opcional: establece una fecha límite para esta tarea"
          min={new Date().toISOString().split('T')[0]}
          {...register('due_date')}
        />

        {/* Botones de acción */}
        <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-200">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            icon={<X className="w-4 h-4" />}
            disabled={loading}
          >
            Cancelar
          </Button>
          
          <Button
            type="submit"
            variant="primary"
            loading={loading}
            disabled={!isValid || loading}
            icon={<Save className="w-4 h-4" />}
          >
            {isEditing ? 'Actualizar Tarea' : 'Crear Tarea'}
          </Button>
        </div>
      </form>

      {/* Vista previa en tiempo real */}
      {watchedTitle && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 p-6 bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl border border-slate-200"
        >
          <h4 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
            <span>👀</span>
            Vista previa de la tarea
          </h4>
          
          <div className="space-y-3">
            <div>
              <h5 className="font-medium text-slate-900 text-lg">
                {watchedTitle || 'Sin título'}
              </h5>
              {watch('description') && (
                <p className="text-slate-600 mt-1 text-sm">
                  {watch('description')}
                </p>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              <PriorityBadge priority={watchedPriority} animated />
              <StatusBadge status={watchedStatus} animated />
              
              {watch('due_date') && (
                <span className="badge-base bg-blue-100 text-blue-800 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(watch('due_date')).toLocaleDateString('es-ES', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                </span>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default TaskForm;