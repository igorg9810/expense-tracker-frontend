import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Button from '../../components/Button';
import { authSchemas } from '../../utils/validation/schemas';
import { apiClient } from '../../utils/auth';
import styles from './VerificationCode.module.css';

interface VerificationCodeFormData {
  code: string;
}

interface LocationState {
  email?: string;
  fromForgotPassword?: boolean;
}

/**
 * VerificationCode Page Component
 *
 * Allows users to enter the 6-digit verification code sent to their email
 * for password reset. Validates the code and navigates to password reset form.
 */
const VerificationCode: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;

  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string>('');
  const [resendLoading, setResendLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Refs for code input boxes
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const {
    handleSubmit,
    setValue,
    watch,
    setError,
    formState: { errors, isValid },
  } = useForm<VerificationCodeFormData>({
    resolver: yupResolver(authSchemas.resetCode),
    mode: 'onChange',
    defaultValues: {
      code: '',
    },
  });

  const codeValue = watch('code');

  // Redirect if no email in state
  useEffect(() => {
    if (!state?.email || !state?.fromForgotPassword) {
      navigate('/auth/forgot-password', { replace: true });
    }
  }, [state, navigate]);

  // Handle cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleCodeChange = (index: number, value: string) => {
    // Only allow digits
    if (!/^\d*$/.test(value)) return;

    const newCode = codeValue.split('');
    newCode[index] = value;

    // Update form value
    const fullCode = newCode.join('');
    setValue('code', fullCode, { shouldValidate: true });

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !codeValue[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const digits = pastedData.replace(/\D/g, '').slice(0, 6);

    setValue('code', digits, { shouldValidate: true });

    // Focus the next empty input or the last one
    const nextIndex = Math.min(digits.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const onSubmit = async (data: VerificationCodeFormData) => {
    try {
      setIsLoading(true);
      setApiError('');

      // Navigate to restore password page with code
      navigate('/auth/restore-password', {
        state: {
          email: state?.email,
          code: data.code,
          fromVerificationCode: true,
        },
      });
    } catch (error: unknown) {
      console.error('Code verification error:', error);

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
            setError(field as keyof VerificationCodeFormData, {
              type: 'server',
              message: messages[0],
            });
          }
        });
      } else {
        // Handle general errors
        let errorMessage = 'Invalid verification code';

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

  const handleResendCode = async () => {
    if (!state?.email || resendCooldown > 0) return;

    try {
      setResendLoading(true);
      setApiError('');

      await apiClient.post('/api/auth/forgot-password', { email: state.email });

      // Start cooldown
      setResendCooldown(60);
    } catch (error: unknown) {
      console.error('Resend code error:', error);
      setApiError('Failed to resend code. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className={styles.authForm}>
      <div className={styles.header}>
        <h1 className={styles.title}>Enter Verification Code</h1>
        <p className={styles.subtitle}>
          We sent a 6-digit code to <strong>{state?.email}</strong>
        </p>
      </div>

      <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
        {apiError && (
          <div className={styles.errorMessage} role="alert">
            {apiError}
          </div>
        )}

        <div className={styles.inputGroup}>
          <div className={styles.codeInputs}>
            {Array.from({ length: 6 }, (_, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={codeValue[index] || ''}
                onChange={(e) => handleCodeChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className={`${styles.codeBox} ${
                  errors.code ? styles.error : ''
                } ${codeValue[index] ? styles.filled : ''}`}
                disabled={isLoading}
                aria-label={`Digit ${index + 1} of verification code`}
              />
            ))}
          </div>
          {errors.code && (
            <div className={styles.fieldError} role="alert">
              {errors.code.message}
            </div>
          )}
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
            {isLoading ? 'Verifying...' : 'Verify Code'}
          </Button>
        </div>

        <div className={styles.resendSection}>
          <p className={styles.resendText}>
            Didn&apos;t receive the code?{' '}
            <button
              type="button"
              onClick={handleResendCode}
              disabled={resendLoading || resendCooldown > 0}
              className={styles.resendButton}
            >
              {resendLoading
                ? 'Sending...'
                : resendCooldown > 0
                  ? `Resend in ${resendCooldown}s`
                  : 'Resend Code'}
            </button>
          </p>
        </div>

        <div className={styles.links}>
          <Link to="/auth/forgot-password" className={styles.link}>
            ← Back to Reset Password
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

export default VerificationCode;
