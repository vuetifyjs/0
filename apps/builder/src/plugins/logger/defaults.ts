// apps/builder/src/plugins/logger/defaults.ts

export type LogLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal' | 'silent'

export type LoggerAdapter = 'V0LoggerAdapter' | 'ConsolaLoggerAdapter' | 'PinoLoggerAdapter'

export interface LoggerConfig {
  level: LogLevel
  adapter: LoggerAdapter
  prefix: string
  enabled: boolean
}

export const LOG_LEVELS: LogLevel[] = ['trace', 'debug', 'info', 'warn', 'error', 'fatal', 'silent']

export const LOGGER_ADAPTERS: LoggerAdapter[] = ['V0LoggerAdapter', 'ConsolaLoggerAdapter', 'PinoLoggerAdapter']

export const defaultConfig: LoggerConfig = {
  level: 'info',
  adapter: 'V0LoggerAdapter',
  prefix: 'v0',
  enabled: true,
}
