import { api } from './api';
import { API_ENDPOINTS } from '../utils/constants';
import type { TeamMembersResponse, MemberTasksResponse } from '../types';

export const teamService = {
  // ======================================
  // GET TEAM MEMBERS
  // GET /v1/team/members
  // Obtiene todos los miembros del equipo
  // (usuarios con tareas asignadas en proyectos del usuario actual)
  // ======================================
  async getTeamMembers(): Promise<TeamMembersResponse> {
    const response = await api.get<TeamMembersResponse>(
      API_ENDPOINTS.TEAM.MEMBERS
    );
    return response.data;
  },

  // ======================================
  // GET MEMBER TASKS
  // GET /v1/team/members/{member_id}/tasks
  // Obtiene todas las tareas asignadas a un miembro específico
  // ======================================
  async getMemberTasks(memberId: number): Promise<MemberTasksResponse> {
    const response = await api.get<MemberTasksResponse>(
      `${API_ENDPOINTS.TEAM.MEMBERS}/${memberId}/tasks`
    );
    return response.data;
  },
};
