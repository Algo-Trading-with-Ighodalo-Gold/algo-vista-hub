// Validation utilities for form inputs and data

export interface ValidationResult {
  isValid: boolean
  errors: Record<string, string>
}

export interface ValidationRule {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  custom?: (value: any) => string | null
}

export const validationRules = {
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Please enter a valid email address'
  },
  password: {
    required: true,
    minLength: 8,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    message: 'Password must be at least 8 characters with uppercase, lowercase, number, and special character'
  },
  name: {
    required: true,
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-Z\s'-]+$/,
    message: 'Name must be 2-50 characters and contain only letters, spaces, hyphens, and apostrophes'
  },
  phone: {
    pattern: /^[\+]?[1-9][\d]{0,15}$/,
    message: 'Please enter a valid phone number'
  },
  country: {
    required: true,
    message: 'Please select your country'
  },
  strategy: {
    required: true,
    minLength: 10,
    maxLength: 2000,
    message: 'Strategy description must be 10-2000 characters'
  },
  budget: {
    required: true,
    message: 'Please select a budget range'
  },
  timeline: {
    required: true,
    message: 'Please select a timeline'
  }
}

export function validateField(value: any, rules: ValidationRule): string | null {
  if (rules.required && (!value || value.toString().trim() === '')) {
    return 'This field is required'
  }

  if (value && rules.minLength && value.toString().length < rules.minLength) {
    return `Must be at least ${rules.minLength} characters`
  }

  if (value && rules.maxLength && value.toString().length > rules.maxLength) {
    return `Must be no more than ${rules.maxLength} characters`
  }

  if (value && rules.pattern && !rules.pattern.test(value.toString())) {
    return rules.message || 'Invalid format'
  }

  if (value && rules.custom) {
    return rules.custom(value)
  }

  return null
}

export function validateForm(data: Record<string, any>, rules: Record<string, ValidationRule>): ValidationResult {
  const errors: Record<string, string> = {}

  for (const [field, fieldRules] of Object.entries(rules)) {
    const error = validateField(data[field], fieldRules)
    if (error) {
      errors[field] = error
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

// Specific validation functions
export function validateEmail(email: string): string | null {
  return validateField(email, validationRules.email)
}

export function validatePassword(password: string): string | null {
  return validateField(password, validationRules.password)
}

export function validateName(name: string): string | null {
  return validateField(name, validationRules.name)
}

export function validatePhone(phone: string): string | null {
  if (!phone) return null // Phone is optional
  return validateField(phone, validationRules.phone)
}

export function validateCountry(country: string): string | null {
  return validateField(country, validationRules.country)
}

export function validateStrategy(strategy: string): string | null {
  return validateField(strategy, validationRules.strategy)
}

export function validateBudget(budget: string): string | null {
  return validateField(budget, validationRules.budget)
}

export function validateTimeline(timeline: string): string | null {
  return validateField(timeline, validationRules.timeline)
}

// Registration form validation
export function validateRegistrationForm(data: {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
  country: string
}): ValidationResult {
  const errors: Record<string, string> = {}

  // Validate individual fields
  const firstNameError = validateName(data.firstName)
  if (firstNameError) errors.firstName = firstNameError

  const lastNameError = validateName(data.lastName)
  if (lastNameError) errors.lastName = lastNameError

  const emailError = validateEmail(data.email)
  if (emailError) errors.email = emailError

  const passwordError = validatePassword(data.password)
  if (passwordError) errors.password = passwordError

  const countryError = validateCountry(data.country)
  if (countryError) errors.country = countryError

  // Validate password confirmation
  if (data.password !== data.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

// Project inquiry form validation
export function validateProjectInquiryForm(data: {
  name: string
  email: string
  strategy: string
  entryLogic: string
  exitLogic: string
  budget: string
  timeline: string
}): ValidationResult {
  const errors: Record<string, string> = {}

  const nameError = validateName(data.name)
  if (nameError) errors.name = nameError

  const emailError = validateEmail(data.email)
  if (emailError) errors.email = emailError

  const strategyError = validateStrategy(data.strategy)
  if (strategyError) errors.strategy = strategyError

  if (!data.entryLogic || data.entryLogic.trim().length < 10) {
    errors.entryLogic = 'Entry logic must be at least 10 characters'
  }

  if (!data.exitLogic || data.exitLogic.trim().length < 10) {
    errors.exitLogic = 'Exit logic must be at least 10 characters'
  }

  const budgetError = validateBudget(data.budget)
  if (budgetError) errors.budget = budgetError

  const timelineError = validateTimeline(data.timeline)
  if (timelineError) errors.timeline = timelineError

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

// Sanitization functions
export function sanitizeString(input: string): string {
  return input.trim().replace(/[<>]/g, '')
}

export function sanitizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

export function sanitizeTextarea(input: string): string {
  return input.trim().replace(/[<>]/g, '')
}





