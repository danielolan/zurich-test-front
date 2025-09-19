import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { 
  Clock, 
  Edit3, 
  Trash2, 
  Check, 
  AlertCircle, 
  Calendar,
  User,
  MoreVertical
} from 'lucide-react';
import { format, isAfter, isBefore, addDays } from 'date-fns';
import { es } from 'date-fns/locale';
import Button from '../../components/ui/Button';
import { StatusBadge, PriorityBadge } from '../../components/ui/Badge';
import type { Task } from '../../types';

interface TaskCardProps {
  task: Task;
  onEdit?: (task: Task) => void;
  onDelete?: (id: string) => void;
  onToggle?: (id: string) => void;
  className?: string;
}

type TaskVisualStatus = 'completed' | 'overdue' | 'due-soon' | 'normal';

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onEdit,
  onDelete,
  onToggle,
  className,
}) => {
  const [showActions, setShowActions] = useState(false);
  const [isActionsOpen, setIsActionsOpen] = useState(false);

  // Determinar el estado visual de la tarea
  const getTaskStatus = (): TaskVisualStatus => {
    if (task.status === 'completed') return 'completed';
    
    if (task.due_date) {
      const dueDate = new Date(task.due_date);
      const now = new Date();
      const tomorrow = addDays(now, 1);
      
      if (isBefore(dueDate, now)) return 'overdue';
      if (isBefore(dueDate, tomorrow)) return 'due-soon';
    }
    
    return 'normal';
  };

  const taskStatus = getTaskStatus();

  // Estilos según el estado
  const statusStyles: Record<TaskVisualStatus, {
    card: string;
    badge: string;
    text: string;
  }> = {
    completed: {
      card: 'bg-success-50 border-success-200 shadow-success/20',
      badge: 'badge-success',
      text: 'text-success-700',
    },
    overdue: {
      card: 'bg-error-50 border-error-200 shadow-error/20',
      badge: 'badge-error',
      text: 'text-error-700',
    },
    'due-soon': {
      card: 'bg-warning-50 border-warning-200 shadow-warning/20',
      badge: 'badge-warning',
      text: 'text-warning-700',
    },
    normal: {
      card: 'bg-white border-slate-200',
      badge: 'badge-secondary',
      text: 'text-slate-600',
    },
  };

  // Formatear fecha
  const formatDate = (date?: string): string | null => {
    if (!date) return null;
    try {
      return format(new Date(date), 'dd MMM yyyy', { locale: es });
    } catch {
      return null;
    }
  };

  // Manejar toggle de estado
  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggle?.(task.id);
  };

  // Manejar edición
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsActionsOpen(false);
    onEdit?.(task);
  };

  // Manejar eliminación
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsActionsOpen(false);
    onDelete?.(task.id);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className={clsx(
        'card-base p-4 group cursor-pointer relative overflow-hidden',
        statusStyles[taskStatus].card,
        task.status === 'completed' && 'opacity-75',
        className
      )}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => {
        setShowActions(false);
        setIsActionsOpen(false);
      }}
    >
      {/* Indicador de prioridad */}
      <div 
        className={clsx(
          'absolute left-0 top-0 w-1 h-full',
          task.priority === 'high' && 'bg-error-500',
          task.priority === 'medium' && 'bg-warning-500',
          task.priority === 'low' && 'bg-success-500'
        )}
      />

      {/* Header con checkbox y acciones */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          {/* Checkbox */}
          <button
            onClick={handleToggle}
            className={clsx(
              'mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200',
              task.status === 'completed'
                ? 'bg-success-500 border-success-500 text-white'
                : 'border-slate-300 hover:border-primary-400 hover:bg-primary-50'
            )}
          >
            {task.status === 'completed' && (
              <Check className="w-3 h-3" />
            )}
          </button>

          {/* Título y descripción */}
          <div className="flex-1 min-w-0">
            <h3 
              className={clsx(
                'font-medium text-slate-900 line-clamp-2',
                task.status === 'completed' && 'line-through text-slate-500'
              )}
            >
              {task.title}
            </h3>
            
            {task.description && (
              <p className="text-sm text-slate-600 mt-1 line-clamp-2">
                {task.description}
              </p>
            )}
          </div>
        </div>

        {/* Acciones */}
        <AnimatePresence>
          {(showActions || isActionsOpen) && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="relative"
            >
              <Button
                variant="ghost"
                size="sm"
                icon={<MoreVertical className="w-4 h-4" />}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsActionsOpen(!isActionsOpen);
                }}
                className="text-slate-400 hover:text-slate-600"
              />

              {/* Dropdown de acciones */}
              <AnimatePresence>
                {isActionsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-strong border border-slate-200 py-1 z-20 min-w-[120px]"
                  >
                    <button
                      onClick={handleEdit}
                      className="w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <Edit3 className="w-4 h-4" />
                      Editar
                    </button>
                    <button
                      onClick={handleDelete}
                      className="w-full px-3 py-2 text-left text-sm text-error-600 hover:bg-error-50 flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Eliminar
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer con metadatos */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          {/* Badge de prioridad */}
          <PriorityBadge priority={task.priority} />

          {/* Badge de estado personalizado */}
          {taskStatus !== 'normal' && taskStatus !== 'completed' && (
            <span className={clsx('badge-base', statusStyles[taskStatus].badge)}>
              {taskStatus === 'overdue' && '⏰ Vencida'}
              {taskStatus === 'due-soon' && '⚠️ Vence pronto'}
            </span>
          )}
        </div>

        {/* Información adicional */}
        <div className="flex items-center gap-3 text-slate-500">
          {/* Usuario asignado */}
          {task.username && (
            <div className="flex items-center gap-1">
              <User className="w-3 h-3" />
              <span>{task.username}</span>
            </div>
          )}

          {/* Fecha de vencimiento */}
          {task.due_date && (
            <div className={clsx(
              'flex items-center gap-1',
              taskStatus === 'overdue' && 'text-error-600',
              taskStatus === 'due-soon' && 'text-warning-600'
            )}>
              <Calendar className="w-3 h-3" />
              <span>{formatDate(task.due_date)}</span>
            </div>
          )}

          {/* Indicador de tiempo */}
          {task.created_at && (
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{formatDate(task.created_at)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Indicador de estado visual */}
      {taskStatus === 'overdue' && (
        <div className="absolute top-2 right-2">
          <AlertCircle className="w-4 h-4 text-error-500" />
        </div>
      )}

      {/* Efecto de hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary-500/0 to-primary-500/0 group-hover:from-primary-500/5 group-hover:to-transparent transition-all duration-300 pointer-events-none" />
    </motion.div>
  );
};

export default TaskCard;