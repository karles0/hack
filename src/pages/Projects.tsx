import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { projectService } from '../services/projectService';
import { ProjectList } from '../components/projects/ProjectList';
import { ProjectForm } from '../components/projects/ProjectForm';
import { Modal } from '../components/common/Modal';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { ROUTES } from '../utils/constants';
import type { Project, CreateProjectRequest, UpdateProjectRequest } from '../types';

export const Projects = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [projects, setProjects] = useState<Project[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const loadProjects = async (page: number = 1, searchQuery?: string) => {
    setIsLoading(true);
    try {
      const response = await projectService.listProjects(page, 10, searchQuery);
      setProjects(response.projects);
      setCurrentPage(response.current_page);
      setTotalPages(response.total_pages);
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProjects(1);
  }, []);

  const handleSearch = () => {
    setCurrentPage(1);
    loadProjects(1, search);
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleCreateProject = async (data: CreateProjectRequest) => {
    await projectService.createProject(data);
    setIsCreateModalOpen(false);
    loadProjects(currentPage, search);
  };

  const handleEditProject = async (data: UpdateProjectRequest) => {
    if (selectedProject) {
      await projectService.updateProject(selectedProject.id, data);
      setIsEditModalOpen(false);
      setSelectedProject(null);
      loadProjects(currentPage, search);
    }
  };

  const handleDeleteProject = async () => {
    if (selectedProject) {
      await projectService.deleteProject(selectedProject.id);
      setIsDeleteModalOpen(false);
      setSelectedProject(null);
      loadProjects(currentPage, search);
    }
  };

  const handleViewProject = (project: Project) => {
    navigate(`${ROUTES.PROJECTS}/${project.id}`);
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
              Proyectos
            </h1>
            <p style={{ color: '#6b7280', margin: 0 }}>
              Bienvenido, {user?.name}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Button variant="secondary" onClick={() => navigate(ROUTES.DASHBOARD)}>
              Dashboard
            </Button>
            <Button variant="secondary" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>

        {/* Search and Create */}
        <div
          style={{
            display: 'flex',
            gap: '1rem',
            marginBottom: '2rem',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ flex: '1', minWidth: '250px' }}>
            <Input
              type="text"
              placeholder="Buscar proyectos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyPress={handleSearchKeyPress}
            />
          </div>
          <Button onClick={handleSearch} variant="secondary">
            Buscar
          </Button>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            + Nuevo Proyecto
          </Button>
        </div>

        {/* Project List */}
        <ProjectList
          projects={projects}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => loadProjects(page, search)}
          onEdit={(project) => {
            setSelectedProject(project);
            setIsEditModalOpen(true);
          }}
          onDelete={(project) => {
            setSelectedProject(project);
            setIsDeleteModalOpen(true);
          }}
          onView={handleViewProject}
          isLoading={isLoading}
        />

        {/* Create Modal */}
        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          title="Crear Nuevo Proyecto"
        >
          <ProjectForm
            onSubmit={handleCreateProject}
            onCancel={() => setIsCreateModalOpen(false)}
          />
        </Modal>

        {/* Edit Modal */}
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedProject(null);
          }}
          title="Editar Proyecto"
        >
          <ProjectForm
            project={selectedProject || undefined}
            onSubmit={handleEditProject}
            onCancel={() => {
              setIsEditModalOpen(false);
              setSelectedProject(null);
            }}
          />
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setSelectedProject(null);
          }}
          title="Eliminar Proyecto"
        >
          <div>
            <p style={{ marginBottom: '1.5rem', color: '#6b7280' }}>
              ¿Estás seguro de que deseas eliminar el proyecto "
              {selectedProject?.name}"? Esta acción no se puede deshacer.
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
                  setSelectedProject(null);
                }}
              >
                Cancelar
              </Button>
              <Button variant="danger" onClick={handleDeleteProject}>
                Eliminar
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};
