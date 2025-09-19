import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  ArrowRight, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Calendar,
  TrendingUp,
  Users,
  BarChart3
} from 'lucide-react';
import { useTasks } from '@/hooks/useTasks';
import TaskCard from '@/components/tasks/TaskCard';
import TaskStatsComponent from '@/components/tasks/TaskStats';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { clsx } from 'clsx';
import type { Task } from '@/types';

const Dashboard: React.FC = () => {
  const {
    tasks,
    stats,
    loading,
    tasksByStatus,
    tasksByPriority,
    toggleTask,
  } = useTasks();

  // Obtener las tareas más recientes y importantes
  const recentTasks = tasks
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 6);

  const urgentTasks = tasks
    .filter(task => task.status === 'pending' && task.priority === 'high')
    .slice(0, 4);

  // Datos para el widget de actividad reciente
  const activityData = [
    { icon: CheckCircle, text: 'Tareas completadas hoy', value: '5', color: 'text-success-600' },
    { icon: Plus, text: 'Tareas creadas', value: '3', color: 'text-primary-600' },
    { icon: AlertTriangle, text: 'Tareas vencidas', value: '1', color: 'text-error-600' },
    { icon: Clock, text: 'Tiempo promedio', value: '2.5h', color: 'text-warning-600' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-96">
            <LoadingSpinner size="lg" text="Cargando dashboard..." />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header con saludo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                ¡Bienvenido de vuelta! 👋
              </h1>
              <p className="text-slate-600">
                Aquí tienes un resumen de tu productividad y tareas pendientes
              </p>
            </div>
            
            <Link to="/tasks">
              <Button
                variant="primary"
                size="lg"
                icon={<Plus className="w-5 h-5" />}
              >
                Nueva Tarea
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Estadísticas principales */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <TaskStatsComponent stats={stats} />
        </motion.div>

        {/* Grid principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna izquierda - Tareas urgentes */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Tareas urgentes */}
            <div className="card-base p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-error-500" />
                  <h2 className="text-xl font-semibold text-slate-900">
                    Tareas Urgentes
                  </h2>
                  <Badge variant="error">{urgentTasks.length}</Badge>
                </div>
                
                <Link to="/tasks?priority=high&status=pending">
                  <Button variant="ghost" size="sm" icon={<ArrowRight className="w-4 h-4" />}>
                    Ver todas
                  </Button>
                </Link>
              </div>

              {urgentTasks.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-2">🎉</div>
                  <p className="text-slate-600">¡No tienes tareas urgentes!</p>
                  <p className="text-sm text-slate-500">Excelente trabajo manteniendo todo bajo control</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {urgentTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onToggle={toggleTask}
                      className="border-error-200 bg-error-50/50"
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Tareas recientes */}
            <div className="card-base p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary-500" />
                  <h2 className="text-xl font-semibold text-slate-900">
                    Actividad Reciente
                  </h2>
                </div>
                
                <Link to="/tasks">
                  <Button variant="ghost" size="sm" icon={<ArrowRight className="w-4 h-4" />}>
                    Ver todas
                  </Button>
                </Link>
              </div>

              <div className="space-y-3">
                {recentTasks.slice(0, 4).map((task) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <button
                      onClick={() => toggleTask(task.id)}
                      className={clsx(
                        'w-4 h-4 rounded border-2 flex items-center justify-center transition-colors',
                        task.status === 'completed'
                          ? 'bg-success-500 border-success-500 text-white'
                          : 'border-slate-300 hover:border-primary-400'
                      )}
                    >
                      {task.status === 'completed' && (
                        <CheckCircle className="w-3 h-3" />
                      )}
                    </button>
                    
                    <div className="flex-1 min-w-0">
                      <p className={clsx(
                        'text-sm font-medium truncate',
                        task.status === 'completed' 
                          ? 'line-through text-slate-500' 
                          : 'text-slate-900'
                      )}>
                        {task.title}
                      </p>
                      <p className="text-xs text-slate-500">
                        {new Date(task.created_at).toLocaleDateString('es-ES')}
                      </p>
                    </div>
                    
                    <Badge
                      variant={
                        task.priority === 'high' ? 'error' :
                        task.priority === 'medium' ? 'warning' : 'success'
                      }
                      size="xs"
                    >
                      {task.priority === 'high' ? 'Alta' :
                       task.priority === 'medium' ? 'Media' : 'Baja'}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Columna derecha - Widgets */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            {/* Widget de progreso diario */}
            <div className="card-base p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-success-500" />
                <h3 className="font-semibold text-slate-900">Progreso de Hoy</h3>
              </div>

              <div className="text-center mb-4">
                <div className="text-3xl font-bold text-success-600 mb-1">
                  {Math.round((stats.completed_tasks / Math.max(stats.total_tasks, 1)) * 100)}%
                </div>
                <p className="text-sm text-slate-600">
                  {stats.completed_tasks} de {stats.total_tasks} tareas completadas
                </p>
              </div>

              <div className="w-full bg-slate-200 rounded-full h-2 mb-4">
                <motion.div
                  className="bg-success-500 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ 
                    width: `${Math.round((stats.completed_tasks / Math.max(stats.total_tasks, 1)) * 100)}%` 
                  }}
                  transition={{ delay: 0.5, duration: 1 }}
                />
              </div>

              <p className="text-xs text-slate-500 text-center">
                {stats.completed_tasks === stats.total_tasks && stats.total_tasks > 0
                  ? '¡Excelente! Has completado todas tus tareas 🎉'
                  : stats.completed_tasks > stats.total_tasks / 2
                  ? '¡Buen progreso! Sigue así 💪'
                  : 'Puedes hacerlo, paso a paso 🚀'
                }
              </p>
            </div>

            {/* Widget de calendario/próximos vencimientos */}
            <div className="card-base p-6">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-primary-500" />
                <h3 className="font-semibold text-slate-900">Próximos Vencimientos</h3>
              </div>

              <div className="space-y-3">
                {tasks
                  .filter(task => task.due_date && task.status === 'pending')
                  .sort((a, b) => new Date(a.due_date!).getTime() - new Date(b.due_date!).getTime())
                  .slice(0, 3)
                  .map((task) => {
                    const daysUntilDue = Math.ceil(
                      (new Date(task.due_date!).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                    );
                    
                    return (
                      <div key={task.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                        <div className={clsx(
                          'w-2 h-2 rounded-full',
                          daysUntilDue < 0 ? 'bg-error-500' :
                          daysUntilDue <= 1 ? 'bg-warning-500' :
                          'bg-success-500'
                        )} />
                        
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-900 truncate">
                            {task.title}
                          </p>
                          <p className="text-xs text-slate-500">
                            {daysUntilDue < 0 
                              ? `Vencida hace ${Math.abs(daysUntilDue)} días`
                              : daysUntilDue === 0 
                              ? 'Vence hoy'
                              : daysUntilDue === 1
                              ? 'Vence mañana'
                              : `Vence en ${daysUntilDue} días`
                            }
                          </p>
                        </div>
                      </div>
                    );
                  })}
                
                {tasks.filter(task => task.due_date && task.status === 'pending').length === 0 && (
                  <div className="text-center py-4">
                    <div className="text-2xl mb-1">📅</div>
                    <p className="text-sm text-slate-600">No hay vencimientos próximos</p>
                  </div>
                )}
              </div>
            </div>

            {/* Widget de métricas rápidas */}
            <div className="card-base p-6">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="w-5 h-5 text-primary-500" />
                <h3 className="font-semibold text-slate-900">Métricas Rápidas</h3>
              </div>

              <div className="space-y-3">
                {activityData.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <item.icon className={clsx('w-4 h-4', item.color)} />
                      <span className="text-sm text-slate-600">{item.text}</span>
                    </div>
                    <span className="text-sm font-medium text-slate-900">{item.value}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Call to action */}
            <div className="card-base p-6 bg-gradient-to-br from-primary-50 to-blue-50 border-primary-200">
              <div className="text-center">
                <div className="text-3xl mb-2">🚀</div>
                <h3 className="font-semibold text-slate-900 mb-2">
                  ¿Listo para ser más productivo?
                </h3>
                <p className="text-sm text-slate-600 mb-4">
                  Organiza tus tareas y alcanza tus objetivos
                </p>
                <Link to="/tasks">
                  <Button variant="primary" fullWidth>
                    Ir a mis tareas
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;