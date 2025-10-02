// Comprehensive error handling system
import { ApiResponse } from './api'

export class AppError extends Error {
  public statusCode: number
  public isOperational: boolean
  public context?: Record<string, any>

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true, context?: Record<string, any>) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = isOperational
    this.context = context

    Error.captureStackTrace(this, this.constructor)
  }
}

export class ValidationError extends AppError {
  constructor(message: string, context?: Record<string, any>) {
    super(message, 400, true, context)
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication required') {
    super(message, 401, true)
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Insufficient permissions') {
    super(message, 403, true)
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(message, 404, true)
  }
}

export class ConflictError extends AppError {
  constructor(message: string = 'Resource already exists') {
    super(message, 409, true)
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = 'Too many requests') {
    super(message, 429, true)
  }
}

export class DatabaseError extends AppError {
  constructor(message: string = 'Database operation failed', context?: Record<string, any>) {
    super(message, 500, false, context)
  }
}

export class ExternalServiceError extends AppError {
  constructor(message: string = 'External service unavailable', context?: Record<string, any>) {
    super(message, 502, false, context)
  }
}

// Error handler class
export class ErrorHandler {
  static handle(error: any): ApiResponse {
    console.error('Error occurred:', error)

    // Handle known error types
    if (error instanceof AppError) {
      return {
        success: false,
        error: error.message,
        ...(error.context && { errors: error.context })
      }
    }

    // Handle Supabase errors
    if (error?.code) {
      switch (error.code) {
        case '23505': // Unique constraint violation
          return {
            success: false,
            error: 'This resource already exists',
            errors: { [error.column || 'field']: 'Must be unique' }
          }
        case '23503': // Foreign key constraint violation
          return {
            success: false,
            error: 'Referenced resource does not exist'
          }
        case '42501': // Insufficient privileges
          return {
            success: false,
            error: 'Insufficient permissions to perform this action'
          }
        case 'PGRST116': // Row not found
          return {
            success: false,
            error: 'Resource not found'
          }
        default:
          return {
            success: false,
            error: error.message || 'An unexpected error occurred'
          }
      }
    }

    // Handle network errors
    if (error?.name === 'NetworkError' || error?.message?.includes('fetch')) {
      return {
        success: false,
        error: 'Network error. Please check your connection and try again.'
      }
    }

    // Handle validation errors
    if (error?.details) {
      const errors: Record<string, string> = {}
      error.details.forEach((detail: any) => {
        errors[detail.field || 'unknown'] = detail.message
      })
      return {
        success: false,
        error: 'Validation failed',
        errors
      }
    }

    // Handle generic errors
    return {
      success: false,
      error: error?.message || 'An unexpected error occurred'
    }
  }

  static async handleAsync<T>(
    operation: () => Promise<T>
  ): Promise<ApiResponse<T>> {
    try {
      const result = await operation()
      return { success: true, data: result }
    } catch (error) {
      return this.handle(error)
    }
  }

  static logError(error: any, context?: Record<string, any>) {
    const errorInfo = {
      message: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString(),
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'Server',
      url: typeof window !== 'undefined' ? window.location.href : 'Server'
    }

    console.error('Error logged:', errorInfo)

    // In production, you would send this to an error tracking service
    // like Sentry, LogRocket, or Bugsnag
    if (process.env.NODE_ENV === 'production') {
      // Example: Sentry.captureException(error, { extra: context })
    }
  }
}

// Note: Error boundary components are now in src/components/ui/error-boundary.tsx
// Re-export for convenience
export { ErrorBoundary, withErrorBoundary, DefaultErrorFallback } from '@/components/ui/error-boundary'

// Utility functions for common error scenarios
export const ErrorUtils = {
  isNetworkError: (error: any): boolean => {
    return error?.name === 'NetworkError' || 
           error?.message?.includes('fetch') ||
           error?.message?.includes('network')
  },

  isValidationError: (error: any): boolean => {
    return error instanceof ValidationError || 
           error?.code === '23514' || // Check constraint violation
           error?.details
  },

  isAuthError: (error: any): boolean => {
    return error instanceof AuthenticationError || 
           error instanceof AuthorizationError ||
           error?.code === 'PGRST301' // JWT expired
  },

  isNotFoundError: (error: any): boolean => {
    return error instanceof NotFoundError || 
           error?.code === 'PGRST116'
  },

  getErrorMessage: (error: any): string => {
    if (error instanceof AppError) {
      return error.message
    }
    
    if (error?.message) {
      return error.message
    }
    
    return 'An unexpected error occurred'
  },

  getErrorContext: (error: any): Record<string, any> => {
    if (error instanceof AppError && error.context) {
      return error.context
    }
    
    return {}
  }
}
