import * as yup from 'yup';

export const loginSchema = yup.object({
  email: yup
    .string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

export const registerSchema = yup.object({
  first_name: yup
    .string()
    .min(2, 'First name must be at least 2 characters')
    .required('First name is required'),
  last_name: yup
    .string()
    .min(2, 'Last name must be at least 2 characters')
    .required('Last name is required'),
  email: yup
    .string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain at least 1 uppercase letter, 1 number, and 1 special character'
    )
    .required('Password is required'),
  phone_number: yup
    .string()
    .matches(/^\d{10}$/, 'Phone number must be exactly 10 digits')
    .required('Phone number is required'),
  nic: yup
    .string()
    .matches(/^[a-zA-Z0-9]{10,12}$/, 'NIC must be 10-12 alphanumeric characters')
    .required('NIC is required'),
  location: yup
    .string()
    .min(3, 'Location must be at least 3 characters')
    .required('Location is required'),
  postal_code: yup
    .string()
    .matches(/^\d{5}$/, 'Postal code must be exactly 5 digits')
    .required('Postal code is required'),
  gov_bill_proof: yup
    .mixed()
    .required('Government bill proof file is required')
    .test('gov_bill_proof', 'Government bill proof file is required', (value) => {
      if (!value) return false;
      if (Array.isArray(value)) return value.length > 0;
      if (value instanceof FileList) return value.length > 0;
      return false;
    })
    .test('fileSize', 'File size must not exceed 5MB', (value) => {
      if (!value) return true;
      const file = Array.isArray(value) ? value[0] : value instanceof FileList ? value[0] : null;
      if (!file) return true;
      return file.size <= 5 * 1024 * 1024;
    })
    .test('fileType', 'File must be JPEG, PNG, or PDF', (value) => {
      if (!value) return true;
      const file = Array.isArray(value) ? value[0] : value instanceof FileList ? value[0] : null;
      if (!file) return true;
      const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
      return allowedTypes.includes(file.type);
    }),
  terms: yup
    .boolean()
    .oneOf([true], 'You must accept the Terms & Conditions')
    .required('You must accept the Terms & Conditions'),
});

export const forgotPasswordSchema = yup.object({
  email: yup
    .string()
    .email('Please enter a valid email address')
    .required('Email is required'),
});
