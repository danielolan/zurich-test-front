import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  TrendingUp,
  Target,
  BarChart3,
  Activity
} from 'lucide-react';
import type { TaskStats } from '@/types';

interface TaskStatsProps {
  stats: TaskStats;
  loading?: boolean;
  className?: string;
}

const TaskStatsComponent: React.FC<TaskStatsProps> = ({
  stats,
  loading = false,
  className,
}) => {
  // Calcular porcentajes
  const completionRate = stats.total_tasks > 0 
    ? Math.round((stats.completed_tasks / stats.total_tasks) * 100)
    : 0;

  const pendingRate = stats.total_tasks > 0 
    ? Math.round((stats.pending_tasks / stats.total_tasks) * 100)
    : 0;

  const highPriorityRate = stats.total_tasks > 0 
    ? Math.round((stats.high_priority_tasks / stats.total_tasks) * 100)
    : 0;

  // Configuración de las estadísticas
  const statsConfig = [
    {
      title: 'Total de Tareas',
      value: stats.total_tasks,
      icon: BarChart3,
      color: 'bg-primary-500',
      bgColor: 'bg-primary-50',
      textColor: 'text-primary-700',
      description: 'Tareas en total'
    },
    {
      title: 'Completadas',
      value: stats.completed_tasks,
      percentage: completionRate,
      icon: CheckCircle,
      color: 'bg-success-500',
      bgColor: 'bg-success-50',
      textColor: 'text-success-700',
      description: `${completionRate}% del total`
    },
    {
      title: 'Pendientes',
      value: stats.pending_tasks,
      percentage: pendingRate,
      icon: Clock,
      color: 'bg-warning-500',
      bgColor: 'bg-warning-50',
      textColor: 'text-warning-700',
      description: `${pendingRate}% del total`
    },
    {
      title: 'Alta Prioridad',
      value: stats.high_priority_tasks,
      percentage: highPriorityRate,
      icon: AlertTriangle,
      color: 'bg-error-500',
      bgColor: 'bg-error-50',
      textColor: 'text-error-700',
      description: `${highPriorityRate}% del total`
    }
  ];

  if (loading) {
    return (
      <div className={clsx('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4', className)}>
        {[...Array(4)].map((_, index) => (
          <div key={index} className="card-base p-6 animate-pulse">
            <div className="flex items-center justify-between mb-4">
              <div className="w-8 h-8 bg-slate-200 rounded-lg" />
              <div className="w-12 h-6 bg-slate-200 rounded" />
            </div>
            <div className="space-y-2">
              <div className="w-20 h-8 bg-slate-200 rounded" />
              <div className="w-full h-4 bg-slate-200 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={clsx('space-y-6', className)}>
      {/* Estadísticas principales */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ staggerChildren: 0.1 }}
      >
        {statsConfig.map((stat, index) => (
          <motion.div
            key={stat.title}
            className={clsx(
              'card-base p-6 relative overflow-hidden',
              stat.bgColor
            )}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -2 }}
          >
            {/* Fondo decorativo */}
            <div className="absolute top-0 right-0 w-20 h-20 opacity-10">
              <stat.icon className="w-full h-full" />
            </div>

            {/* Contenido */}
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className={clsx('p-2 rounded-lg', stat.color)}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
                
                {stat.percentage !== undefined && (
                  <div className={clsx('px-2 py-1 rounded-full text-xs font-medium', stat.bgColor, stat.textColor)}>
                    {stat.percentage}%
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <motion.div
                  className={clsx('text-2xl font-bold', stat.textColor)}
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 + 0.2, type: 'spring' }}
                >
                  {stat.value.toLocaleString()}
                </motion.div>
                
                <div className="text-sm font-medium text-slate-600">
                  {stat.title}
                </div>
                
                <div className="text-xs text-slate-500">
                  {stat.description}
                </div>
              </div>

              {/* Barra de progreso para porcentajes */}
              {stat.percentage !== undefined && (
                <div className="mt-3">
                  <div className="w-full bg-slate-200 rounded-full h-1.5">
                    <motion.div
                      className={clsx('h-1.5 rounded-full', stat.color)}
                      initial={{ width: 0 }}
                      animate={{ width: `${stat.percentage}%` }}
                      transition={{ delay: index * 0.1 + 0.5, duration: 0.8 }}
                    />
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Estadísticas adicionales */}
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        {/* Distribución por prioridad */}
        <div className="card-base p-6">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-primary-500" />
            <h3 className="font-semibold text-slate-900">Distribución por Prioridad</h3>
          </div>

          <div className="space-y-3">
            {[
              { label: 'Alta', value: stats.high_priority_tasks, color: 'bg-error-500', bgColor: 'bg-error-100' },
              { label: 'Media', value: stats.medium_priority_tasks, color: 'bg-warning-500', bgColor: 'bg-warning-100' },
              { label: 'Baja', value: stats.low_priority_tasks, color: 'bg-success-500', bgColor: 'bg-success-100' }
            ].map((priority, index) => {
              const percentage = stats.total_tasks > 0 
                ? Math.round((priority.value / stats.total_tasks) * 100)
                : 0;

              return (
                <div key={priority.label} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">{priority.label}</span>
                    <span className="font-medium text-slate-900">
                      {priority.value} ({percentage}%)
                    </span>
                  </div>
                  <div className={clsx('w-full rounded-full h-2', priority.bgColor)}>
                    <motion.div
                      className={clsx('h-2 rounded-full', priority.color)}
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ delay: 0.7 + index * 0.1, duration: 0.6 }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Métricas de productividad */}
        <div className="card-base p-6">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-primary-500" />
            <h3 className="font-semibold text-slate-900">Métricas de Productividad</h3>
          </div>

          <div className="space-y-4">
            {/* Tasa de finalización */}
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div>
                <div className="text-sm font-medium text-slate-900">Tasa de Finalización</div>
                <div className="text-xs text-slate-500">Tareas completadas vs. total</div>
              </div>
              <div className="text-right">
                <div className={clsx(
                  'text-lg font-bold',
                  completionRate >= 70 ? 'text-success-600' :
                  completionRate >= 40 ? 'text-warning-600' :
                  'text-error-600'
                )}>
                  {completionRate}%
                </div>
                <div className="text-xs text-slate-500">
                  {stats.completed_tasks}/{stats.total_tasks}
                </div>
              </div>
            </div>

            {/* Tareas pendientes */}
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div>
                <div className="text-sm font-medium text-slate-900">Carga de Trabajo</div>
                <div className="text-xs text-slate-500">Tareas pendientes</div>
              </div>
              <div className="text-right">
                <div className={clsx(
                  'text-lg font-bold',
                  stats.pending_tasks <= 5 ? 'text-success-600' :
                  stats.pending_tasks <= 10 ? 'text-warning-600' :
                  'text-error-600'
                )}>
                  {stats.pending_tasks}
                </div>
                <div className="text-xs text-slate-500">
                  {stats.pending_tasks === 0 ? '¡Excelente!' :
                   stats.pending_tasks <= 5 ? 'Manejable' :
                   stats.pending_tasks <= 10 ? 'Ocupado' : 'Sobrecargado'}
                </div>
              </div>
            </div>

            {/* Indicador general */}
            <div className="pt-3 border-t border-slate-200">
              <div className="flex items-center gap-2">
                <TrendingUp className={clsx(
                  'w-4 h-4',
                  completionRate >= 70 ? 'text-success-500' :
                  completionRate >= 40 ? 'text-warning-500' :
                  'text-error-500'
                )} />
                <span className="text-sm font-medium text-slate-700">
                  {completionRate >= 70 ? '¡Excelente productividad!' :
                   completionRate >= 40 ? 'Buen progreso, sigue así' :
                   'Hay oportunidades de mejora'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TaskStatsComponent;