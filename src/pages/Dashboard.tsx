import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { ROUTES } from '../utils/constants';

export const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

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
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2rem',
          }}
        >
          <h1
            style={{
              fontSize: '2rem',
              fontWeight: '700',
              color: '#111827',
            }}
          >
            Dashboard
          </h1>
          <Button variant="secondary" onClick={handleLogout}>
            Logout
          </Button>
        </div>

        <Card>
          <h2
            style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              marginBottom: '1rem',
              color: '#111827',
            }}
          >
            Welcome, {user?.name}!
          </h2>
          <div style={{ marginBottom: '1rem' }}>
            <p style={{ color: '#6b7280', marginBottom: '0.5rem' }}>
              <strong>Email:</strong> {user?.email}
            </p>
          </div>
          <div
            style={{
              padding: '1rem',
              backgroundColor: '#dbeafe',
              borderRadius: '0.375rem',
              color: '#1e40af',
            }}
          >
            You are successfully logged in! This is your dashboard.
          </div>
        </Card>

        <div style={{ marginTop: '2rem' }}>
          <Card title="Quick Links">
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Button onClick={() => navigate(ROUTES.PROJECTS)}>
                Go to Projects
              </Button>
              <Button onClick={() => navigate(ROUTES.TASKS)}>
                Go to Tasks
              </Button>
              <Button onClick={() => navigate(ROUTES.TEAM)}>
                Go to Team
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
