export abstract class LoggerAdapter {
  abstract debug (message: string, ...args: unknown[]): void
  abstract info (message: string, ...args: unknown[]): void
  abstract warn (message: string, ...args: unknown[]): void
  abstract error (message: string, ...args: unknown[]): void
  trace? (message: string, ...args: unknown[]): void
  fatal? (message: string, ...args: unknown[]): void
}
