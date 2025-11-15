import * as yup from 'yup';

// Common validation rules that can be reused across forms
export const validationRules = {
  name: yup
    .string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must not exceed 50 characters')
    .matches(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),

  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email address')
    .max(255, 'Email must not exceed 255 characters'),

  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .max(12, 'Password must not exceed 12 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number',
    ),

  confirmPassword: (passwordFieldName = 'password') =>
    yup
      .string()
      .required('Please confirm your password')
      .oneOf([yup.ref(passwordFieldName)], 'Passwords do not match'),
};

// Common schemas for authentication forms
export const authSchemas = {
  signUp: yup.object({
    name: validationRules.name,
    email: validationRules.email,
    password: validationRules.password,
  }),

  signIn: yup.object({
    email: validationRules.email,
    password: yup.string().required('Password is required'),
  }),

  forgotPassword: yup.object({
    email: validationRules.email,
  }),

  resetCode: yup.object({
    code: yup
      .string()
      .required('Reset code is required')
      .matches(/^[0-9]{6}$/, 'Reset code must be exactly 6 digits')
      .length(6, 'Reset code must be exactly 6 digits'),
  }),

  restorePassword: yup.object({
    code: yup
      .string()
      .required('Reset code is required')
      .matches(/^[0-9]{6}$/, 'Reset code must be exactly 6 digits')
      .length(6, 'Reset code must be exactly 6 digits'),
    password: validationRules.password,
    confirmPassword: validationRules.confirmPassword(),
  }),
};

// Helper function to format validation errors from backend
export const formatValidationErrors = (
  errors: Record<string, string[]>,
): Record<string, string> => {
  const formattedErrors: Record<string, string> = {};

  Object.entries(errors).forEach(([field, messages]) => {
    if (Array.isArray(messages) && messages.length > 0) {
      formattedErrors[field] = messages[0]; // Take the first error message
    }
  });

  return formattedErrors;
};
