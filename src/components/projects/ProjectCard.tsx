import { Card } from '../common/Card';
import { Button } from '../common/Button';
import type { Project } from '../../types';

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
  onView: (project: Project) => void;
}

export const ProjectCard = ({
  project,
  onEdit,
  onDelete,
  onView,
}: ProjectCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return '#10b981';
      case 'INACTIVE':
        return '#f59e0b';
      case 'ARCHIVED':
        return '#6b7280';
      default:
        return '#6b7280';
    }
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
              fontSize: '1.25rem',
              fontWeight: '600',
              color: '#111827',
              margin: 0,
            }}
          >
            {project.name}
          </h3>
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: '600',
              padding: '0.25rem 0.5rem',
              borderRadius: '0.25rem',
              backgroundColor: `${getStatusColor(project.status)}20`,
              color: getStatusColor(project.status),
            }}
          >
            {project.status}
          </span>
        </div>
        <p
          style={{
            color: '#6b7280',
            fontSize: '0.875rem',
            margin: '0.5rem 0',
          }}
        >
          {project.description || 'Sin descripción'}
        </p>
        <p
          style={{
            fontSize: '0.75rem',
            color: '#9ca3af',
            margin: '0.5rem 0 0 0',
          }}
        >
          Creado:{' '}
          {new Date(project.created_at).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </p>
      </div>

      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          marginTop: '1rem',
        }}
      >
        <Button
          onClick={() => onView(project)}
          style={{ flex: 1, fontSize: '0.875rem', padding: '0.5rem 1rem' }}
        >
          Ver Detalles
        </Button>
        <Button
          onClick={() => onEdit(project)}
          variant="secondary"
          style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
        >
          Editar
        </Button>
        <Button
          onClick={() => onDelete(project)}
          variant="danger"
          style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
        >
          Eliminar
        </Button>
      </div>
    </Card>
  );
};
