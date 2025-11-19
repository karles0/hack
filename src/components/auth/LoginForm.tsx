import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { ROUTES } from '../../utils/constants';
import type { ApiError } from '../../types';

export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login({ email, password });
      navigate(ROUTES.DASHBOARD);
    } catch (err) {
      const apiError = err as ApiError;
      let errorMessage = 'Invalid credentials. Please try again.';

 

      if (apiError.detail) {

        if (Array.isArray(apiError.detail)) {

          errorMessage = apiError.detail.map(d => d.msg).join(', ');

        } else {

          errorMessage = apiError.detail;

        }

      } else if (apiError.message) {

        errorMessage = apiError.message;

      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ width: '100%' }}>
      {error && (
        <div
          style={{
            padding: '0.75rem',
            marginBottom: '1rem',
            backgroundColor: '#fee2e2',
            color: '#991b1b',
            borderRadius: '0.375rem',
            fontSize: '0.875rem',
          }}
        >
          {error}
        </div>
      )}

      <Input
        type="email"
        label="Email"
        placeholder="user@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        autoComplete="email"
      />

      <Input
        type="password"
        label="Password"
        placeholder="Enter your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        autoComplete="current-password"
      />

      <Button type="submit" fullWidth isLoading={isLoading}>
        {isLoading ? 'Logging in...' : 'Login'}
      </Button>

      <div
        style={{
          marginTop: '1rem',
          textAlign: 'center',
          fontSize: '0.875rem',
          color: '#6b7280',
        }}
      >
        Don't have an account?{' '}
        <a
          href={ROUTES.REGISTER}
          style={{
            color: '#3b82f6',
            textDecoration: 'none',
            fontWeight: '500',
          }}
        >
          Register here
        </a>
      </div>
    </form>
  );
};
