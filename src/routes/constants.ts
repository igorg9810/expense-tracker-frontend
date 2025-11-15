// Route path constants
export const ROUTES = {
  HOME: '/',
  EXPENSE_TABLE: '/expense-table',
  // Direct auth routes (for backward compatibility)
  SIGN_IN: '/sign-in',
  SIGN_UP: '/sign-up',
  FORGOT_PASSWORD: '/forgot-password',
  VERIFICATION_CODE: '/verification-code',
  RESTORE_PASSWORD: '/restore-password',
  SUCCESS: '/success',
  // Nested auth routes
  AUTH: '/auth',
  AUTH_SIGN_IN: '/auth/sign-in',
  AUTH_SIGN_UP: '/auth/sign-up',
  AUTH_FORGOT_PASSWORD: '/auth/forgot-password',
  AUTH_VERIFICATION_CODE: '/auth/verification-code',
  AUTH_RESTORE_PASSWORD: '/auth/restore-password',
  AUTH_SUCCESS: '/auth/success',
} as const;

// Route metadata for navigation and breadcrumbs
export const ROUTE_METADATA = {
  [ROUTES.HOME]: {
    title: 'Expense Tracker',
    description: 'Track and manage your expenses',
    isProtected: false,
  },
  [ROUTES.EXPENSE_TABLE]: {
    title: 'Expenses',
    description: 'View and manage your expense records',
    isProtected: true,
  },
  [ROUTES.SIGN_IN]: {
    title: 'Sign In',
    description: 'Sign in to your account',
    isProtected: false,
  },
  [ROUTES.SIGN_UP]: {
    title: 'Sign Up',
    description: 'Create a new account',
    isProtected: false,
  },
  [ROUTES.FORGOT_PASSWORD]: {
    title: 'Reset Password',
    description: 'Reset your password',
    isProtected: false,
  },
  [ROUTES.VERIFICATION_CODE]: {
    title: 'Verify Email',
    description: 'Verify your email address',
    isProtected: false,
  },
  [ROUTES.RESTORE_PASSWORD]: {
    title: 'Create New Password',
    description: 'Create a new password',
    isProtected: false,
  },
  [ROUTES.SUCCESS]: {
    title: 'Success',
    description: 'Operation completed successfully',
    isProtected: false,
  },
} as const;

export type RouteKey = keyof typeof ROUTES;
