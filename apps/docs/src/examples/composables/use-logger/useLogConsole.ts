import { createLoggerContext, LoggerAdapter } from '@vuetify/v0'
import type { LogLevel } from '@vuetify/v0'
import { ref, shallowRef } from 'vue'

export type LogMethod = Exclude<LogLevel, 'silent'>

export interface LogEntry {
  level: LogLevel
  message: string
  time: string
}

const levels: LogMethod[] = ['trace', 'debug', 'info', 'warn', 'error', 'fatal']

// Captures every line the logger lets through into a reactive sink, so the
// panel shows exactly what passed the level gate instead of the dev console.
class PanelAdapter extends LoggerAdapter {
  constructor (readonly sink: (level: LogLevel, message: string) => void) {
    super()
  }

  debug (message: string) {
    this.sink('debug', message)
  }

  info (message: string) {
    this.sink('info', message)
  }

  warn (message: string) {
    this.sink('warn', message)
  }

  error (message: string) {
    this.sink('error', message)
  }

  trace (message: string) {
    this.sink('trace', message)
  }

  fatal (message: string) {
    this.sink('fatal', message)
  }
}

export function useLogConsole () {
  const logs = ref<LogEntry[]>([])
  const level = shallowRef<LogLevel>('debug')
  const enabled = shallowRef(true)

  function capture (lvl: LogLevel, message: string) {
    logs.value.push({ level: lvl, message, time: new Date().toLocaleTimeString() })
  }

  const adapter = new PanelAdapter(capture)

  const [, provideLogger, logger] = createLoggerContext({
    adapter,
    level: level.value,
    enabled: enabled.value,
  })

  // Share the configured logger so descendants resolve it through useLogger().
  provideLogger()

  function onLevel (lvl: LogLevel) {
    logger.level(lvl)
    level.value = logger.current()
  }

  function onToggle () {
    if (enabled.value) logger.disable()
    else logger.enable()
    enabled.value = logger.enabled()
  }

  function onClear () {
    logs.value = []
  }

  return { logs, level, enabled, levels, onLevel, onToggle, onClear }
}
