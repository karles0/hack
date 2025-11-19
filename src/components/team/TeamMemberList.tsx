import { TeamMemberCard } from './TeamMemberCard';
import type { TeamMember } from '../../types';

interface TeamMemberListProps {
  members: TeamMember[];
  onViewTasks: (member: TeamMember) => void;
  isLoading?: boolean;
}

export const TeamMemberList = ({
  members,
  onViewTasks,
  isLoading = false,
}: TeamMemberListProps) => {
  if (isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '300px',
        }}
      >
        <div
          style={{
            fontSize: '1.25rem',
            color: '#6b7280',
          }}
        >
          Cargando miembros del equipo...
        </div>
      </div>
    );
  }

  if (members.length === 0) {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: '3rem 1rem',
          backgroundColor: '#f9fafb',
          borderRadius: '0.5rem',
        }}
      >
        <p
          style={{
            fontSize: '1.125rem',
            color: '#6b7280',
            marginBottom: '0.5rem',
          }}
        >
          No hay miembros del equipo
        </p>
        <p style={{ fontSize: '0.875rem', color: '#9ca3af' }}>
          Los miembros aparecerán cuando tengan tareas asignadas en tus proyectos
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '1.5rem',
      }}
    >
      {members.map((member) => (
        <TeamMemberCard
          key={member.id}
          member={member}
          onViewTasks={onViewTasks}
        />
      ))}
    </div>
  );
};
