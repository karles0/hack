import { useAuth } from '../../hooks/useAuth';
import { NotFound } from '../../pages/NotFound';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated } = useAuth();
    

  if (!isAuthenticated) {
    return <NotFound />;
  }

  return <>{children}</>;
};
