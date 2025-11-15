import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Input from '../../components/Input';
import InputLabel from '../../components/InputLabel';
import PasswordInput from '../../components/PasswordInput';
import Button from '../../components/Button';
import { authSchemas } from '../../utils/validation/schemas';
import { authApiClient, authUtils } from '../../utils/auth';
import styles from './SignIn.module.css';

interface SignInFormData {
  email: string;
  password: string;
}

/**
 * SignIn Page Component
 *
 * User authentication page for signing into the application.
 * Handles user login with email and password validation.
 */
const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string>('');

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid, touchedFields },
  } = useForm<SignInFormData>({
    resolver: yupResolver(authSchemas.signIn),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: SignInFormData) => {
    try {
      setIsLoading(true);
      setApiError('');

      // Make API call to backend
      const response = await authApiClient.login(data);

      // Extract tokens from response (backend returns data.data.accessToken)
      const { accessToken } = response.data.data;

      // Store tokens using auth utilities
      authUtils.login({ accessToken });

      // Redirect to intended destination or default to root
      const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/';
      navigate(from, { replace: true });
    } catch (error: unknown) {
      console.error('Sign in error:', error);

      // Type guard to check if error is axios error
      const isAxiosError = (
        err: unknown,
      ): err is {
        response?: { data?: { errors?: Record<string, string[]>; message?: string } };
      } => {
        return typeof err === 'object' && err !== null && 'response' in err;
      };

      // Handle validation errors from backend
      if (isAxiosError(error) && error.response?.data?.errors) {
        const backendErrors = error.response.data.errors;
        Object.entries(backendErrors).forEach(([field, messages]) => {
          if (Array.isArray(messages) && messages.length > 0) {
            setError(field as keyof SignInFormData, {
              type: 'server',
              message: messages[0],
            });
          }
        });
      } else {
        // Handle general errors
        let errorMessage = 'An error occurred during sign in';

        if (isAxiosError(error) && error.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error instanceof Error) {
          errorMessage = error.message;
        }

        setApiError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Get register props for form fields
  const emailRegister = register('email');
  const {
    onChange: emailOnChange,
    onBlur: emailOnBlur,
    name: emailName,
    ref: emailRef,
  } = emailRegister;
  const passwordRegister = register('password');
  const {
    onChange: passwordOnChange,
    onBlur: passwordOnBlur,
    name: passwordName,
    ref: passwordRef,
  } = passwordRegister;
  return (
    <div className={styles.authForm}>
      <div className={styles.header}>
        <h1 className={styles.title}>Sign In</h1>
        <p className={styles.subtitle}>Welcome back! Please sign in to your account.</p>
      </div>

      <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
        {apiError && (
          <div className={styles.errorMessage} role="alert">
            {apiError}
          </div>
        )}

        <div className={styles.inputGroup}>
          <InputLabel htmlFor="email" required>
            Email Address
          </InputLabel>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            disabled={isLoading}
            error={Boolean(errors.email)}
            success={touchedFields.email && !errors.email}
            errorMessage={errors.email?.message}
            aria-invalid={Boolean(errors.email)}
            onChange={emailOnChange}
            onBlur={emailOnBlur}
            name={emailName}
            ref={emailRef}
          />
        </div>

        <div className={styles.inputGroup}>
          <PasswordInput
            id="password"
            label="Password"
            placeholder="Enter your password"
            disabled={isLoading}
            error={errors.password?.message}
            success={touchedFields.password && !errors.password}
            required
            onChange={passwordOnChange}
            onBlur={passwordOnBlur}
            name={passwordName}
            ref={passwordRef}
          />
        </div>

        <div className={styles.actions}>
          <Button
            type="submit"
            variant="primary"
            size="large"
            fullWidth
            disabled={isLoading || !isValid}
            loading={isLoading}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </Button>
        </div>

        <div className={styles.links}>
          <Link to="/forgot-password" className={styles.link}>
            Forgot Password?
          </Link>
          <div className={styles.divider}>
            Don&apos;t have an account?{' '}
            <Link to="/sign-up" className={styles.link}>
              Sign Up
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SignIn;
