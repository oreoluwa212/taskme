// src/utils/validations.js
export const validationRules = {
  required: (value) => !!value || 'This field is required',
  email: (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value) || 'Please enter a valid email address';
  },
  password: (value) => {
    if (value.length < 8) return 'Password must be at least 8 characters';
    if (!/(?=.*[a-z])/.test(value)) return 'Password must contain at least one lowercase letter';
    if (!/(?=.*[A-Z])/.test(value)) return 'Password must contain at least one uppercase letter';
    if (!/(?=.*\d)/.test(value)) return 'Password must contain at least one number';
    if (!/(?=.*[@$!%*?&])/.test(value)) return 'Password must contain at least one special character';
    return true;
  },
  confirmPassword: (value, password) => {
    return value === password || 'Passwords do not match';
  },
  minLength: (min) => (value) => {
    return value.length >= min || `Minimum ${min} characters required`;
  },
  maxLength: (max) => (value) => {
    return value.length <= max || `Maximum ${max} characters allowed`;
  },
  name: (value) => {
    if (!value) return 'Name is required';
    if (value.length < 2) return 'Name must be at least 2 characters';
    if (value.length > 50) return 'Name must be less than 50 characters';
    if (!/^[a-zA-Z\s]+$/.test(value)) return 'Name can only contain letters and spaces';
    return true;
  },
  code: (value) => {
    if (!value) return 'Verification code is required';
    if (!/^\d{5}$/.test(value)) return 'Verification code must be 5 digits';
    return true;
  },
};

export const validateForm = (values, rules) => {
  const errors = {};
  
  Object.keys(rules).forEach((field) => {
    const fieldRules = rules[field];
    const value = values[field];
    
    for (const rule of fieldRules) {
      const result = typeof rule === 'function' ? rule(value) : rule;
      if (result !== true) {
        errors[field] = result;
        break;
      }
    }
  });
  
  return errors;
};