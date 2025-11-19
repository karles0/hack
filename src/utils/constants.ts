// API Configuration
// Use environment variable if available (includes /v1), otherwise use hardcoded value
const ENV_API_URL = import.meta.env.VITE_API_URL;
export const API_BASE_URL = ENV_API_URL || 'https://cs2031-2025-2-hackathon-2-backend-production.up.railway.app';
export const API_VERSION = 'v1';

// API Endpoints (relative paths for axios)
// If using env var (which includes /v1), don't add version prefix
const useEnv = !!ENV_API_URL;
export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: useEnv ? '/auth/register' : `/${API_VERSION}/auth/register`,
    LOGIN: useEnv ? '/auth/login' : `/${API_VERSION}/auth/login`,
  },
  PROJECTS: {
    BASE: useEnv ? '/projects' : `/${API_VERSION}/projects`,
  },
  TASKS: {
    BASE: useEnv ? '/tasks' : `/${API_VERSION}/tasks`,
  },
  TEAM: {
    MEMBERS: useEnv ? '/team/members' : `/${API_VERSION}/team/members`,
  },
};

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'auth_token',
  USER: 'user_data',
};

// App Routes
export const ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  PROJECTS: '/projects',
  PROJECT_DETAIL: '/projects/:id',
  TASKS: '/tasks',
  TEAM: '/team',
};
