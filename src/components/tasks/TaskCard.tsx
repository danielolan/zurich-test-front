import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import {
  Clock,
  Edit3,
  Trash2,
  Check,
  AlertCircle,
  Calendar,
  User,
  MoreVertical,
} from 'lucide-react';
import { format, isBefore, addDays } from 'date-fns';
import { es } from 'date-fns/locale';
import Button from '../../components/ui/Button';
import { PriorityBadge } from '../../components/ui/Badge';
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

  // Estado visual de la tarea
  const getTaskStatus = (): TaskVisualStatus => {
    if (task.status === 'completed') return 'completed';

    if (task.due_date) {
      const dueDate = new Date(task.due_date);
      const now = new Date();
      const tomorrow = addDays(now, 1);

      if (!isNaN(dueDate.getTime())) {
        if (isBefore(dueDate, now)) return 'overdue';
        if (isBefore(dueDate, tomorrow)) return 'due-soon';
      }
    }

    return 'normal';
  };

  const taskStatus = getTaskStatus();

  // Estilos mejorados con mejor contraste
  const statusStyles: Record<
    TaskVisualStatus,
    { 
      card: string; 
      border: string; 
      accent: string;
      text: string;
    }
  > = {
    completed: {
      card: 'bg-white border-green-200',
      border: 'border-l-4 border-l-green-500',
      accent: 'bg-green-500',
      text: 'text-green-700',
    },
    overdue: {
      card: 'bg-white border-red-200',
      border: 'border-l-4 border-l-red-500',
      accent: 'bg-red-500',
      text: 'text-red-700',
    },
    'due-soon': {
      card: 'bg-white border-yellow-200',
      border: 'border-l-4 border-l-yellow-500',
      accent: 'bg-yellow-500',
      text: 'text-yellow-700',
    },
    normal: {
      card: 'bg-white border-slate-200',
      border: 'border-l-4 border-l-slate-300',
      accent: 'bg-slate-400',
      text: 'text-slate-600',
    },
  };

  // Formateo de fecha seguro
  const formatDate = (date?: string): string | null => {
    if (!date) return null;
    const d = new Date(date);
    if (isNaN(d.getTime())) return null;
    return format(d, 'dd MMM yyyy', { locale: es });
  };

  // Handlers
  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (task.id) onToggle?.(task.id);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsActionsOpen(false);
    onEdit?.(task);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsActionsOpen(false);
    if (task.id) onDelete?.(task.id);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      whileHover={{ y: -2, shadow: "0 8px 25px -8px rgba(0, 0, 0, 0.1)" }}
      transition={{ duration: 0.2 }}
      className={clsx(
        // Fondo blanco siempre para mejor legibilidad
        'bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200',
        'border-2 group cursor-pointer relative overflow-hidden',
        statusStyles[taskStatus].card,
        statusStyles[taskStatus].border,
        task.status === 'completed' && 'opacity-80',
        className
      )}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => {
        setShowActions(false);
        setIsActionsOpen(false);
      }}
    >
      {/* Indicador de prioridad - Más visible */}
      <div
        className={clsx(
          'absolute right-0 top-0 w-3 h-3 rounded-bl-lg',
          task.priority === 'high' && 'bg-red-500',
          task.priority === 'medium' && 'bg-yellow-500',
          task.priority === 'low' && 'bg-green-500'
        )}
      />

      {/* Contenido principal */}
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            {/* Checkbox mejorado */}
            <button
              onClick={handleToggle}
              className={clsx(
                'mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 flex-shrink-0',
                task.status === 'completed'
                  ? 'bg-green-500 border-green-500 text-white shadow-sm'
                  : 'border-slate-300 hover:border-blue-400 hover:bg-blue-50'
              )}
              aria-label={
                task.status === 'completed'
                  ? 'Marcar como pendiente'
                  : 'Marcar como completada'
              }
            >
              {task.status === 'completed' && <Check className="w-3 h-3" />}
            </button>

            {/* Título y descripción */}
            <div className="flex-1 min-w-0">
              <h3
                className={clsx(
                  'font-semibold text-slate-900 mb-1',
                  task.status === 'completed' && 'line-through text-slate-600'
                )}
                title={task.title ?? ''}
              >
                {task.title ?? 'Sin título'}
              </h3>

              {task.description && (
                <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
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
                className="relative ml-2 flex-shrink-0"
              >
                <Button
                  variant="ghost"
                  size="sm"
                  icon={<MoreVertical className="w-4 h-4" />}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsActionsOpen((o) => !o);
                  }}
                  className="text-slate-500 hover:text-slate-700 hover:bg-slate-100"
                  aria-label="Abrir acciones"
                />

                {/* Dropdown */}
                <AnimatePresence>
                  {isActionsOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-20 min-w-[140px]"
                    >
                      <button
                        onClick={handleEdit}
                        className="w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                      >
                        <Edit3 className="w-4 h-4 text-blue-500" />
                        Editar
                      </button>
                      <button
                        onClick={handleDelete}
                        className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
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
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PriorityBadge priority={task.priority} />

            {/* Badge de estado */}
            {taskStatus !== 'normal' && taskStatus !== 'completed' && (
              <span className={clsx(
                'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                taskStatus === 'overdue' && 'bg-red-100 text-red-700',
                taskStatus === 'due-soon' && 'bg-yellow-100 text-yellow-700'
              )}>
                {taskStatus === 'overdue' && '⏰ Vencida'}
                {taskStatus === 'due-soon' && '⚠️ Vence pronto'}
              </span>
            )}
          </div>

          {/* Metadatos con iconos */}
          <div className="flex items-center gap-3 text-xs text-slate-500">
            {task.username && (
              <div className="flex items-center gap-1" title="Asignado a">
                <User className="w-3 h-3" />
                <span className="font-medium">{task.username}</span>
              </div>
            )}

            {task.due_date && (
              <div
                className={clsx(
                  'flex items-center gap-1 font-medium',
                  taskStatus === 'overdue' && 'text-red-600',
                  taskStatus === 'due-soon' && 'text-yellow-600'
                )}
                title="Fecha de vencimiento"
              >
                <Calendar className="w-3 h-3" />
                <span>{formatDate(task.due_date) ?? '—'}</span>
              </div>
            )}

            {task.created_at && (
              <div className="flex items-center gap-1" title="Fecha de creación">
                <Clock className="w-3 h-3" />
                <span>{formatDate(task.created_at) ?? '—'}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Indicador de estado visual en esquina */}
      {taskStatus === 'overdue' && (
        <div className="absolute top-2 right-8">
          <AlertCircle className="w-4 h-4 text-red-500" />
        </div>
      )}

      {/* Efecto de hover sutil */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-blue-500/0 group-hover:from-blue-500/2 group-hover:to-transparent transition-all duration-300 pointer-events-none rounded-lg" />
    </motion.div>
  );
};

export default TaskCard;