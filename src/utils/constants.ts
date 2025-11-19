// API Configuration
export const API_BASE_URL = 'https://cs2031-2025-2-hackathon-2-backend-production.up.railway.app';
export const API_VERSION = 'v1';

// API Endpoints (relative paths for axios)
export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: `/${API_VERSION}/auth/register`,
    LOGIN: `/${API_VERSION}/auth/login`,
  },
  PROJECTS: {
    BASE: `/${API_VERSION}/projects`,
  },
  TASKS: {
    BASE: `/${API_VERSION}/tasks`,
  },
  TEAM: {
    MEMBERS: `/${API_VERSION}/team/members`,
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
  TASKS: '/tasks',
  TEAM: '/team',
};
