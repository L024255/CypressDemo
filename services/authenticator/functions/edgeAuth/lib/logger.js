const LOG_LEVELS = {
  DEBUG: -1,
  INFO: 0,
  WARN: 1,
  ERROR: 2,
  NONE: 99,
};

function log(logLevel, ...message) {
  let logFunction = console.log;
  try {
    if (LOG_LEVELS[logLevel] >= LOG_LEVELS[process.env.LOG_LEVEL || 'INFO']) {
      if (logLevel === 'ERROR') {
        logFunction = console.error;
      } else if (logLevel === 'WARN') {
        logFunction = console.warn;
      }

      logFunction(...message);
    }
  } catch (error) {
    // NOOP
  }
}

module.exports = {
  debug: (...message) => {
    return log('DEBUG', ...message);
  },
  info: (...message) => {
    return log('INFO', ...message);
  },
  warn: (...message) => {
    return log('WARN', ...message);
  },
  error: (...message) => {
    return log('ERROR', ...message);
  },
};
