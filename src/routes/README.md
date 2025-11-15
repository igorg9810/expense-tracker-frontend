# Routing System

This directory contains the routing configuration for the Expense Tracker application using React Router DOM v6+.

## Structure

- `AppRouter.tsx` - Main router component with route definitions
- `constants.ts` - Route path constants and metadata
- `index.ts` - Entry point that exports router and constants

## Routes

| Path | Component | Description |
|------|-----------|-------------|
| `/` | ExpenseTable | Home page (redirects to expense table) |
| `/expense-table` | ExpenseTable | Main expense tracking interface |
| `/sign-in` | SignIn | User authentication page |
| `/sign-up` | SignUp | User registration page |
| `/forgot-password` | ForgotPassword | Password reset request page |
| `/verification-code` | VerificationCode | Email verification page |
| `/restore-password` | RestorePassword | New password creation page |
| `/success` | Success | Success confirmation page |

## Usage

The routing system is automatically integrated into the main App component:

```tsx
import AppRouter from './routes';

function App() {
  return <AppRouter />;
}
```

## Features

- **React Router DOM v6+** - Modern routing with data APIs
- **Type-safe route constants** - Centralized route definitions
- **Route metadata** - Additional information for each route (title, description, protection status)
- **Catch-all handling** - Redirects unknown routes to the main page
- **Modular structure** - Easy to maintain and extend

## Navigation

All page components use React Router's `Link` component for navigation:

```tsx
import { Link } from 'react-router-dom';

<Link to="/sign-in">Sign In</Link>
```

Route constants can be imported for type safety:

```tsx
import { ROUTES } from './routes';

<Link to={ROUTES.SIGN_IN}>Sign In</Link>
```