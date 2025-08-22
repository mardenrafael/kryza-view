import pino from "pino";
import { randomUUID } from "crypto";

export const logger = pino({
  level: process.env.LOG_LEVEL || "info",
  base: { service: "nextjs-app" },
  timestamp: pino.stdTimeFunctions.isoTime,
  formatters: {
    level: (label) => ({ level: label }),
  },
});

export function getLoggerContext(req: Request) {
  const requestId = req.headers.get("x-request-id") || undefined;
  const log = createLoggerContext(requestId);

  return log;
}

export function createLoggerContext(requestId?: string) {
  return logger.child({ requestId: requestId || randomUUID() });
}
