import { useNavigate } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { ROUTES } from '../utils/constants';

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f3f4f6',
        padding: '2rem',
      }}
    >
      <div style={{ textAlign: 'center', maxWidth: '500px' }}>
        <h1
          style={{
            fontSize: '6rem',
            fontWeight: '700',
            color: '#3b82f6',
            margin: 0,
            lineHeight: 1,
          }}
        >
          404
        </h1>
        <h2
          style={{
            fontSize: '2rem',
            fontWeight: '600',
            color: '#111827',
            marginTop: '1rem',
            marginBottom: '1rem',
          }}
        >
          Page Not Found
        </h2>
        <p
          style={{
            fontSize: '1.125rem',
            color: '#6b7280',
            marginBottom: '2rem',
          }}
        >
          Sorry, the page you are looking for doesn't exist or you don't have access to it.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Button onClick={() => navigate(-1)} variant="secondary">
            Go Back
          </Button>
          <Button onClick={() => navigate(ROUTES.DASHBOARD)}>
            Go to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};
