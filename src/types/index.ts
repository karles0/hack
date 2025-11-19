// User types
export interface User {
  id: number;
  email: string;
  name: string;
  created_at: string;
}

// Auth request types
export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

// Auth response types
export interface LoginResponse {
  token: string;
  user: User;
}

export interface RegisterResponse {
  [key: string]: any;
}

// API Error type
export interface ApiError {
  detail?: Array<{
    loc: (string | number)[];
    msg: string;
    type: string;
  }>;
  message?: string;
}

// Project types
export type ProjectStatus = 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';

export interface Project {
  id: number;
  name: string;
  description: string;
  status: ProjectStatus;
  owner_id: number;
  created_at: string;
  updated_at: string;
  tasks?: Task[];
}

export interface CreateProjectRequest {
  name: string;
  description: string;
  status: ProjectStatus;
}

export interface UpdateProjectRequest {
  name?: string;
  description?: string;
  status?: ProjectStatus;
}

export interface ProjectsListResponse {
  projects: Project[];
  total_pages: number;
  current_page: number;
}

// Task types
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'COMPLETED';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  project_id: number;
  assigned_to: number | null;
  due_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateTaskRequest {
  title: string;
  description: string;
  project_id: number;
  priority: TaskPriority;
  due_date?: string | null;
  assigned_to?: number | null;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  due_date?: string | null;
  assigned_to?: number | null;
}

export interface UpdateTaskStatusRequest {
  status: TaskStatus;
}

export interface TasksListResponse {
  tasks: Task[];
  total_pages: number;
  current_page: number;
}

export interface TaskFilters {
  project_id?: number;
  status?: TaskStatus;
  priority?: TaskPriority;
  assigned_to?: number;
  page?: number;
  limit?: number;
}

// Team types
export interface TeamMember {
  id: number;
  name: string;
  email: string;
}

export interface TeamMembersResponse {
  members: TeamMember[];
}

export interface MemberTasksResponse {
  tasks: Task[];
}
