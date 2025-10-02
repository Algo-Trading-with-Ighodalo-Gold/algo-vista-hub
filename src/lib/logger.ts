// Comprehensive logging system
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3
}

export interface LogEntry {
  level: LogLevel
  message: string
  timestamp: string
  context?: Record<string, any>
  userId?: string
  sessionId?: string
  requestId?: string
}

export class Logger {
  private static instance: Logger
  private logLevel: LogLevel
  private sessionId: string
  private requestId: string

  private constructor() {
    this.logLevel = process.env.NODE_ENV === 'production' ? LogLevel.INFO : LogLevel.DEBUG
    this.sessionId = this.generateId()
    this.requestId = this.generateId()
  }

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger()
    }
    return Logger.instance
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.logLevel
  }

  private formatMessage(level: LogLevel, message: string, context?: Record<string, any>): LogEntry {
    return {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
      sessionId: this.sessionId,
      requestId: this.requestId
    }
  }

  private log(level: LogLevel, message: string, context?: Record<string, any>): void {
    if (!this.shouldLog(level)) return

    const logEntry = this.formatMessage(level, message, context)
    
    // Console logging
    const levelNames = ['DEBUG', 'INFO', 'WARN', 'ERROR']
    const levelName = levelNames[level]
    const prefix = `[${levelName}] ${logEntry.timestamp}`
    
    switch (level) {
      case LogLevel.DEBUG:
        console.debug(prefix, message, context)
        break
      case LogLevel.INFO:
        console.info(prefix, message, context)
        break
      case LogLevel.WARN:
        console.warn(prefix, message, context)
        break
      case LogLevel.ERROR:
        console.error(prefix, message, context)
        break
    }

    // In production, send to external logging service
    if (process.env.NODE_ENV === 'production') {
      this.sendToExternalService(logEntry)
    }
  }

  private async sendToExternalService(logEntry: LogEntry): Promise<void> {
    try {
      // Example: Send to external logging service
      // await fetch('/api/logs', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(logEntry)
      // })
    } catch (error) {
      console.error('Failed to send log to external service:', error)
    }
  }

  debug(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.DEBUG, message, context)
  }

  info(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.INFO, message, context)
  }

  warn(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.WARN, message, context)
  }

  error(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.ERROR, message, context)
  }

  // Specific logging methods for common scenarios
  userAction(action: string, userId?: string, context?: Record<string, any>): void {
    this.info(`User action: ${action}`, {
      ...context,
      userId,
      action
    })
  }

  apiCall(method: string, endpoint: string, statusCode: number, duration?: number, context?: Record<string, any>): void {
    const level = statusCode >= 400 ? LogLevel.ERROR : LogLevel.INFO
    this.log(level, `API ${method} ${endpoint} - ${statusCode}`, {
      ...context,
      method,
      endpoint,
      statusCode,
      duration
    })
  }

  databaseOperation(operation: string, table: string, success: boolean, context?: Record<string, any>): void {
    const level = success ? LogLevel.INFO : LogLevel.ERROR
    this.log(level, `Database ${operation} on ${table}`, {
      ...context,
      operation,
      table,
      success
    })
  }

  authenticationEvent(event: string, userId?: string, context?: Record<string, any>): void {
    this.info(`Auth event: ${event}`, {
      ...context,
      userId,
      event
    })
  }

  businessEvent(event: string, context?: Record<string, any>): void {
    this.info(`Business event: ${event}`, context)
  }

  performanceMetric(metric: string, value: number, unit: string, context?: Record<string, any>): void {
    this.info(`Performance: ${metric} = ${value}${unit}`, {
      ...context,
      metric,
      value,
      unit
    })
  }

  securityEvent(event: string, severity: 'low' | 'medium' | 'high' | 'critical', context?: Record<string, any>): void {
    const level = severity === 'critical' ? LogLevel.ERROR : LogLevel.WARN
    this.log(level, `Security: ${event}`, {
      ...context,
      event,
      severity
    })
  }

  // Set user context for subsequent logs
  setUserContext(userId: string): void {
    this.sessionId = userId
  }

  // Set request context for tracking requests
  setRequestContext(requestId: string): void {
    this.requestId = requestId
  }
}

// Export singleton instance
export const logger = Logger.getInstance()

// Convenience functions
export const log = {
  debug: (message: string, context?: Record<string, any>) => logger.debug(message, context),
  info: (message: string, context?: Record<string, any>) => logger.info(message, context),
  warn: (message: string, context?: Record<string, any>) => logger.warn(message, context),
  error: (message: string, context?: Record<string, any>) => logger.error(message, context),
  userAction: (action: string, userId?: string, context?: Record<string, any>) => logger.userAction(action, userId, context),
  apiCall: (method: string, endpoint: string, statusCode: number, duration?: number, context?: Record<string, any>) => 
    logger.apiCall(method, endpoint, statusCode, duration, context),
  databaseOperation: (operation: string, table: string, success: boolean, context?: Record<string, any>) => 
    logger.databaseOperation(operation, table, success, context),
  authenticationEvent: (event: string, userId?: string, context?: Record<string, any>) => 
    logger.authenticationEvent(event, userId, context),
  businessEvent: (event: string, context?: Record<string, any>) => logger.businessEvent(event, context),
  performanceMetric: (metric: string, value: number, unit: string, context?: Record<string, any>) => 
    logger.performanceMetric(metric, value, unit, context),
  securityEvent: (event: string, severity: 'low' | 'medium' | 'high' | 'critical', context?: Record<string, any>) => 
    logger.securityEvent(event, severity, context)
}

// React hook for logging
export function useLogger() {
  return {
    debug: logger.debug.bind(logger),
    info: logger.info.bind(logger),
    warn: logger.warn.bind(logger),
    error: logger.error.bind(logger),
    userAction: logger.userAction.bind(logger),
    businessEvent: logger.businessEvent.bind(logger)
  }
}





