import { ProjectCard } from './ProjectCard';
import { Button } from '../common/Button';
import type { Project } from '../../types';

interface ProjectListProps {
  projects: Project[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
  onView: (project: Project) => void;
  isLoading?: boolean;
}

export const ProjectList = ({
  projects,
  currentPage,
  totalPages,
  onPageChange,
  onEdit,
  onDelete,
  onView,
  isLoading = false,
}: ProjectListProps) => {
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
          Cargando proyectos...
        </div>
      </div>
    );
  }

  if (projects.length === 0) {
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
          No hay proyectos
        </p>
        <p style={{ fontSize: '0.875rem', color: '#9ca3af' }}>
          Crea tu primer proyecto para comenzar
        </p>
      </div>
    );
  }

  return (
    <div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem',
        }}
      >
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onEdit={onEdit}
            onDelete={onDelete}
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
