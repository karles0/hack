import { api } from './api';
import { API_ENDPOINTS, STORAGE_KEYS } from '../utils/constants';
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  User,
} from '../types';

export const authService = {
  // ======================================
  // REGISTER
  // POST /v1/auth/register
  // Registra un nuevo usuario
  // ======================================
  async register(data: RegisterRequest): Promise<RegisterResponse> {
    console.log('POST Register URL:', API_ENDPOINTS.AUTH.REGISTER);
    console.log('POST Register Data:', JSON.stringify({ ...data, password: '***' }, null, 2));
    const response = await api.post<RegisterResponse>(
      API_ENDPOINTS.AUTH.REGISTER,
      data
    );
    console.log('POST Register Response:', response.data);
    return response.data;
  },

  // ======================================
  // LOGIN
  // POST /v1/auth/login
  // Autentica al usuario y retorna token + datos del usuario
  // ======================================
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await api.post<{ token: string; user: User }>(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials
    );

    // Store token and user data
    if (response.data.token) {
      localStorage.setItem(STORAGE_KEYS.TOKEN, response.data.token);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.data.user));
    }

    return {
      token: response.data.token,
      user: response.data.user,
    };
  },

  // ======================================
  // LOGOUT
  // Limpia el localStorage
  // ======================================
  logout(): void {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
  },

  // ======================================
  // GET TOKEN
  // Obtiene el token del localStorage
  // ======================================
  getToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
  },

  // ======================================
  // GET USER
  // Obtiene los datos del usuario del localStorage
  // ======================================
  getUser(): User | null {
    const userData = localStorage.getItem(STORAGE_KEYS.USER);
    if (!userData) return null;

    try {
      return JSON.parse(userData);
    } catch {
      return null;
    }
  },

  // ======================================
  // IS AUTHENTICATED
  // Verifica si el usuario está autenticado
  // ======================================
  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};
