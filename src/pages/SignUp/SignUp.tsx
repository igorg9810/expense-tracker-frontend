import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Input from '../../components/Input';
import InputLabel from '../../components/InputLabel';
import PasswordInput from '../../components/PasswordInput';
import Button from '../../components/Button';
import { authSchemas } from '../../utils/validation';
import { authApiClient } from '../../utils/auth';
import styles from './SignUp.module.css';

type SignUpFormData = yup.InferType<typeof authSchemas.signUp>;

/**
 * SignUp Page Component
 *
 * User registration page for creating a new account with form validation.
 */
const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string>('');
  const [showSuccess, setShowSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<SignUpFormData>({
    resolver: yupResolver(authSchemas.signUp),
    mode: 'onChange',
  });

  const onSubmit = async (data: SignUpFormData) => {
    setIsLoading(true);
    setSubmitError('');

    try {
      // Make actual API call to POST /api/auth/sign-up
      console.log('Sign up data:', data);

      const response = await authApiClient.signUp({
        name: data.name,
        email: data.email,
        password: data.password,
      });

      console.log('Sign up response:', response.data);
      setShowSuccess(true);

      // Redirect to sign-in page after a brief delay
      setTimeout(() => {
        navigate('/sign-in', {
          state: { message: 'Account created successfully! Please sign in.' },
        });
      }, 2000);
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : 'Registration failed. Please try again.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    reset();
    setSubmitError('');
    setShowSuccess(false);
  };

  if (showSuccess) {
    return (
      <div className={styles.authForm}>
        <div className={styles.successContainer}>
          <div className={styles.successIcon}>✅</div>
          <h1 className={styles.successTitle}>Welcome aboard!</h1>
          <p className={styles.successMessage}>
            Your account has been created successfully. Redirecting you to the sign-in page...
          </p>
          <div className={styles.loader}>
            <div className={styles.dots}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.authForm}>
      <div className={styles.header}>
        <h1 className={styles.title}>Sign Up</h1>
        <p className={styles.subtitle}>Create your account to get started</p>
      </div>

      <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* Name Field */}
        <div className={styles.field}>
          <InputLabel htmlFor="name" required>
            Full Name
          </InputLabel>
          <Input
            id="name"
            type="text"
            placeholder="Enter your full name"
            name="name"
            onChange={register('name').onChange}
            onBlur={register('name').onBlur}
            ref={register('name').ref}
            error={Boolean(errors.name)}
            helperText={errors.name?.message}
            disabled={isLoading}
          />
        </div>

        {/* Email Field */}
        <div className={styles.field}>
          <InputLabel htmlFor="email" required>
            Email Address
          </InputLabel>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            name="email"
            onChange={register('email').onChange}
            onBlur={register('email').onBlur}
            ref={register('email').ref}
            error={Boolean(errors.email)}
            helperText={errors.email?.message}
            disabled={isLoading}
          />
        </div>

        {/* Password Field */}
        <div className={styles.field}>
          <InputLabel htmlFor="password" required>
            Password
          </InputLabel>
          <PasswordInput
            id="password"
            placeholder="Create a secure password"
            name="password"
            onChange={register('password').onChange}
            onBlur={register('password').onBlur}
            ref={register('password').ref}
            error={errors.password?.message}
            helperText={
              !errors.password
                ? '8-12 characters with uppercase, lowercase, and numbers'
                : undefined
            }
            disabled={isLoading}
            required
          />
        </div>

        {/* Submit Error */}
        {submitError && (
          <div className={styles.errorMessage} role="alert">
            <span className={styles.errorIcon}>⚠️</span>
            <span>{submitError}</span>
          </div>
        )}

        {/* Submit Buttons */}
        <div className={styles.actions}>
          <Button
            type="submit"
            variant="primary"
            size="large"
            loading={isLoading}
            disabled={isLoading || !isValid}
            className={styles.submitButton}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </Button>

          <Button
            type="button"
            variant="secondary"
            size="large"
            onClick={handleReset}
            disabled={isLoading}
            className={styles.resetButton}
          >
            Clear Form
          </Button>
        </div>

        {/* Navigation Links */}
        <div className={styles.links}>
          <div className={styles.divider}>
            Already have an account?{' '}
            <Link to="/sign-in" className={styles.link}>
              Sign In
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
