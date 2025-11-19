import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { taskService } from '../services/taskService';
import { TaskList } from '../components/tasks/TaskList';
import { TaskForm } from '../components/tasks/TaskForm';
import { Modal } from '../components/common/Modal';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { ROUTES } from '../utils/constants';
import type {
  Task,
  TaskStatus,
  TaskPriority,
  CreateTaskRequest,
  UpdateTaskRequest,
} from '../types';

export const Tasks = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Filtros
  const [projectIdFilter, setProjectIdFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<TaskStatus | ''>('');
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | ''>('');
  const [assignedToFilter, setAssignedToFilter] = useState('');

  // Modales
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [newStatus, setNewStatus] = useState<TaskStatus>('TODO');

  const loadTasks = async (page: number = 1) => {
    setIsLoading(true);
    try {
      const filters: any = { page, limit: 20 };

      if (projectIdFilter) filters.project_id = parseInt(projectIdFilter);
      if (statusFilter) filters.status = statusFilter;
      if (priorityFilter) filters.priority = priorityFilter;
      if (assignedToFilter) filters.assigned_to = parseInt(assignedToFilter);

      const response = await taskService.listTasks(filters);
      setTasks(response.tasks);
      setCurrentPage(response.current_page);
      setTotalPages(response.total_pages);
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTasks(1);
  }, []);

  const handleApplyFilters = () => {
    setCurrentPage(1);
    loadTasks(1);
  };

  const handleClearFilters = () => {
    setProjectIdFilter('');
    setStatusFilter('');
    setPriorityFilter('');
    setAssignedToFilter('');
    setCurrentPage(1);
    loadTasks(1);
  };

  const handleCreateTask = async (data: CreateTaskRequest) => {
    await taskService.createTask(data);
    setIsCreateModalOpen(false);
    loadTasks(currentPage);
  };

  const handleEditTask = async (data: UpdateTaskRequest) => {
    if (selectedTask) {
      await taskService.updateTask(selectedTask.id, data);
      setIsEditModalOpen(false);
      setSelectedTask(null);
      loadTasks(currentPage);
    }
  };

  const handleDeleteTask = async () => {
    if (selectedTask) {
      await taskService.deleteTask(selectedTask.id);
      setIsDeleteModalOpen(false);
      setSelectedTask(null);
      loadTasks(currentPage);
    }
  };

  const handleStatusChange = async () => {
    if (selectedTask) {
      await taskService.updateTaskStatus(selectedTask.id, { status: newStatus });
      setIsStatusModalOpen(false);
      setSelectedTask(null);
      loadTasks(currentPage);
    }
  };

  const handleViewTask = (task: Task) => {
    // Aquí podrías navegar a una página de detalles
    alert(
      `Tarea: ${task.title}\nEstado: ${task.status}\nPrioridad: ${task.priority}\nDescripción: ${task.description}`
    );
  };

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

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
              Gestión de Tareas
            </h1>
            <p style={{ color: '#6b7280', margin: 0 }}>
              Bienvenido, {user?.name}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Button
              variant="secondary"
              onClick={() => navigate(ROUTES.DASHBOARD)}
            >
              Dashboard
            </Button>
            <Button
              variant="secondary"
              onClick={() => navigate(ROUTES.PROJECTS)}
            >
              Proyectos
            </Button>
            <Button variant="secondary" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>

        {/* Filtros */}
        <div
          style={{
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '0.5rem',
            marginBottom: '2rem',
            boxShadow:
              '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
          }}
        >
          <h3
            style={{
              fontSize: '1.125rem',
              fontWeight: '600',
              marginBottom: '1rem',
              color: '#111827',
            }}
          >
            Filtros
          </h3>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
              marginBottom: '1rem',
            }}
          >
            <Input
              type="number"
              label="ID Proyecto"
              placeholder="Filtrar por proyecto..."
              value={projectIdFilter}
              onChange={(e) => setProjectIdFilter(e.target.value)}
              min="1"
            />

            <div>
              <label
                style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '500',
                  color: '#333',
                  fontSize: '0.875rem',
                }}
              >
                Estado
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as TaskStatus | '')}
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
                <option value="">Todos</option>
                <option value="TODO">Por Hacer</option>
                <option value="IN_PROGRESS">En Progreso</option>
                <option value="COMPLETED">Completado</option>
              </select>
            </div>

            <div>
              <label
                style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '500',
                  color: '#333',
                  fontSize: '0.875rem',
                }}
              >
                Prioridad
              </label>
              <select
                value={priorityFilter}
                onChange={(e) =>
                  setPriorityFilter(e.target.value as TaskPriority | '')
                }
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
                <option value="">Todas</option>
                <option value="LOW">Baja</option>
                <option value="MEDIUM">Media</option>
                <option value="HIGH">Alta</option>
                <option value="URGENT">Urgente</option>
              </select>
            </div>

            <Input
              type="number"
              label="Asignado a"
              placeholder="ID de usuario..."
              value={assignedToFilter}
              onChange={(e) => setAssignedToFilter(e.target.value)}
              min="1"
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <Button onClick={handleApplyFilters}>Aplicar Filtros</Button>
            <Button variant="secondary" onClick={handleClearFilters}>
              Limpiar Filtros
            </Button>
            <Button onClick={() => setIsCreateModalOpen(true)}>
              + Nueva Tarea
            </Button>
          </div>
        </div>

        {/* Task List */}
        <TaskList
          tasks={tasks}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => loadTasks(page)}
          onEdit={(task) => {
            setSelectedTask(task);
            setIsEditModalOpen(true);
          }}
          onDelete={(task) => {
            setSelectedTask(task);
            setIsDeleteModalOpen(true);
          }}
          onStatusChange={(task) => {
            setSelectedTask(task);
            setNewStatus(task.status);
            setIsStatusModalOpen(true);
          }}
          onView={handleViewTask}
          isLoading={isLoading}
        />

        {/* Create Modal */}
        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          title="Crear Nueva Tarea"
        >
          <TaskForm
            onSubmit={handleCreateTask}
            onCancel={() => setIsCreateModalOpen(false)}
          />
        </Modal>

        {/* Edit Modal */}
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedTask(null);
          }}
          title="Editar Tarea"
        >
          <TaskForm
            task={selectedTask || undefined}
            onSubmit={handleEditTask}
            onCancel={() => {
              setIsEditModalOpen(false);
              setSelectedTask(null);
            }}
          />
        </Modal>

        {/* Status Change Modal */}
        <Modal
          isOpen={isStatusModalOpen}
          onClose={() => {
            setIsStatusModalOpen(false);
            setSelectedTask(null);
          }}
          title="Cambiar Estado de Tarea"
        >
          <div>
            <p style={{ marginBottom: '1rem', color: '#6b7280' }}>
              Cambiar estado de: <strong>{selectedTask?.title}</strong>
            </p>
            <div style={{ marginBottom: '1.5rem' }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '500',
                  color: '#333',
                }}
              >
                Nuevo Estado
              </label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value as TaskStatus)}
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
                <option value="TODO">Por Hacer</option>
                <option value="IN_PROGRESS">En Progreso</option>
                <option value="COMPLETED">Completado</option>
              </select>
            </div>
            <div
              style={{
                display: 'flex',
                gap: '0.75rem',
                justifyContent: 'flex-end',
              }}
            >
              <Button
                variant="secondary"
                onClick={() => {
                  setIsStatusModalOpen(false);
                  setSelectedTask(null);
                }}
              >
                Cancelar
              </Button>
              <Button onClick={handleStatusChange}>Actualizar Estado</Button>
            </div>
          </div>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setSelectedTask(null);
          }}
          title="Eliminar Tarea"
        >
          <div>
            <p style={{ marginBottom: '1.5rem', color: '#6b7280' }}>
              ¿Estás seguro de que deseas eliminar la tarea "
              {selectedTask?.title}"? Esta acción no se puede deshacer.
            </p>
            <div
              style={{
                display: 'flex',
                gap: '0.75rem',
                justifyContent: 'flex-end',
              }}
            >
              <Button
                variant="secondary"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setSelectedTask(null);
                }}
              >
                Cancelar
              </Button>
              <Button variant="danger" onClick={handleDeleteTask}>
                Eliminar
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};
