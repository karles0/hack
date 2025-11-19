import { useState, useEffect, type FormEvent } from 'react';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { projectService } from '../../services/projectService';
import { teamService } from '../../services/teamService';
import type { Task, TaskPriority, Project, CreateTaskRequest, UpdateTaskRequest, ApiError, TeamMember } from '../../types';

interface TaskFormProps {
  task?: Task;
  projectId?: number;
  onSubmit: (data: CreateTaskRequest | UpdateTaskRequest) => Promise<void>;
  onCancel: () => void;
}

export const TaskForm = ({
  task,
  projectId,
  onSubmit,
  onCancel,
}: TaskFormProps) => {
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [priority, setPriority] = useState<TaskPriority>(
    task?.priority || 'MEDIUM'
  );
  const [dueDate, setDueDate] = useState(
    task?.due_date ? task.due_date.split('T')[0] : ''
  );
  const [assignedTo, setAssignedTo] = useState(
    task?.assigned_to?.toString() || ''
  );
  const [selectedProjectId, setSelectedProjectId] = useState(
    task?.project_id?.toString() || projectId?.toString() || ''
  );
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setPriority(task.priority);
      setDueDate(task.due_date ? task.due_date.split('T')[0] : '');
      setAssignedTo(task.assigned_to?.toString() || '');
      setSelectedProjectId(task.project_id.toString());
    }
  }, [task]);

  // Load projects and team members
  useEffect(() => {
    if (!task) {
      loadProjects();
    }
    loadTeamMembers();
  }, [task]);

  const loadProjects = async () => {
    setLoadingProjects(true);
    try {
      // Load all projects (first page with higher limit)
      const response = await projectService.listProjects(1, 100);
      setProjects(response.projects);
    } catch (error) {
      console.error('Error loading projects:', error);
      setError('Error al cargar los proyectos');
    } finally {
      setLoadingProjects(false);
    }
  };

  const loadTeamMembers = async () => {
    setLoadingMembers(true);
    try {
      const response = await teamService.getTeamMembers();
      setTeamMembers(response.members);
    } catch (error) {
      console.error('Error loading team members:', error);
      // No mostramos error aquí para no bloquear el formulario
    } finally {
      setLoadingMembers(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Build task data object, ensuring proper types
      const baseData = {
        title: title.trim(),
        description: description.trim(),
        priority,
        due_date: dueDate ? new Date(dueDate + 'T00:00:00Z').toISOString() : null,
        assigned_to: assignedTo && assignedTo.trim() ? parseInt(assignedTo) : null,
      };

      // Validate assigned_to if provided
      if (assignedTo && assignedTo.trim() && isNaN(parseInt(assignedTo))) {
        throw new Error('ID de usuario asignado inválido');
      }

      let data: CreateTaskRequest | UpdateTaskRequest;

      if (!task) {
        // For new tasks, include project_id
        const projectId = parseInt(selectedProjectId);
        if (isNaN(projectId)) {
          throw new Error('ID de proyecto inválido');
        }
        data = { ...baseData, project_id: projectId } as CreateTaskRequest;
      } else {
        // For updates, don't include project_id
        data = baseData as UpdateTaskRequest;
      }

      console.log('Enviando datos de tarea:', JSON.stringify(data, null, 2));
      await onSubmit(data);
    } catch (err) {
      const error = err as ApiError | Error;
      console.error('Error al guardar tarea:', error);
      console.error('Error detail completo:', JSON.stringify(error, null, 2));
      // Mostrar detalles del error del backend
      let errorMessage = 'Error al guardar la tarea';
      if ('detail' in error && error.detail) {
        if (Array.isArray(error.detail)) {
          console.error('Error detail array:', error.detail);
          errorMessage = error.detail.map((d) => `${d.loc?.join('.')}: ${d.msg}`).join(', ');
        } else {
          // El detail es un string (ej: "Project not found")
          errorMessage = `${error.detail}`;
        }
      } else if ('message' in error && error.message) {
        errorMessage = error.message;
      }
      // Agregar el status code al mensaje para claridad
      if ('status' in error && error.status) {
        errorMessage = `[${error.status}] ${errorMessage}`;
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div
          style={{
            padding: '0.75rem',
            marginBottom: '1rem',
            backgroundColor: '#fee2e2',
            color: '#991b1b',
            borderRadius: '0.375rem',
            fontSize: '0.875rem',
          }}
        >
          {error}
        </div>
      )}

      <Input
        type="text"
        label="Título de la Tarea"
        placeholder="Título de la tarea"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <div style={{ marginBottom: '1rem' }}>
        <label
          style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontWeight: '500',
            color: '#333',
          }}
        >
          Descripción
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Descripción de la tarea..."
          required
          style={{
            width: '100%',
            padding: '0.75rem',
            fontSize: '1rem',
            border: '1px solid #d1d5db',
            borderRadius: '0.375rem',
            outline: 'none',
            resize: 'vertical',
            minHeight: '100px',
            boxSizing: 'border-box',
          }}
        />
      </div>

      {!task && (
        <div style={{ marginBottom: '1rem' }}>
          <label
            style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: '500',
              color: '#333',
            }}
          >
            Proyecto *
          </label>
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            required
            disabled={loadingProjects}
            style={{
              width: '100%',
              padding: '0.75rem',
              fontSize: '1rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              outline: 'none',
              backgroundColor: loadingProjects ? '#f3f4f6' : 'white',
              boxSizing: 'border-box',
            }}
          >
            <option value="">
              {loadingProjects ? 'Cargando proyectos...' : 'Selecciona un proyecto'}
            </option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div style={{ marginBottom: '1rem' }}>
        <label
          style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontWeight: '500',
            color: '#333',
          }}
        >
          Prioridad
        </label>
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as TaskPriority)}
          style={{
            width: '100%',
            padding: '0.75rem',
            fontSize: '1rem',
            border: '1px solid #d1d5db',
            borderRadius: '0.375rem',
            outline: 'none',
            backgroundColor: 'white',
            boxSizing: 'border-box',
          }}
        >
          <option value="LOW">Baja</option>
          <option value="MEDIUM">Media</option>
          <option value="HIGH">Alta</option>
          <option value="URGENT">Urgente</option>
        </select>
      </div>

      <Input
        type="date"
        label="Fecha Límite"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
      />

      <div style={{ marginBottom: '1rem' }}>
        <label
          style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontWeight: '500',
            color: '#333',
          }}
        >
          Asignar a
        </label>
        <select
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
          disabled={loadingMembers}
          style={{
            width: '100%',
            padding: '0.75rem',
            fontSize: '1rem',
            border: '1px solid #d1d5db',
            borderRadius: '0.375rem',
            outline: 'none',
            backgroundColor: loadingMembers ? '#f3f4f6' : 'white',
            boxSizing: 'border-box',
          }}
        >
          <option value="">
            {loadingMembers ? 'Cargando usuarios...' : 'Sin asignar'}
          </option>
          {teamMembers.map((member) => (
            <option key={member.id} value={member.id}>
              {member.name} ({member.email})
            </option>
          ))}
        </select>
      </div>

      <div
        style={{
          display: 'flex',
          gap: '0.75rem',
          justifyContent: 'flex-end',
          marginTop: '1.5rem',
        }}
      >
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {isLoading ? 'Guardando...' : task ? 'Actualizar' : 'Crear Tarea'}
        </Button>
      </div>
    </form>
  );
};
