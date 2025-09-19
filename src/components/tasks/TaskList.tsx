import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { Plus, Filter, Search, LayoutGrid, List, SortAsc, SortDesc } from 'lucide-react';
import TaskCard from './TaskCard';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';
import type { Task, TaskFilters, TasksByStatus } from '../../types';

interface TaskListProps {
  tasks: Task[];
  tasksByStatus: TasksByStatus;
  loading: boolean;
  error: string | null;
  filters: TaskFilters;
  isEmpty: boolean;
  hasFilters: boolean;
  onTaskEdit: (task: Task) => void;
  onTaskDelete: (id: string) => void;
  onTaskToggle: (id: string) => void;
  onCreateTask: () => void;
  onFiltersChange: (filters: Partial<TaskFilters>) => void;
  onClearFilters: () => void;
  className?: string;
}

type ViewMode = 'grid' | 'list' | 'kanban';

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  tasksByStatus,
  loading,
  error,
  filters,
  isEmpty,
  hasFilters,
  onTaskEdit,
  onTaskDelete,
  onTaskToggle,
  onCreateTask,
  onFiltersChange,
  onClearFilters,
  className,
}) => {
  const [viewMode, setViewMode] = React.useState<ViewMode>('grid');
  const [showFilters, setShowFilters] = React.useState(false);
console.log(tasks,"-----tasks-----");
  // Contenedor de animaciones para las tareas
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  // Si está cargando
  if (loading) {
    return (
      <div className={clsx('space-y-6', className)}>
        <TaskListHeader
          filters={filters}
          onFiltersChange={onFiltersChange}
          onCreateTask={onCreateTask}
          onClearFilters={onClearFilters}
          hasFilters={hasFilters}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          viewMode={viewMode}
          setViewMode={setViewMode}
        />
        
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" text="Cargando tareas..." />
        </div>
      </div>
    );
  }

  // Si hay error
  if (error) {
    return (
      <div className={clsx('space-y-6', className)}>
        <TaskListHeader
          filters={filters}
          onFiltersChange={onFiltersChange}
          onCreateTask={onCreateTask}
          onClearFilters={onClearFilters}
          hasFilters={hasFilters}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          viewMode={viewMode}
          setViewMode={setViewMode}
        />
        
        <div className="text-center py-12">
          <div className="text-error-500 text-6xl mb-4">⚠️</div>
          <h3 className="text-lg font-medium text-slate-900 mb-2">
            Error al cargar tareas
          </h3>
          <p className="text-slate-600 mb-4">{error}</p>
          <Button
            variant="primary"
            onClick={() => window.location.reload()}
          >
            Intentar de nuevo
          </Button>
        </div>
      </div>
    );
  }

  // Si está vacío
  if (isEmpty) {
    return (
      <div className={clsx('space-y-6', className)}>
        <TaskListHeader
          filters={filters}
          onFiltersChange={onFiltersChange}
          onCreateTask={onCreateTask}
          onClearFilters={onClearFilters}
          hasFilters={hasFilters}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          viewMode={viewMode}
          setViewMode={setViewMode}
        />
        
        <EmptyState
          hasFilters={hasFilters}
          onCreateTask={onCreateTask}
          onClearFilters={onClearFilters}
        />
      </div>
    );
  }

  return (
    <div className={clsx('space-y-6', className)}>
      <TaskListHeader
        filters={filters}
        onFiltersChange={onFiltersChange}
        onCreateTask={onCreateTask}
        onClearFilters={onClearFilters}
        hasFilters={hasFilters}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      {/* Vista según el modo seleccionado */}
      {viewMode === 'kanban' ? (
        <KanbanView
          tasksByStatus={tasksByStatus}
          onTaskEdit={onTaskEdit}
          onTaskDelete={onTaskDelete}
          onTaskToggle={onTaskToggle}
        />
      ) : (
        <GridView
          tasks={tasks}
          viewMode={viewMode}
          onTaskEdit={onTaskEdit}
          onTaskDelete={onTaskDelete}
          onTaskToggle={onTaskToggle}
        />
      )}
    </div>
  );
};

// Componente del header con filtros
interface TaskListHeaderProps {
  filters: TaskFilters;
  onFiltersChange: (filters: Partial<TaskFilters>) => void;
  onCreateTask: () => void;
  onClearFilters: () => void;
  hasFilters: boolean;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}

