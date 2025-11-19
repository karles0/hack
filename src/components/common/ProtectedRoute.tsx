import { useAuth } from '../../hooks/useAuth';
import { NotFound } from '../../pages/NotFound';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            fontSize: '1.25rem',
            color: '#6b7280',
          }}
        >
          Loading...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <NotFound />;
  }

  return <>{children}</>;
};
