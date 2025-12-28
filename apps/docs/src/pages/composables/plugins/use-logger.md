---
title: useLogger Composable
meta:
- name: description
  content: A composable for application logging with configurable adapters, log levels,
    and filtering that supports popular logging libraries like Consola and Pino.
- name: keywords
  content: useLogger, logging, debug, consola, pino, logger adapter, log levels, composable
features:
  category: Plugin
  label: 'E: useLogger'
  github: /composables/useLogger/
related:
  - /guide/plugins
---

# useLogger

The `useLogger` composable provides a flexible, adapter-based logging system for Vue applications. It supports multiple log levels, runtime enable/disable toggling, and integrates seamlessly with popular logging libraries like Consola and Pino through a simple adapter pattern.

<DocsPageFeatures :frontmatter />

## Installation

First, install the logger plugin in your application:

```ts
import { createApp } from 'vue'
import { createLoggerPlugin } from '@vuetify/v0'
import App from './App.vue'

const app = createApp(App)

app.use(
  createLoggerPlugin({
    level: 'info',
    enabled: true,
  })
)

app.mount('#app')
```

## Usage

Once the plugin is installed, use the `useLogger` composable in any component:

```vue UseLogger
<script setup lang="ts">
  import { useLogger } from '@vuetify/v0'

  const logger = useLogger()

  logger.info('Component mounted')
  logger.debug('Debug information', { userId: 123 })
  logger.warn('Warning message')
  logger.error('Error occurred', new Error('Something went wrong'))
</script>

<template>
  <div>
    <h1>Check the console for logs</h1>
  </div>
</template>
```

## API


| Composable | Description |
|---|---|
| [createPlugin](/composables/foundation/create-plugin) | Plugin creation pattern |
### Plugin Options

- **Type**

  ```ts
  interface LoggerOptions {
    adapter?: LoggerAdapter
    level?: LogLevel
    prefix?: string
    enabled?: boolean
  }

  type LogLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal' | 'silent'
  ```

- **Details**

  - `adapter`: Custom logger adapter for output strategy (default: `Vuetify0LoggerAdapter`)
  - `level`: Minimum log level to output (default: `'info'`)
  - `prefix`: Prefix for log messages (default: `'v0'`)
  - `enabled`: Whether logging is enabled (default: from `__LOGGER_ENABLED__` global)

### Logger Context

The `useLogger()` composable returns a context with the following properties and methods:

```ts
interface LoggerContext {
  debug: (message: string, ...args: unknown[]) => void
  info: (message: string, ...args: unknown[]) => void
  warn: (message: string, ...args: unknown[]) => void
  error: (message: string, ...args: unknown[]) => void
  trace: (message: string, ...args: unknown[]) => void
  fatal: (message: string, ...args: unknown[]) => void
  level: (level: LogLevel) => void
  current: () => LogLevel
  enabled: () => boolean
  enable: () => void
  disable: () => void
}
```

- `debug(message, ...args)`: Log debug-level message
- `info(message, ...args)`: Log info-level message
- `warn(message, ...args)`: Log warning-level message
- `error(message, ...args)`: Log error-level message
- `trace(message, ...args)`: Log trace-level message (most verbose)
- `fatal(message, ...args)`: Log fatal-level message (most critical)
- `level(newLevel)`: Set the minimum log level
- `current()`: Get the current log level
- `enabled()`: Check if logging is enabled
- `enable()`: Enable logging
- `disable()`: Disable logging

### Logger Adapter Interface

```ts
interface LoggerAdapter {
  debug: (message: string, ...args: unknown[]) => void
  info: (message: string, ...args: unknown[]) => void
  warn: (message: string, ...args: unknown[]) => void
  error: (message: string, ...args: unknown[]) => void
  trace?: (message: string, ...args: unknown[]) => void
  fatal?: (message: string, ...args: unknown[]) => void
}
```

