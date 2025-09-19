/**
 * Production-ready error handling system for Coral Protocol integration
 */

export interface ErrorContext {
  component: string;
  action: string;
  sessionId?: string;
  userId?: string;
  timestamp: string;
}

export interface CoralError {
  code: string;
  message: string;
  context: ErrorContext;
  severity: 'low' | 'medium' | 'high' | 'critical';
  recoverable: boolean;
  suggestions: string[];
}

class ErrorHandler {
  private errorLog: CoralError[] = [];
  private maxLogSize = 100;

  /**
   * Log an error with context
   */
  logError(error: Error, context: ErrorContext): CoralError {
    const coralError: CoralError = {
      code: this.generateErrorCode(error),
      message: error.message,
      context,
      severity: this.determineSeverity(error),
      recoverable: this.isRecoverable(error),
      suggestions: this.generateSuggestions(error, context)
    };

    this.errorLog.push(coralError);
    
    // Keep log size manageable
    if (this.errorLog.length > this.maxLogSize) {
      this.errorLog = this.errorLog.slice(-this.maxLogSize);
    }

    // Log to console in development
    if (import.meta.env.DEV) {
      console.error('Coral Protocol Error:', coralError);
    }

    // Send to monitoring service in production
    if (import.meta.env.PROD) {
      this.sendToMonitoring(coralError);
    }

    return coralError;
  }

  /**
   * Handle Coral Protocol connection errors
   */
  handleConnectionError(error: Error, context: ErrorContext): CoralError {
    const coralError = this.logError(error, context);
    
    // Add specific connection error handling
    coralError.suggestions.push(
      'Check Coral Protocol server status',
      'Verify API key configuration',
      'Check network connectivity',
      'Try reconnecting in a few moments'
    );

    return coralError;
  }

  /**
   * Handle voice processing errors
   */
  handleVoiceError(error: Error, context: ErrorContext): CoralError {
    const coralError = this.logError(error, context);
    
    coralError.suggestions.push(
      'Check microphone permissions',
      'Ensure audio input is working',
      'Try refreshing the page',
      'Check browser compatibility'
    );

    return coralError;
  }

  /**
   * Handle payment processing errors
   */
  handlePaymentError(error: Error, context: ErrorContext): CoralError {
    const coralError = this.logError(error, context);
    
    coralError.suggestions.push(
      'Verify wallet connection',
      'Check sufficient balance',
      'Ensure transaction parameters are valid',
      'Try again with smaller amount'
    );

    return coralError;
  }

  /**
   * Get recent errors
   */
  getRecentErrors(limit: number = 10): CoralError[] {
    return this.errorLog.slice(-limit);
  }

  /**
   * Get errors by severity
   */
  getErrorsBySeverity(severity: CoralError['severity']): CoralError[] {
    return this.errorLog.filter(error => error.severity === severity);
  }

  /**
   * Clear error log
   */
  clearLog(): void {
    this.errorLog = [];
  }

  /**
   * Generate error code from error
   */
  private generateErrorCode(error: Error): string {
    const errorName = error.name || 'UnknownError';
    const timestamp = Date.now().toString(36);
    return `CORAL_${errorName.toUpperCase()}_${timestamp}`;
  }

  /**
   * Determine error severity
   */
  private determineSeverity(error: Error): CoralError['severity'] {
    const message = error.message.toLowerCase();
    
    if (message.includes('network') || message.includes('connection')) {
      return 'high';
    }
    
    if (message.includes('payment') || message.includes('transaction')) {
      return 'critical';
    }
    
    if (message.includes('voice') || message.includes('audio')) {
      return 'medium';
    }
    
    return 'low';
  }

  /**
   * Check if error is recoverable
   */
  private isRecoverable(error: Error): boolean {
    const message = error.message.toLowerCase();
    
    // Network errors are usually recoverable
    if (message.includes('network') || message.includes('timeout')) {
      return true;
    }
    
    // Permission errors are usually recoverable
    if (message.includes('permission') || message.includes('denied')) {
      return true;
    }
    
    // Configuration errors are usually not recoverable without user action
    if (message.includes('invalid') || message.includes('malformed')) {
      return false;
    }
    
    return true;
  }

  /**
   * Generate helpful suggestions
   */
  private generateSuggestions(error: Error, context: ErrorContext): string[] {
    const suggestions: string[] = [];
    const message = error.message.toLowerCase();
    
    if (message.includes('cors')) {
      suggestions.push('Check CORS configuration on Coral Protocol server');
    }
    
    if (message.includes('unauthorized')) {
      suggestions.push('Verify API key is correct and has proper permissions');
    }
    
    if (message.includes('not found')) {
      suggestions.push('Check if Coral Protocol endpoint is correct');
    }
    
    if (message.includes('timeout')) {
      suggestions.push('Try increasing timeout settings or check server performance');
    }
    
    return suggestions;
  }

  /**
   * Send error to monitoring service
   */
  private async sendToMonitoring(error: CoralError): Promise<void> {
    try {
      await fetch('/api/monitoring/errors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(error),
      });
    } catch (monitoringError) {
      console.error('Failed to send error to monitoring:', monitoringError);
    }
  }
}

// Export singleton instance
export const errorHandler = new ErrorHandler();

// Export error handling hooks for React components
export const useErrorHandler = () => {
  const handleError = (error: Error, context: Omit<ErrorContext, 'timestamp'>) => {
    return errorHandler.logError(error, {
      ...context,
      timestamp: new Date().toISOString(),
    });
  };

  const handleConnectionError = (error: Error, context: Omit<ErrorContext, 'timestamp'>) => {
    return errorHandler.handleConnectionError(error, {
      ...context,
      timestamp: new Date().toISOString(),
    });
  };

  const handleVoiceError = (error: Error, context: Omit<ErrorContext, 'timestamp'>) => {
    return errorHandler.handleVoiceError(error, {
      ...context,
      timestamp: new Date().toISOString(),
    });
  };

  const handlePaymentError = (error: Error, context: Omit<ErrorContext, 'timestamp'>) => {
    return errorHandler.handlePaymentError(error, {
      ...context,
      timestamp: new Date().toISOString(),
    });
  };

  return {
    handleError,
    handleConnectionError,
    handleVoiceError,
    handlePaymentError,
    getRecentErrors: errorHandler.getRecentErrors.bind(errorHandler),
    getErrorsBySeverity: errorHandler.getErrorsBySeverity.bind(errorHandler),
  };
};
