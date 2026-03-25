/**
 * Logger utilitaire pour remplacer console.log/error en production
 * Les logs ne sont affichés qu'en développement
 */

const isDevelopment = import.meta.env.DEV;

export const logger = {
  error: (...args: unknown[]) => {
    if (isDevelopment) {
      console.error(...args);
    }
    // En production, vous pouvez envoyer les erreurs à un service de monitoring
    // Exemple: Sentry.captureException(args[0])
  },
  warn: (...args: unknown[]) => {
    if (isDevelopment) {
      console.warn(...args);
    }
  },
  info: (...args: unknown[]) => {
    if (isDevelopment) {
      console.info(...args);
    }
  },
  log: (...args: unknown[]) => {
    if (isDevelopment) {
      console.log(...args);
    }
  },
  debug: (...args: unknown[]) => {
    if (isDevelopment) {
      console.debug(...args);
    }
  },
};
