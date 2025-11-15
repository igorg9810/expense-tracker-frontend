/**
 * PrivateRoute Component
 *
 * A reusable route guard component that protects routes requiring authentication.
 * Redirects unauthenticated users to the sign-in page while preserving the
 * intended destination in the URL state.
 */

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../utils/hooks';
import Loader from '../components/Loader';

interface PrivateRouteProps {
  children: React.ReactNode;
}

/**
 * PrivateRoute Component
 *
 * Wraps protected components and handles authentication checks
 * @param children - The component(s) to render if authenticated
 */
const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication status
  if (isLoading) {
    return <Loader />;
  }

  // If not authenticated, redirect to sign-in with return URL
  if (!isAuthenticated) {
    return <Navigate to="/auth/sign-in" state={{ from: location }} replace />;
  }

  // User is authenticated, render the protected content
  return <>{children}</>;
};

export default PrivateRoute;
