import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// Import layout components
import { AuthLayout } from '../layouts';

// Import route protection
import PrivateRoute from './PrivateRoute';

// Import page components
import ExpenseTable from '../pages/ExpenseTable';
import Profile from '../pages/Profile';
import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';
import ForgotPassword from '../pages/ForgotPassword';
import VerificationCode from '../pages/VerificationCode';
import RestorePassword from '../pages/RestorePassword';
import Success from '../pages/Success';

// Define route configuration
const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <PrivateRoute>
        <ExpenseTable />
      </PrivateRoute>
    ),
  },
  {
    path: '/expense-table',
    element: (
      <PrivateRoute>
        <ExpenseTable />
      </PrivateRoute>
    ),
  },
  {
    path: '/profile',
    element: (
      <PrivateRoute>
        <Profile />
      </PrivateRoute>
    ),
  },
  // Authentication routes with AuthLayout
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      {
        path: 'sign-in',
        element: <SignIn />,
      },
      {
        path: 'sign-up',
        element: <SignUp />,
      },
      {
        path: 'forgot-password',
        element: <ForgotPassword />,
      },
      {
        path: 'verification-code',
        element: <VerificationCode />,
      },
      {
        path: 'restore-password',
        element: <RestorePassword />,
      },
      {
        path: 'success',
        element: <Success />,
      },
    ],
  },
  // Legacy direct routes (for backward compatibility)
  {
    path: '/sign-in',
    element: (
      <AuthLayout>
        <SignIn />
      </AuthLayout>
    ),
  },
  {
    path: '/sign-up',
    element: (
      <AuthLayout>
        <SignUp />
      </AuthLayout>
    ),
  },
  {
    path: '/forgot-password',
    element: (
      <AuthLayout>
        <ForgotPassword />
      </AuthLayout>
    ),
  },
  {
    path: '/verification-code',
    element: (
      <AuthLayout>
        <VerificationCode />
      </AuthLayout>
    ),
  },
  {
    path: '/restore-password',
    element: (
      <AuthLayout>
        <RestorePassword />
      </AuthLayout>
    ),
  },
  {
    path: '/success',
    element: (
      <AuthLayout>
        <Success />
      </AuthLayout>
    ),
  },
  // Catch-all route for 404s (optional)
  {
    path: '*',
    element: (
      <PrivateRoute>
        <ExpenseTable />
      </PrivateRoute>
    ),
  },
]);

// Router component that provides routing context
const AppRouter: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;