const TaskListHeader: React.FC<TaskListHeaderProps> = ({
  filters,
  onFiltersChange,
  onCreateTask,
  onClearFilters,
  hasFilters,
  showFilters,
  setShowFilters,
  viewMode,
  setViewMode,
}) => (
  <div className="space-y-4">
    {/* Barra principal */}
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-4 flex-1">
        {/* Búsqueda */}
        <div className="flex-1 max-w-md">
          <Input
            placeholder="Buscar tareas..."
            icon={<Search className="w-4 h-4" />}
            value={filters.search || ''}
            onChange={(e) => onFiltersChange({ search: e.target.value })}
            fullWidth
          />
        </div>

        {/* Botones de filtro */}
        <Button
          variant={showFilters ? 'primary' : 'secondary'}
          icon={<Filter className="w-4 h-4" />}
          onClick={() => setShowFilters(!showFilters)}
        >
          Filtros
        </Button>

        {hasFilters && (
          <Button
            variant="ghost"
            onClick={onClearFilters}
            className="text-slate-500"
          >
            Limpiar
          </Button>
        )}
      </div>

      {/* Controles de vista y acciones */}
      <div className="flex items-center gap-2">
        {/* Selector de vista */}
        <div className="flex rounded-lg border border-slate-200 p-1">
          <Button
            variant={viewMode === 'grid' ? 'primary' : 'ghost'}
            size="sm"
            icon={<LayoutGrid className="w-4 h-4" />}
            onClick={() => setViewMode('grid')}
            className="px-2"
          />
          <Button
            variant={viewMode === 'list' ? 'primary' : 'ghost'}
            size="sm"
            icon={<List className="w-4 h-4" />}
            onClick={() => setViewMode('list')}
            className="px-2"
          />
          <Button
            variant={viewMode === 'kanban' ? 'primary' : 'ghost'}
            size="sm"
            icon={<LayoutGrid className="w-4 h-4" />}
            onClick={() => setViewMode('kanban')}
            className="px-2"
          />
        </div>

        {/* Botón crear */}
        <Button
          variant="primary"
          icon={<Plus className="w-4 h-4" />}
          onClick={onCreateTask}
        >
          Nueva Tarea
        </Button>
      </div>
    </div>

    {/* Panel de filtros expandido */}
    <AnimatePresence>
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-slate-50 rounded-lg p-4 border border-slate-200"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <select
              value={filters.status || ''}
              onChange={(e) => onFiltersChange({ status: e.target.value as any })}
              className="input-base"
            >
              <option value="">Todos los estados</option>
              <option value="pending">Pendientes</option>
              <option value="completed">Completadas</option>
            </select>

            <select
              value={filters.priority || ''}
              onChange={(e) => onFiltersChange({ priority: e.target.value as any })}
              className="input-base"
            >
              <option value="">Todas las prioridades</option>
              <option value="high">Alta prioridad</option>
              <option value="medium">Media prioridad</option>
              <option value="low">Baja prioridad</option>
            </select>

            <select
              value={filters.sortBy || 'created_at'}
              onChange={(e) => onFiltersChange({ sortBy: e.target.value as any })}
              className="input-base"
            >
              <option value="created_at">Fecha de creación</option>
              <option value="updated_at">Última actualización</option>
              <option value="due_date">Fecha de vencimiento</option>
              <option value="title">Título</option>
              <option value="priority">Prioridad</option>
            </select>

            <Button
              variant="ghost"
              icon={filters.sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
              onClick={() => onFiltersChange({ 
                sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc' 
              })}
              fullWidth
            >
              {filters.sortOrder === 'asc' ? 'Ascendente' : 'Descendente'}
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

// Vista en grilla/lista
interface GridViewProps {
  tasks: Task[];
  viewMode: ViewMode;
  onTaskEdit: (task: Task) => void;
  onTaskDelete: (id: string) => void;
  onTaskToggle: (id: string) => void;
}

const GridView: React.FC<GridViewProps> = ({
  tasks,
  viewMode,
  onTaskEdit,
  onTaskDelete,
  onTaskToggle,
}) => (
  <motion.div
    className={clsx(
      'grid gap-4',
      viewMode === 'grid' 
        ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
        : 'grid-cols-1'
    )}
    variants={{
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.05,
        },
      },
    }}
    initial="hidden"
    animate="visible"
  >
    <AnimatePresence>
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onEdit={onTaskEdit}
          onDelete={onTaskDelete}
          onToggle={onTaskToggle}
          className={viewMode === 'list' ? 'max-w-none' : ''}
        />
      ))}
    </AnimatePresence>
  </motion.div>
);

