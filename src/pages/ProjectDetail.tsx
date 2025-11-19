import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { projectService } from '../services/projectService';
import { Button } from '../components/common/Button';
import { ROUTES } from '../utils/constants';
import type { Project, Task, ApiError } from '../types';

export const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadProject = async () => {
      if (!id) {
        navigate(ROUTES.PROJECTS);
        return;
      }

      setIsLoading(true);
      setError('');
      try {
        const data = await projectService.getProject(parseInt(id));
        setProject(data);
      } catch (err) {
        const error = err as ApiError | Error;
        console.error('Error loading project:', error);
        if ('detail' in error && error.detail) {
          setError(typeof error.detail === 'string' ? error.detail : 'Error al cargar el proyecto');
        } else {
          setError('Error al cargar el proyecto');
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadProject();
  }, [id, navigate]);

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  const getStatusBadgeStyle = (status: string) => {
    const baseStyle = {
      display: 'inline-block',
      padding: '0.25rem 0.75rem',
      borderRadius: '9999px',
      fontSize: '0.75rem',
      fontWeight: '600',
    };

    switch (status) {
      case 'ACTIVE':
        return { ...baseStyle, backgroundColor: '#d1fae5', color: '#065f46' };
      case 'INACTIVE':
        return { ...baseStyle, backgroundColor: '#fee2e2', color: '#991b1b' };
      case 'ARCHIVED':
        return { ...baseStyle, backgroundColor: '#e5e7eb', color: '#374151' };
      default:
        return baseStyle;
    }
  };

  const getTaskStatusBadge = (status: string) => {
    const baseStyle = {
      display: 'inline-block',
      padding: '0.25rem 0.5rem',
      borderRadius: '0.25rem',
      fontSize: '0.75rem',
      fontWeight: '500',
    };

    switch (status) {
      case 'TODO':
        return { ...baseStyle, backgroundColor: '#fef3c7', color: '#92400e' };
      case 'IN_PROGRESS':
        return { ...baseStyle, backgroundColor: '#dbeafe', color: '#1e40af' };
      case 'COMPLETED':
        return { ...baseStyle, backgroundColor: '#d1fae5', color: '#065f46' };
      default:
        return baseStyle;
    }
  };

  const getPriorityBadge = (priority: string) => {
    const baseStyle = {
      display: 'inline-block',
      padding: '0.25rem 0.5rem',
      borderRadius: '0.25rem',
      fontSize: '0.75rem',
      fontWeight: '500',
    };

    switch (priority) {
      case 'URGENT':
        return { ...baseStyle, backgroundColor: '#fee2e2', color: '#991b1b' };
      case 'HIGH':
        return { ...baseStyle, backgroundColor: '#fed7aa', color: '#9a3412' };
      case 'MEDIUM':
        return { ...baseStyle, backgroundColor: '#fef3c7', color: '#92400e' };
      case 'LOW':
        return { ...baseStyle, backgroundColor: '#e5e7eb', color: '#374151' };
      default:
        return baseStyle;
    }
  };

  if (isLoading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: '#f3f4f6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <p style={{ fontSize: '1.125rem', color: '#6b7280' }}>Cargando...</p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: '#f3f4f6',
          padding: '2rem',
        }}
      >
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div
            style={{
              backgroundColor: '#fee2e2',
              color: '#991b1b',
              padding: '1rem',
              borderRadius: '0.5rem',
              marginBottom: '1rem',
            }}
          >
            {error || 'Proyecto no encontrado'}
          </div>
          <Button onClick={() => navigate(ROUTES.PROJECTS)}>
            Volver a Proyectos
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#f3f4f6',
        padding: '2rem',
      }}
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2rem',
          }}
        >
          <div>
            <h1
              style={{
                fontSize: '2rem',
                fontWeight: '700',
                color: '#111827',
                marginBottom: '0.5rem',
              }}
            >
              {project.name}
            </h1>
            <p style={{ color: '#6b7280', margin: 0 }}>
              Bienvenido, {user?.name}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Button
              variant="secondary"
              onClick={() => navigate(ROUTES.PROJECTS)}
            >
              Volver a Proyectos
            </Button>
            <Button variant="secondary" onClick={() => navigate(ROUTES.DASHBOARD)}>
              Dashboard
            </Button>
            <Button variant="secondary" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>

        {/* Project Details Card */}
        <div
          style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '0.5rem',
            marginBottom: '2rem',
            boxShadow:
              '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'start',
              marginBottom: '1.5rem',
            }}
          >
            <div>
              <h2
                style={{
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  color: '#111827',
                  marginBottom: '0.5rem',
                }}
              >
                Información del Proyecto
              </h2>
            </div>
            <span style={getStatusBadgeStyle(project.status)}>
              {project.status === 'ACTIVE'
                ? 'Activo'
                : project.status === 'INACTIVE'
                ? 'Inactivo'
                : 'Archivado'}
            </span>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label
              style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#6b7280',
                marginBottom: '0.25rem',
              }}
            >
              Descripción
            </label>
            <p style={{ color: '#111827', margin: 0 }}>{project.description}</p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
              marginTop: '1.5rem',
            }}
          >
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#6b7280',
                  marginBottom: '0.25rem',
                }}
              >
                ID del Proyecto
              </label>
              <p style={{ color: '#111827', margin: 0, fontWeight: '500' }}>
                #{project.id}
              </p>
            </div>
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#6b7280',
                  marginBottom: '0.25rem',
                }}
              >
                Creado
              </label>
              <p style={{ color: '#111827', margin: 0 }}>
                {new Date(project.created_at).toLocaleDateString('es-ES')}
              </p>
            </div>
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#6b7280',
                  marginBottom: '0.25rem',
                }}
              >
                Actualizado
              </label>
              <p style={{ color: '#111827', margin: 0 }}>
                {new Date(project.updated_at).toLocaleDateString('es-ES')}
              </p>
            </div>
          </div>
        </div>

        {/* Tasks Section */}
        <div
          style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '0.5rem',
            boxShadow:
              '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
          }}
        >
          <h2
            style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: '#111827',
              marginBottom: '1.5rem',
            }}
          >
            Tareas ({project.tasks?.length || 0})
          </h2>

          {project.tasks && project.tasks.length > 0 ? (
            <div style={{ display: 'grid', gap: '1rem' }}>
              {project.tasks.map((task: Task) => (
                <div
                  key={task.id}
                  style={{
                    padding: '1.25rem',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    transition: 'box-shadow 0.2s',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'start',
                      marginBottom: '0.75rem',
                    }}
                  >
                    <h3
                      style={{
                        fontSize: '1.125rem',
                        fontWeight: '600',
                        color: '#111827',
                        margin: 0,
                      }}
                    >
                      {task.title}
                    </h3>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <span style={getTaskStatusBadge(task.status)}>
                        {task.status === 'TODO'
                          ? 'Por Hacer'
                          : task.status === 'IN_PROGRESS'
                          ? 'En Progreso'
                          : 'Completado'}
                      </span>
                      <span style={getPriorityBadge(task.priority)}>
                        {task.priority === 'URGENT'
                          ? 'Urgente'
                          : task.priority === 'HIGH'
                          ? 'Alta'
                          : task.priority === 'MEDIUM'
                          ? 'Media'
                          : 'Baja'}
                      </span>
                    </div>
                  </div>

                  <p style={{ color: '#6b7280', margin: '0 0 1rem 0' }}>
                    {task.description}
                  </p>

                  <div
                    style={{
                      display: 'flex',
                      gap: '1.5rem',
                      fontSize: '0.875rem',
                      color: '#6b7280',
                    }}
                  >
                    {task.assigned_to && (
                      <div>
                        <strong>Asignado a:</strong> Usuario #{task.assigned_to}
                      </div>
                    )}
                    {task.due_date && (
                      <div>
                        <strong>Fecha límite:</strong>{' '}
                        {new Date(task.due_date).toLocaleDateString('es-ES')}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: '#6b7280', textAlign: 'center', padding: '2rem' }}>
              No hay tareas asociadas a este proyecto
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
