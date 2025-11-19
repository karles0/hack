import { Card } from '../common/Card';
import { Button } from '../common/Button';
import type { Task } from '../../types';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onStatusChange: (task: Task) => void;
  onView: (task: Task) => void;
}

export const TaskCard = ({
  task,
  onEdit,
  onDelete,
  onStatusChange,
  onView,
}: TaskCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'TODO':
        return '#6b7280';
      case 'IN_PROGRESS':
        return '#3b82f6';
      case 'COMPLETED':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT':
        return '#ef4444';
      case 'HIGH':
        return '#f97316';
      case 'MEDIUM':
        return '#f59e0b';
      case 'LOW':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Sin fecha límite';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Card>
      <div style={{ marginBottom: '1rem' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '0.5rem',
          }}
        >
          <h3
            style={{
              fontSize: '1.125rem',
              fontWeight: '600',
              color: '#111827',
              margin: 0,
              flex: 1,
            }}
          >
            {task.title}
          </h3>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: '600',
                padding: '0.25rem 0.5rem',
                borderRadius: '0.25rem',
                backgroundColor: `${getStatusColor(task.status)}20`,
                color: getStatusColor(task.status),
                whiteSpace: 'nowrap',
              }}
            >
              {task.status.replace('_', ' ')}
            </span>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: '600',
                padding: '0.25rem 0.5rem',
                borderRadius: '0.25rem',
                backgroundColor: `${getPriorityColor(task.priority)}20`,
                color: getPriorityColor(task.priority),
                whiteSpace: 'nowrap',
              }}
            >
              {task.priority}
            </span>
          </div>
        </div>

        <p
          style={{
            color: '#6b7280',
            fontSize: '0.875rem',
            margin: '0.5rem 0',
          }}
        >
          {task.description || 'Sin descripción'}
        </p>

        <div
          style={{
            display: 'flex',
            gap: '1rem',
            fontSize: '0.75rem',
            color: '#9ca3af',
            marginTop: '0.75rem',
          }}
        >
          <div>
            <strong>Proyecto ID:</strong> {task.project_id}
          </div>
          <div>
            <strong>Fecha límite:</strong> {formatDate(task.due_date)}
          </div>
          {task.assigned_to && (
            <div>
              <strong>Asignado a:</strong> Usuario #{task.assigned_to}
            </div>
          )}
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '0.5rem',
          marginTop: '1rem',
        }}
      >
        <Button
          onClick={() => onView(task)}
          style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
        >
          Ver
        </Button>
        <Button
          onClick={() => onStatusChange(task)}
          variant="secondary"
          style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
        >
          Estado
        </Button>
        <Button
          onClick={() => onEdit(task)}
          variant="secondary"
          style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
        >
          Editar
        </Button>
        <Button
          onClick={() => onDelete(task)}
          variant="danger"
          style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
        >
          Eliminar
        </Button>
      </div>
    </Card>
  );
};
