
class LoggingMiddleware {
  constructor() {
    this.logs = [];
  }

  log(level, message, data = {}) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
      source: 'AffordmedURLShortener'
    };
    
    this.logs.push(logEntry);
    
    
    console.log(`[${level.toUpperCase()}] ${message}`, data);
  }

  info(message, data) {
    this.log('info', message, data);
  }

  warn(message, data) {
    this.log('warn', message, data);
  }

  error(message, data) {
    this.log('error', message, data);
  }

  debug(message, data) {
    this.log('debug', message, data);
  }

  getLogs() {
    return this.logs;
  }
}

export const loggingMiddleware = new LoggingMiddleware();
