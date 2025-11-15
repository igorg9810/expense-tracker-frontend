import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Input from '../../components/Input';
import InputLabel from '../../components/InputLabel';
import Button from '../../components/Button';
import { authSchemas } from '../../utils/validation/schemas';
import { apiClient } from '../../utils/auth';
import styles from './RestorePassword.module.css';

interface RestorePasswordFormData {
  code: string;
  password: string;
  confirmPassword: string;
}

interface LocationState {
  email?: string;
  code?: string;
  fromVerificationCode?: boolean;
}

/**
 * RestorePassword Page Component
 *
 * Allows users to set a new password after email verification.
 * Validates the reset code and new password, then completes the password reset process.
 */
const RestorePassword: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;

  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string>('');

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid, touchedFields },
  } = useForm<RestorePasswordFormData>({
    resolver: yupResolver(authSchemas.restorePassword),
    mode: 'onChange',
    defaultValues: {
      code: state?.code || '',
      password: '',
      confirmPassword: '',
    },
  });

  // Redirect if no email/code in state
  useEffect(() => {
    if (!state?.email || !state?.code || !state?.fromVerificationCode) {
      navigate('/auth/forgot-password', { replace: true });
    }
  }, [state, navigate]);

  const onSubmit = async (data: RestorePasswordFormData) => {
    try {
      setIsLoading(true);
      setApiError('');

      // Make API call to restore password
      await apiClient.post('/api/auth/restore-password', {
        email: state?.email,
        code: data.code,
        password: data.password,
        password_confirmation: data.confirmPassword,
      });

      // Navigate to success page
      navigate('/auth/success', {
        state: {
          type: 'password-reset',
          email: state?.email,
          message: 'Your password has been successfully reset!',
        },
      });
    } catch (error: unknown) {
      console.error('Restore password error:', error);

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
            // Map backend field names to form field names
            let formField = field;
            if (field === 'password_confirmation') {
              formField = 'confirmPassword';
            }

            setError(formField as keyof RestorePasswordFormData, {
              type: 'server',
              message: messages[0],
            });
          }
        });
      } else {
        // Handle general errors
        let errorMessage = 'An error occurred while resetting your password';

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
  const codeRegister = register('code');
  const passwordRegister = register('password');
  const confirmPasswordRegister = register('confirmPassword');

  return (
    <div className={styles.authForm}>
      <div className={styles.header}>
        <h1 className={styles.title}>Create New Password</h1>
        <p className={styles.subtitle}>
          Enter your new password for <strong>{state?.email}</strong>
        </p>
      </div>

      <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
        {apiError && (
          <div className={styles.errorMessage} role="alert">
            {apiError}
          </div>
        )}

        {/* Hidden code field - populated from verification step */}
        <input type="hidden" {...codeRegister} />

        <div className={styles.inputGroup}>
          <InputLabel htmlFor="password" required>
            New Password
          </InputLabel>
          <Input
            id="password"
            type="password"
            placeholder="Enter your new password"
            disabled={isLoading}
            error={Boolean(errors.password)}
            success={touchedFields.password && !errors.password}
            errorMessage={errors.password?.message}
            aria-invalid={Boolean(errors.password)}
            onChange={passwordRegister.onChange}
            onBlur={passwordRegister.onBlur}
            name={passwordRegister.name}
            ref={passwordRegister.ref}
          />
          <div className={styles.passwordHint}>
            Password must be at least 8 characters long and contain uppercase, lowercase, number,
            and special character.
          </div>
        </div>

        <div className={styles.inputGroup}>
          <InputLabel htmlFor="confirmPassword" required>
            Confirm New Password
          </InputLabel>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Confirm your new password"
            disabled={isLoading}
            error={Boolean(errors.confirmPassword)}
            success={touchedFields.confirmPassword && !errors.confirmPassword}
            errorMessage={errors.confirmPassword?.message}
            aria-invalid={Boolean(errors.confirmPassword)}
            onChange={confirmPasswordRegister.onChange}
            onBlur={confirmPasswordRegister.onBlur}
            name={confirmPasswordRegister.name}
            ref={confirmPasswordRegister.ref}
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
            {isLoading ? 'Updating Password...' : 'Update Password'}
          </Button>
        </div>

        <div className={styles.links}>
          <Link
            to="/auth/verification-code"
            state={{ email: state?.email, fromForgotPassword: true }}
            className={styles.link}
          >
            ← Back to Verification
          </Link>
          <div className={styles.divider}>
            Remember your password?{' '}
            <Link to="/auth/sign-in" className={styles.link}>
              Sign In
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
};

export default RestorePassword;
