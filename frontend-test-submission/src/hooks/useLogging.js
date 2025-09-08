import { useCallback } from 'react';
import { loggingMiddleware } from '../api/loggingMiddleware';

export const useLogging = () => {
  const logInfo = useCallback((message, data) => {
    loggingMiddleware.info(message, data);
  }, []);

  const logWarn = useCallback((message, data) => {
    loggingMiddleware.warn(message, data);
  }, []);

  const logError = useCallback((message, data) => {
    loggingMiddleware.error(message, data);
  }, []);

  const logDebug = useCallback((message, data) => {
    loggingMiddleware.debug(message, data);
  }, []);

  return {
    logInfo,
    logWarn,
    logError,
    logDebug
  };
};