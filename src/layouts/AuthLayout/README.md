# AuthLayout Component

The AuthLayout component provides a consistent layout for all authentication pages in the Expense Tracker application. It features a responsive design with a split-screen layout on desktop and a mobile-optimized single-column layout.

## Features

### Desktop Layout (768px+)
- **Split Screen Design**: Branding section on the left, form section on the right
- **Branding Section**: Logo, hero text, and feature highlights
- **Form Section**: Authentication forms with frosted glass effect
- **Gradient Background**: Modern purple gradient with subtle patterns

### Mobile Layout (< 768px)
- **Single Column**: Optimized for mobile devices
- **Mobile Logo**: Compact logo at the top
- **Full-Screen Form**: Form takes up the entire viewport
- **Responsive Typography**: Scales appropriately for different screen sizes

## Usage

### With React Router (Nested Routes)
```tsx
// In router configuration
{
  path: '/auth',
  element: <AuthLayout />,
  children: [
    {
      path: 'sign-in',
      element: <SignIn />,
    },
    // ... other auth routes
  ],
}
```

### As Wrapper Component
```tsx
// Direct wrapping
<AuthLayout>
  <SignIn />
</AuthLayout>
```

### In Authentication Pages
Authentication page components should use minimal styling since they're wrapped in AuthLayout:

```tsx
const SignIn: React.FC = () => {
  return (
    <div className={styles.authForm}>
      <div className={styles.header}>
        <h1 className={styles.title}>Sign In</h1>
        <p className={styles.subtitle}>Welcome back!</p>
      </div>
      
      <div className={styles.formContent}>
        {/* Form content */}
      </div>
    </div>
  );
};
```

## CSS Classes

### Main Structure
- `.container` - Root container with full height
- `.background` - Gradient background with patterns
- `.content` - Main content flex container

### Branding Section
- `.brandingSection` - Left side branding area (hidden on mobile)
- `.logo` - Logo with icon and text
- `.heroText` - Main heading and description
- `.features` - Feature list with icons

### Form Section
- `.formSection` - Right side form area with glass effect
- `.formContainer` - Form wrapper with max width
- `.mobileLogo` - Mobile-only logo (hidden on desktop)
- `.formContent` - Content area for authentication forms

## Responsive Breakpoints

- **Mobile**: < 480px
- **Tablet**: 480px - 768px
- **Desktop**: > 768px
- **Large Desktop**: > 1024px
- **Ultra-wide**: > 1440px

## Accessibility Features

- High contrast mode support
- Reduced motion support
- Proper ARIA labeling
- Keyboard navigation friendly

## Customization

The layout uses CSS custom properties and can be customized by modifying the CSS variables:

```css
:root {
  --auth-primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --auth-glass-bg: rgba(255, 255, 255, 0.05);
  --auth-border: rgba(255, 255, 255, 0.1);
}
```

## Integration with Existing Pages

All authentication pages have been updated to work with AuthLayout:
- SignIn
- SignUp  
- ForgotPassword
- VerificationCode
- RestorePassword
- Success

The pages now use the `.authForm` class structure and transparent/glass styling to integrate seamlessly with the layout.