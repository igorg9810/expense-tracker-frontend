import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Input from '../../components/Input';
import InputLabel from '../../components/InputLabel';
import Button from '../../components/Button';
import { authSchemas } from '../../utils/validation/schemas';
import { apiClient } from '../../utils/auth';
import styles from './ForgotPassword.module.css';

interface ForgotPasswordFormData {
  email: string;
}

/**
 * ForgotPassword Page Component
 *
 * Allows users to request a password reset by entering their email address.
 * Sends a reset code to the user's email and navigates to the verification step.
 */
const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid, touchedFields },
    getValues,
  } = useForm<ForgotPasswordFormData>({
    resolver: yupResolver(authSchemas.forgotPassword),
    mode: 'onChange',
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      setIsLoading(true);
      setApiError('');

      // Make API call to request password reset
      await apiClient.post('/api/auth/forgot-password', data);

      // Show success state briefly
      setIsSuccess(true);

      // Navigate to reset code page after short delay
      setTimeout(() => {
        navigate('/auth/verification-code', {
          state: { email: data.email, fromForgotPassword: true },
        });
      }, 1500);
    } catch (error: unknown) {
      console.error('Forgot password error:', error);

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
            setError(field as keyof ForgotPasswordFormData, {
              type: 'server',
              message: messages[0],
            });
          }
        });
      } else {
        // Handle general errors
        let errorMessage = 'An error occurred while sending reset instructions';

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

  // Get register props for email field
  const emailRegister = register('email');
  const {
    onChange: emailOnChange,
    onBlur: emailOnBlur,
    name: emailName,
    ref: emailRef,
  } = emailRegister;

  if (isSuccess) {
    return (
      <div className={styles.authForm}>
        <div className={styles.successContainer}>
          <div className={styles.successIcon}>✓</div>
          <h1 className={styles.title}>Check Your Email</h1>
          <p className={styles.subtitle}>
            We&apos;ve sent a reset code to <strong>{getValues('email')}</strong>
          </p>
          <p className={styles.helperText}>
            If you don&apos;t see the email, check your spam folder.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.authForm}>
      <div className={styles.header}>
        <h1 className={styles.title}>Reset Password</h1>
        <p className={styles.subtitle}>Enter your email to receive reset instructions</p>
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
            placeholder="Enter your email address"
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

        <div className={styles.actions}>
          <Button
            type="submit"
            variant="primary"
            size="large"
            fullWidth
            disabled={isLoading || !isValid}
            loading={isLoading}
          >
            {isLoading ? 'Sending Instructions...' : 'Send Reset Instructions'}
          </Button>
        </div>

        <div className={styles.links}>
          <Link to="/auth/sign-in" className={styles.link}>
            ← Back to Sign In
          </Link>
          <div className={styles.divider}>
            Don&apos;t have an account?{' '}
            <Link to="/auth/sign-up" className={styles.link}>
              Sign Up
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword;
