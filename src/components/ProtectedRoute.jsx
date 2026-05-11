import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, is2FAVerified, userRole } = useAuth();

  // If completely unauthenticated, send to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated but hasn't done 2FA, send to verify page
  if (isAuthenticated && !is2FAVerified) {
    return <Navigate to="/verify-2fa" replace />;
  }

  // If they are logged in with 2FA, but try to access a route they don't have the role for
  if (!allowedRoles.includes(userRole)) {
    // If Admin tries to access SuperAdmin, kick them to their own dashboard
    if (userRole === 'ADMIN') {
      return <Navigate to="/admin" replace />;
    }
    // Fallback: send them home
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