// Vista Kanban
interface KanbanViewProps {
  tasksByStatus: TasksByStatus;
  onTaskEdit: (task: Task) => void;
  onTaskDelete: (id: string) => void;
  onTaskToggle: (id: string) => void;
}

const KanbanView: React.FC<KanbanViewProps> = ({
  tasksByStatus,
  onTaskEdit,
  onTaskDelete,
  onTaskToggle,
}) => {
  const columns = [
    {
      id: 'pending',
      title: 'Pendientes',
      tasks: tasksByStatus.pending,
      color: 'border-t-primary-500 bg-primary-50/30',
      icon: '⏳',
    },
    {
      id: 'completed',
      title: 'Completadas',
      tasks: tasksByStatus.completed,
      color: 'border-t-success-500 bg-success-50/30',
      icon: '✅',
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {columns.map((column) => (
        <motion.div
          key={column.id}
          className={clsx(
            'bg-white rounded-lg border-2 border-slate-200 border-t-4 overflow-hidden',
            column.color
          )}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {/* Header de columna */}
          <div className="p-4 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">{column.icon}</span>
                <h3 className="font-semibold text-slate-900">{column.title}</h3>
              </div>
              <Badge variant="secondary">
                {column.tasks.length}
              </Badge>
            </div>
          </div>

          {/* Lista de tareas */}
          <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
            <AnimatePresence>
              {column.tasks.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-8 text-slate-500"
                >
                  <div className="text-4xl mb-2">📭</div>
                  <p className="text-sm">No hay tareas {column.id === 'pending' ? 'pendientes' : 'completadas'}</p>
                </motion.div>
              ) : (
                column.tasks.map((task, index) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <TaskCard
                      task={task}
                      onEdit={onTaskEdit}
                      onDelete={onTaskDelete}
                      onToggle={onTaskToggle}
                      className="border-slate-200 hover:border-slate-300"
                    />
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

// Estado vacío
interface EmptyStateProps {
  hasFilters: boolean;
  onCreateTask: () => void;
  onClearFilters: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  hasFilters,
  onCreateTask,
  onClearFilters,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="text-center py-12"
  >
    <div className="text-6xl mb-4">
      {hasFilters ? '🔍' : '📝'}
    </div>
    
    <h3 className="text-xl font-semibold text-slate-900 mb-2">
      {hasFilters ? 'No se encontraron tareas' : '¡Comienza a organizar tus tareas!'}
    </h3>
    
    <p className="text-slate-600 mb-6 max-w-md mx-auto">
      {hasFilters 
        ? 'No hay tareas que coincidan con los filtros aplicados. Intenta ajustar tus criterios de búsqueda.'
        : 'Crea tu primera tarea y comienza a gestionar tu productividad de manera eficiente.'
      }
    </p>

    <div className="flex items-center justify-center gap-3">
      {hasFilters ? (
        <>
          <Button
            variant="secondary"
            onClick={onClearFilters}
          >
            Limpiar filtros
          </Button>
          <Button
            variant="primary"
            icon={<Plus className="w-4 h-4" />}
            onClick={onCreateTask}
          >
            Nueva Tarea
          </Button>
        </>
      ) : (
        <Button
          variant="primary"
          size="lg"
          icon={<Plus className="w-5 h-5" />}
          onClick={onCreateTask}
        >
          Crear mi primera tarea
        </Button>
      )}
    </div>

    {/* Características destacadas */}
    {!hasFilters && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto"
      >
        <div className="text-center p-4">
          <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <span className="text-xl">⚡</span>
          </div>
          <h4 className="font-medium text-slate-900 mb-1">Rápido y eficiente</h4>
          <p className="text-sm text-slate-600">Crea y gestiona tareas en segundos</p>
        </div>

        <div className="text-center p-4">
          <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <span className="text-xl">🎯</span>
          </div>
          <h4 className="font-medium text-slate-900 mb-1">Prioridades claras</h4>
          <p className="text-sm text-slate-600">Organiza por importancia y urgencia</p>
        </div>

        <div className="text-center p-4">
          <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <span className="text-xl">📊</span>
          </div>
          <h4 className="font-medium text-slate-900 mb-1">Seguimiento visual</h4>
          <p className="text-sm text-slate-600">Ve tu progreso en tiempo real</p>
        </div>
      </motion.div>
    )}
  </motion.div>
);

export default TaskList;