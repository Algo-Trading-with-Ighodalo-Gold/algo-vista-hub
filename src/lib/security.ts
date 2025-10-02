// Security utilities and helpers
import { log } from './logger'

export interface SecurityConfig {
  maxLoginAttempts: number
  lockoutDuration: number // in minutes
  passwordMinLength: number
  passwordRequireSpecialChars: boolean
  sessionTimeout: number // in minutes
  rateLimitWindow: number // in minutes
  rateLimitMaxRequests: number
}

export const defaultSecurityConfig: SecurityConfig = {
  maxLoginAttempts: 5,
  lockoutDuration: 15,
  passwordMinLength: 8,
  passwordRequireSpecialChars: true,
  sessionTimeout: 60,
  rateLimitWindow: 15,
  rateLimitMaxRequests: 100
}

export class SecurityManager {
  private static instance: SecurityManager
  private config: SecurityConfig
  private loginAttempts: Map<string, { count: number; lastAttempt: Date }> = new Map()
  private rateLimit: Map<string, { count: number; windowStart: Date }> = new Map()

  private constructor(config: SecurityConfig = defaultSecurityConfig) {
    this.config = config
  }

  static getInstance(config?: SecurityConfig): SecurityManager {
    if (!SecurityManager.instance) {
      SecurityManager.instance = new SecurityManager(config)
    }
    return SecurityManager.instance
  }

