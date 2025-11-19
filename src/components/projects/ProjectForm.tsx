import { useState, useEffect, type FormEvent } from 'react';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import type { Project, ProjectStatus } from '../../types';

interface ProjectFormProps {
  project?: Project;
  onSubmit: (data: {
    name: string;
    description: string;
    status: ProjectStatus;
  }) => Promise<void>;
  onCancel: () => void;
}

export const ProjectForm = ({
  project,
  onSubmit,
  onCancel,
}: ProjectFormProps) => {
  const [name, setName] = useState(project?.name || '');
  const [description, setDescription] = useState(project?.description || '');
  const [status, setStatus] = useState<ProjectStatus>(
    project?.status || 'ACTIVE'
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (project) {
      setName(project.name);
      setDescription(project.description);
      setStatus(project.status);
    }
  }, [project]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Ensure proper data types and trimmed strings
      const submitData = {
        name: name.trim(),
        description: description.trim(),
        status,
      };

      // Validate that required fields are not empty
      if (!submitData.name) {
        throw new Error('El nombre del proyecto es requerido');
      }
      if (!submitData.description) {
        throw new Error('La descripción del proyecto es requerida');
      }

      console.log('Enviando datos del proyecto:', submitData);
      await onSubmit(submitData);
    } catch (err: any) {
      console.error('Error al guardar proyecto:', err);
      console.error('Error detail completo:', JSON.stringify(err, null, 2));
      // Mostrar detalles del error del backend
      let errorMessage = 'Error al guardar el proyecto';
      if (err?.detail) {
        if (Array.isArray(err.detail)) {
          console.error('Error detail array:', err.detail);
          errorMessage = err.detail.map((d: any) => `${d.loc?.join('.')}: ${d.msg}`).join(', ');
        } else {
          errorMessage = `${err.detail}`;
        }
      } else if (err?.message) {
        errorMessage = err.message;
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
        label="Nombre del Proyecto"
        placeholder="Mi Proyecto"
        value={name}
        onChange={(e) => setName(e.target.value)}
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
          placeholder="Descripción del proyecto..."
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

      <div style={{ marginBottom: '1rem' }}>
        <label
          style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontWeight: '500',
            color: '#333',
          }}
        >
          Estado
        </label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as ProjectStatus)}
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
          <option value="ACTIVE">Activo</option>
          <option value="INACTIVE">Inactivo</option>
          <option value="ARCHIVED">Archivado</option>
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
          {isLoading
            ? 'Guardando...'
            : project
            ? 'Actualizar'
            : 'Crear Proyecto'}
        </Button>
      </div>
    </form>
  );
};
