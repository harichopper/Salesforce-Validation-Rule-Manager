/**
 * Simple structured logger utility
 */
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

const logger = {
  info: (message, data = '') => {
    console.log(`${colors.cyan}[INFO]${colors.reset} ${message}`, data);
  },
  success: (message, data = '') => {
    console.log(`${colors.green}[SUCCESS]${colors.reset} ${message}`, data);
  },
  warn: (message, data = '') => {
    console.warn(`${colors.yellow}[WARN]${colors.reset} ${message}`, data);
  },
  error: (message, data = '') => {
    console.error(`${colors.red}[ERROR]${colors.reset} ${message}`, data);
  },
  debug: (message, data = '') => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`${colors.magenta}[DEBUG]${colors.reset} ${message}`, data);
    }
  },
};

module.exports = logger;
