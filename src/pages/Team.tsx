import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { teamService } from '../services/teamService';
import { TeamMemberList } from '../components/team/TeamMemberList';
import { Modal } from '../components/common/Modal';
import { Button } from '../components/common/Button';
import { ROUTES } from '../utils/constants';
import type { TeamMember, Task } from '../types';

export const Team = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [members, setMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [memberTasks, setMemberTasks] = useState<Task[]>([]);
  const [isTasksModalOpen, setIsTasksModalOpen] = useState(false);
  const [isLoadingTasks, setIsLoadingTasks] = useState(false);

  const loadTeamMembers = async () => {
    setIsLoading(true);
    try {
      const response = await teamService.getTeamMembers();
      setMembers(response.members);
    } catch (error) {
      console.error('Error loading team members:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTeamMembers();
  }, []);

  const handleViewMemberTasks = async (member: TeamMember) => {
    setSelectedMember(member);
    setIsTasksModalOpen(true);
    setIsLoadingTasks(true);

    try {
      const response = await teamService.getMemberTasks(member.id);
      setMemberTasks(response.tasks);
    } catch (error) {
      console.error('Error loading member tasks:', error);
      setMemberTasks([]);
    } finally {
      setIsLoadingTasks(false);
    }
  };

  const handleCloseTasksModal = () => {
    setIsTasksModalOpen(false);
    setSelectedMember(null);
    setMemberTasks([]);
  };

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

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
              Equipo de Trabajo
            </h1>
            <p style={{ color: '#6b7280', margin: 0 }}>
              Colaboradores con tareas asignadas - {user?.name}
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
            <Button variant="secondary" onClick={() => navigate(ROUTES.TASKS)}>
              Tareas
            </Button>
            <Button variant="secondary" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>

        {/* Team Members */}
        <TeamMemberList
          members={members}
          onViewTasks={handleViewMemberTasks}
          isLoading={isLoading}
        />

        {/* Member Tasks Modal */}
        <Modal
          isOpen={isTasksModalOpen}
          onClose={handleCloseTasksModal}
          title={`Tareas de ${selectedMember?.name || 'Miembro'}`}
        >
          <div>
            {selectedMember && (
              <div
                style={{
                  marginBottom: '1.5rem',
                  padding: '1rem',
                  backgroundColor: '#f3f4f6',
                  borderRadius: '0.375rem',
                }}
              >
                <p style={{ margin: 0, color: '#6b7280', fontSize: '0.875rem' }}>
                  <strong>Email:</strong> {selectedMember.email}
                </p>
                <p
                  style={{
                    margin: 0,
                    marginTop: '0.25rem',
                    color: '#6b7280',
                    fontSize: '0.875rem',
                  }}
                >
                  <strong>ID de Usuario:</strong> {selectedMember.id}
                </p>
              </div>
            )}

            {isLoadingTasks ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '2rem',
                  color: '#6b7280',
                }}
              >
                Cargando tareas...
              </div>
            ) : memberTasks.length === 0 ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '2rem',
                  color: '#6b7280',
                }}
              >
                Este miembro no tiene tareas asignadas
              </div>
            ) : (
              <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                <p
                  style={{
                    marginBottom: '1rem',
                    color: '#6b7280',
                    fontSize: '0.875rem',
                  }}
                >
                  Total de tareas: <strong>{memberTasks.length}</strong>
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {memberTasks.map((task) => (
                    <div
                      key={task.id}
                      style={{
                        padding: '1rem',
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '0.375rem',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          marginBottom: '0.5rem',
                        }}
                      >
                        <h4
                          style={{
                            margin: 0,
                            fontSize: '1rem',
                            fontWeight: '600',
                            color: '#111827',
                          }}
                        >
                          {task.title}
                        </h4>
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
                          margin: 0,
                          fontSize: '0.875rem',
                          color: '#6b7280',
                        }}
                      >
                        {task.description}
                      </p>
                      <div
                        style={{
                          marginTop: '0.5rem',
                          fontSize: '0.75rem',
                          color: '#9ca3af',
                        }}
                      >
                        <strong>Proyecto ID:</strong> {task.project_id}
                        {task.due_date && (
                          <>
                            {' | '}
                            <strong>Fecha límite:</strong>{' '}
                            {new Date(task.due_date).toLocaleDateString('es-ES')}
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Modal>
      </div>
    </div>
  );
};