  // Password validation
  validatePassword(password: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = []

    if (password.length < this.config.passwordMinLength) {
      errors.push(`Password must be at least ${this.config.passwordMinLength} characters long`)
    }

    if (this.config.passwordRequireSpecialChars) {
      if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
        errors.push('Password must contain at least one special character')
      }
    }

    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter')
    }

    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter')
    }

    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number')
    }

    // Check for common passwords
    const commonPasswords = [
      'password', '123456', '123456789', 'qwerty', 'abc123', 'password123',
      'admin', 'letmein', 'welcome', 'monkey', '1234567890'
    ]

    if (commonPasswords.includes(password.toLowerCase())) {
      errors.push('Password is too common. Please choose a more secure password')
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  // Email validation
  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // Input sanitization
  sanitizeInput(input: string): string {
    return input
      .trim()
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/['"]/g, '') // Remove quotes
      .substring(0, 1000) // Limit length
  }

  // SQL injection prevention
  sanitizeForSQL(input: string): string {
    return input
      .replace(/[';]/g, '') // Remove SQL injection characters
      .replace(/--/g, '') // Remove SQL comments
      .replace(/union/gi, '') // Remove UNION keywords
      .replace(/select/gi, '') // Remove SELECT keywords
      .replace(/insert/gi, '') // Remove INSERT keywords
      .replace(/update/gi, '') // Remove UPDATE keywords
      .replace(/delete/gi, '') // Remove DELETE keywords
      .replace(/drop/gi, '') // Remove DROP keywords
  }

  // XSS prevention
  sanitizeForXSS(input: string): string {
    return input
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;')
  }

  // Login attempt tracking
  recordLoginAttempt(identifier: string, success: boolean): boolean {
    const now = new Date()
    const key = identifier.toLowerCase()

    if (success) {
      // Reset attempts on successful login
      this.loginAttempts.delete(key)
      log.securityEvent('Login successful', 'low', { identifier })
      return true
    }

    // Record failed attempt
    const attempts = this.loginAttempts.get(key) || { count: 0, lastAttempt: now }
    attempts.count += 1
    attempts.lastAttempt = now
    this.loginAttempts.set(key, attempts)

    log.securityEvent('Login attempt failed', 'medium', { 
      identifier, 
      attemptCount: attempts.count 
    })

    // Check if account should be locked
    if (attempts.count >= this.config.maxLoginAttempts) {
      log.securityEvent('Account locked due to failed attempts', 'high', { 
        identifier, 
        attemptCount: attempts.count 
      })
      return false
    }

    return true
  }

  // Check if account is locked
  isAccountLocked(identifier: string): boolean {
    const key = identifier.toLowerCase()
    const attempts = this.loginAttempts.get(key)

    if (!attempts) return false

    const now = new Date()
    const timeSinceLastAttempt = now.getTime() - attempts.lastAttempt.getTime()
    const lockoutDurationMs = this.config.lockoutDuration * 60 * 1000

    if (attempts.count >= this.config.maxLoginAttempts && 
        timeSinceLastAttempt < lockoutDurationMs) {
      return true
    }

    // Reset if lockout period has passed
    if (timeSinceLastAttempt >= lockoutDurationMs) {
      this.loginAttempts.delete(key)
    }

    return false
  }

  // Rate limiting
  checkRateLimit(identifier: string): boolean {
    const key = identifier.toLowerCase()
    const now = new Date()
    const windowStart = new Date(now.getTime() - this.config.rateLimitWindow * 60 * 1000)

    const current = this.rateLimit.get(key)
    
    if (!current || current.windowStart < windowStart) {
      // New window or no previous requests
      this.rateLimit.set(key, { count: 1, windowStart: now })
      return true
    }

    if (current.count >= this.config.rateLimitMaxRequests) {
      log.securityEvent('Rate limit exceeded', 'medium', { 
        identifier, 
        requestCount: current.count 
      })
      return false
    }

    current.count += 1
    this.rateLimit.set(key, current)
    return true
  }

  // Generate secure tokens
  generateSecureToken(length: number = 32): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    const array = new Uint8Array(length)
    crypto.getRandomValues(array)
    
    for (let i = 0; i < length; i++) {
      result += chars[array[i] % chars.length]
    }
    
    return result
  }

  // Hash password (in a real app, use bcrypt or similar)
  async hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder()
    const data = encoder.encode(password)
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  }

  // Verify password
  async verifyPassword(password: string, hash: string): Promise<boolean> {
    const hashedPassword = await this.hashPassword(password)
    return hashedPassword === hash
  }

  // Generate CSRF token
  generateCSRFToken(): string {
    return this.generateSecureToken(32)
  }

  // Validate CSRF token
  validateCSRFToken(token: string, expectedToken: string): boolean {
    return token === expectedToken
  }

  // Check if request is from same origin
  isSameOrigin(requestUrl: string, currentOrigin: string): boolean {
    try {
      const requestOrigin = new URL(requestUrl).origin
      return requestOrigin === currentOrigin
    } catch {
      return false
    }
  }

  // Validate file upload
  validateFileUpload(file: File, allowedTypes: string[], maxSize: number): { isValid: boolean; error?: string } {
    // Check file type
    if (!allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: `File type not allowed. Allowed types: ${allowedTypes.join(', ')}`
      }
    }

    // Check file size
    if (file.size > maxSize) {
      return {
        isValid: false,
        error: `File too large. Maximum size: ${maxSize / 1024 / 1024}MB`
      }
    }

    // Check file name for suspicious characters
    const suspiciousChars = /[<>:"/\\|?*]/
    if (suspiciousChars.test(file.name)) {
      return {
        isValid: false,
        error: 'File name contains invalid characters'
      }
    }

    return { isValid: true }
  }

  // Clean up expired data
  cleanup(): void {
    const now = new Date()
    const lockoutDurationMs = this.config.lockoutDuration * 60 * 1000
    const rateLimitWindowMs = this.config.rateLimitWindow * 60 * 1000

    // Clean up expired login attempts
    for (const [key, attempts] of this.loginAttempts.entries()) {
      if (now.getTime() - attempts.lastAttempt.getTime() > lockoutDurationMs) {
        this.loginAttempts.delete(key)
      }
    }

    // Clean up expired rate limit entries
    for (const [key, rateLimit] of this.rateLimit.entries()) {
      if (now.getTime() - rateLimit.windowStart.getTime() > rateLimitWindowMs) {
        this.rateLimit.delete(key)
      }
    }
  }
}

// Export singleton instance
export const security = SecurityManager.getInstance()

// Convenience functions
export const securityUtils = {
  validatePassword: (password: string) => security.validatePassword(password),
  validateEmail: (email: string) => security.validateEmail(email),
  sanitizeInput: (input: string) => security.sanitizeInput(input),
  sanitizeForSQL: (input: string) => security.sanitizeForSQL(input),
  sanitizeForXSS: (input: string) => security.sanitizeForXSS(input),
  recordLoginAttempt: (identifier: string, success: boolean) => security.recordLoginAttempt(identifier, success),
  isAccountLocked: (identifier: string) => security.isAccountLocked(identifier),
  checkRateLimit: (identifier: string) => security.checkRateLimit(identifier),
  generateSecureToken: (length?: number) => security.generateSecureToken(length),
  hashPassword: (password: string) => security.hashPassword(password),
  verifyPassword: (password: string, hash: string) => security.verifyPassword(password, hash),
  generateCSRFToken: () => security.generateCSRFToken(),
  validateCSRFToken: (token: string, expectedToken: string) => security.validateCSRFToken(token, expectedToken),
  isSameOrigin: (requestUrl: string, currentOrigin: string) => security.isSameOrigin(requestUrl, currentOrigin),
  validateFileUpload: (file: File, allowedTypes: string[], maxSize: number) => security.validateFileUpload(file, allowedTypes, maxSize)
}

// Cleanup expired data every 5 minutes
setInterval(() => {
  security.cleanup()
}, 5 * 60 * 1000)
