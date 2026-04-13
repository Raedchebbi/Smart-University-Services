import { Navigate } from 'react-router-dom';
import { useAuth } from './useAuth';
import type { ReactNode } from 'react';

interface Props {
  roles: string[];
  children: ReactNode;
}

export function ProtectedRoute({ roles, children }: Props) {
  const { authenticated, hasRole } = useAuth();

  if (!authenticated) {
    return <Navigate to="/" replace />;
  }

  const allowed = roles.some((r) => hasRole(r));
  if (!allowed) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}
