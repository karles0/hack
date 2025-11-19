import { api } from './api';
import { API_ENDPOINTS } from '../utils/constants';
import type {
  Task,
  CreateTaskRequest,
  UpdateTaskRequest,
  UpdateTaskStatusRequest,
  TasksListResponse,
  TaskFilters,
} from '../types';

export const taskService = {
  // ======================================
  // LIST TASKS
  // GET /v1/tasks
  // Lista todas las tareas con filtros y paginación
  // ======================================
  async listTasks(filters?: TaskFilters): Promise<TasksListResponse> {
    const params: Record<string, any> = {
      page: filters?.page || 1,
      limit: filters?.limit || 20,
    };

    if (filters?.project_id !== undefined) {
      params.project_id = filters.project_id;
    }
    if (filters?.status) {
      params.status = filters.status;
    }
    if (filters?.priority) {
      params.priority = filters.priority;
    }
    if (filters?.assigned_to !== undefined) {
      params.assignedTo = filters.assigned_to;
    }

    const response = await api.get<TasksListResponse>(
      API_ENDPOINTS.TASKS.BASE,
      { params }
    );
    return response.data;
  },

  // ======================================
  // CREATE TASK
  // POST /v1/tasks
  // Crea una nueva tarea
  // ======================================
  async createTask(data: CreateTaskRequest): Promise<Task> {
    console.log('POST Request URL:', API_ENDPOINTS.TASKS.BASE);
    console.log('POST Request Data:', JSON.stringify(data, null, 2));
    const response = await api.post<Task>(API_ENDPOINTS.TASKS.BASE, data);
    console.log('POST Response:', response.data);
    return response.data;
  },

  // ======================================
  // GET TASK
  // GET /v1/tasks/{id}
  // Obtiene detalles de una tarea
  // ======================================
  async getTask(taskId: number): Promise<Task> {
    const response = await api.get<Task>(
      `${API_ENDPOINTS.TASKS.BASE}/${taskId}`
    );
    return response.data;
  },

  // ======================================
  // UPDATE TASK
  // PUT /v1/tasks/{id}
  // Actualiza información de la tarea
  // ======================================
  async updateTask(taskId: number, data: UpdateTaskRequest): Promise<Task> {
    const response = await api.put<Task>(
      `${API_ENDPOINTS.TASKS.BASE}/${taskId}`,
      data
    );
    return response.data;
  },

  // ======================================
  // UPDATE TASK STATUS
  // PATCH /v1/tasks/{id}/status
  // Actualiza solo el estado de la tarea
  // ======================================
  async updateTaskStatus(
    taskId: number,
    data: UpdateTaskStatusRequest
  ): Promise<Task> {
    const response = await api.patch<Task>(
      `${API_ENDPOINTS.TASKS.BASE}/${taskId}/status`,
      data
    );
    return response.data;
  },

  // ======================================
  // DELETE TASK
  // DELETE /v1/tasks/{id}
  // Elimina una tarea
  // ======================================
  async deleteTask(taskId: number): Promise<void> {
    await api.delete(`${API_ENDPOINTS.TASKS.BASE}/${taskId}`);
  },
};
