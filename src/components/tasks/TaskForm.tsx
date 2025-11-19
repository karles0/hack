import { useState, useEffect, type FormEvent } from 'react';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import type { Task, TaskPriority, CreateTaskRequest, UpdateTaskRequest } from '../../types';

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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const data: any = {
        title,
        description,
        priority,
        due_date: dueDate || null,
        assigned_to: assignedTo ? parseInt(assignedTo) : null,
      };

      if (!task) {
        data.project_id = parseInt(selectedProjectId);
      }

      console.log('Enviando datos de tarea:', data);
      await onSubmit(data);
    } catch (err: any) {
      console.error('Error al guardar tarea:', err);
      // Mostrar detalles del error del backend
      let errorMessage = 'Error al guardar la tarea';
      if (err?.detail) {
        if (Array.isArray(err.detail)) {
          errorMessage = err.detail.map((d: any) => d.msg).join(', ');
        } else {
          errorMessage = JSON.stringify(err.detail);
        }
      } else if (err?.message) {
        errorMessage = err.message;
      }
      // Si es 404, mostrar mensaje específico
      if (err?.status === 404 || err?.response?.status === 404) {
        errorMessage = 'El endpoint de tareas no está disponible en el backend (404)';
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
        <Input
          type="number"
          label="ID del Proyecto"
          placeholder="ID del proyecto"
          value={selectedProjectId}
          onChange={(e) => setSelectedProjectId(e.target.value)}
          required
          min="1"
        />
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

      <Input
        type="number"
        label="Asignado a (ID de Usuario)"
        placeholder="Dejar vacío si no está asignado"
        value={assignedTo}
        onChange={(e) => setAssignedTo(e.target.value)}
        min="1"
      />

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
