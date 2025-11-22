import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated, hasRole } from '@/lib/auth';

type Props = {
  children: React.ReactNode;
  allowedRoles?: string[] | string;
};

export default function ProtectedRoute({ children, allowedRoles }: Props) {
  // Not logged in -> go to login
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  // If allowedRoles provided, check role
  if (allowedRoles) {
    const ok = hasRole(allowedRoles);
    if (!ok) return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
