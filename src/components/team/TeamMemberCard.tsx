import { Card } from '../common/Card';
import { Button } from '../common/Button';
import type { TeamMember } from '../../types';

interface TeamMemberCardProps {
  member: TeamMember;
  onViewTasks: (member: TeamMember) => void;
  taskCount?: number;
}

export const TeamMemberCard = ({
  member,
  onViewTasks,
  taskCount,
}: TeamMemberCardProps) => {
  return (
    <Card>
      <div style={{ marginBottom: '1rem' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '0.75rem',
          }}
        >
          <div
            style={{
              width: '3rem',
              height: '3rem',
              borderRadius: '50%',
              backgroundColor: '#3b82f6',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.25rem',
              fontWeight: '600',
              marginRight: '1rem',
            }}
          >
            {member.name.charAt(0).toUpperCase()}
          </div>
          <div style={{ flex: 1 }}>
            <h3
              style={{
                fontSize: '1.125rem',
                fontWeight: '600',
                color: '#111827',
                margin: 0,
                marginBottom: '0.25rem',
              }}
            >
              {member.name}
            </h3>
            <p
              style={{
                color: '#6b7280',
                fontSize: '0.875rem',
                margin: 0,
              }}
            >
              {member.email}
            </p>
          </div>
        </div>

        <div
          style={{
            padding: '0.75rem',
            backgroundColor: '#f3f4f6',
            borderRadius: '0.375rem',
            marginBottom: '1rem',
          }}
        >
          <p
            style={{
              fontSize: '0.875rem',
              color: '#6b7280',
              margin: 0,
            }}
          >
            <strong>ID de Usuario:</strong> {member.id}
          </p>
          {taskCount !== undefined && (
            <p
              style={{
                fontSize: '0.875rem',
                color: '#6b7280',
                margin: 0,
                marginTop: '0.25rem',
              }}
            >
              <strong>Tareas asignadas:</strong>{' '}
              <span
                style={{
                  color: '#3b82f6',
                  fontWeight: '600',
                }}
              >
                {taskCount}
              </span>
            </p>
          )}
        </div>
      </div>

      <Button
        onClick={() => onViewTasks(member)}
        fullWidth
        style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
      >
        Ver Tareas Asignadas
      </Button>
    </Card>
  );
};
