import { TaskCard } from './TaskCard';
import { Button } from '../common/Button';
import type { Task } from '../../types';

interface TaskListProps {
  tasks: Task[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onStatusChange: (task: Task) => void;
  onView: (task: Task) => void;
  isLoading?: boolean;
}

export const TaskList = ({
  tasks,
  currentPage,
  totalPages,
  onPageChange,
  onEdit,
  onDelete,
  onStatusChange,
  onView,
  isLoading = false,
}: TaskListProps) => {
  if (isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '300px',
        }}
      >
        <div
          style={{
            fontSize: '1.25rem',
            color: '#6b7280',
          }}
        >
          Cargando tareas...
        </div>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: '3rem 1rem',
          backgroundColor: '#f9fafb',
          borderRadius: '0.5rem',
        }}
      >
        <p
          style={{
            fontSize: '1.125rem',
            color: '#6b7280',
            marginBottom: '0.5rem',
          }}
        >
          No hay tareas
        </p>
        <p style={{ fontSize: '0.875rem', color: '#9ca3af' }}>
          Crea tu primera tarea para comenzar
        </p>
      </div>
    );
  }

  return (
    <div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem',
        }}
      >
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={onEdit}
            onDelete={onDelete}
            onStatusChange={onStatusChange}
            onView={onView}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '0.5rem',
            marginTop: '2rem',
          }}
        >
          <Button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            variant="secondary"
            style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
          >
            Anterior
          </Button>

          <span
            style={{
              padding: '0 1rem',
              color: '#6b7280',
              fontSize: '0.875rem',
            }}
          >
            Página {currentPage} de {totalPages}
          </span>

          <Button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            variant="secondary"
            style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
          >
            Siguiente
          </Button>
        </div>
      )}
    </div>
  );
};
