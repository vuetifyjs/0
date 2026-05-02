---
title: useLogger - Adapter-Based Logging for Vue 3
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
  level: 2
related:
  - /guide/fundamentals/plugins
---

# useLogger

Application logging with configurable levels, filtering, and swappable adapters for popular logging libraries.

<DocsPageFeatures :frontmatter />

## Installation

Install the Logger plugin in your app's entry point:

```ts main.ts
import { createApp } from 'vue'
import { createLoggerPlugin } from '@vuetify/v0'
import App from './App.vue'

const app = createApp(App)

app.use(
  createLoggerPlugin({
    level: 'debug',
    prefix: '[MyApp]',
  })
)

app.mount('#app')
```

## Usage

Once the plugin is installed, use the `useLogger` composable in any component:

```vue collapse no-filename UseLogger
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

## Adapters

Adapters let you swap the underlying logging implementation without changing your application code.

| Adapter | Import | Description |
|---------|--------|-------------|
| `Vuetify0LoggerAdapter` | `@vuetify/v0` | Console-based logging (default) |
| `PinoLoggerAdapter` | `@vuetify/v0/logger/adapters/pino` | [Pino](https://getpino.io/) integration |
| `ConsolaLoggerAdapter` | `@vuetify/v0/logger/adapters/consola` | [Consola](https://github.com/unjs/consola) integration |

The default `Vuetify0LoggerAdapter` maps each level to the correct native console method — `debug` → `console.debug`, `info` → `console.info`, `warn` → `console.warn`, `error`/`fatal` → `console.error`. This ensures browser DevTools can correctly filter by level.

### Pino

[Pino](https://getpino.io/) is a high-performance JSON logger. Requires the `pino` package.

::: code-group no-filename

```bash pnpm
pnpm add pino
```

```bash npm
npm install pino
```

```bash yarn
yarn add pino
```

```bash bun
bun add pino
```

:::

```ts src/plugins/zero.ts
import pino from 'pino'
import { PinoLoggerAdapter } from '@vuetify/v0/logger/adapters/pino'
import { createLoggerPlugin } from '@vuetify/v0'

const logger = pino({ level: 'debug' })

app.use(
  createLoggerPlugin({
    adapter: new PinoLoggerAdapter(logger),
  })
)
```

### Consola

[Consola](https://github.com/unjs/consola) is an elegant console logger by UnJS. Requires the `consola` package.

::: code-group no-filename

```bash pnpm
pnpm add consola
```

```bash npm
npm install consola
```

```bash yarn
yarn add consola
```

```bash bun
bun add consola
```

:::

```ts src/plugins/zero.ts
import { createConsola } from 'consola'
import { ConsolaLoggerAdapter } from '@vuetify/v0/logger/adapters/consola'
import { createLoggerPlugin } from '@vuetify/v0'

const consola = createConsola({ level: 4 })

app.use(
  createLoggerPlugin({
    adapter: new ConsolaLoggerAdapter(consola),
  })
)
```

### Custom Adapters

Implement `LoggerAdapter` to route logs to any destination:

```ts
import type { LoggerAdapter } from '@vuetify/v0'

class DatadogLoggerAdapter implements LoggerAdapter {
  debug (message: string, ...args: unknown[]) {
    datadogLogs.logger.debug(message, ...args)
  }
  info (message: string, ...args: unknown[]) {
    datadogLogs.logger.info(message, ...args)
  }
  warn (message: string, ...args: unknown[]) {
    datadogLogs.logger.warn(message, ...args)
  }
  error (message: string, ...args: unknown[]) {
    datadogLogs.logger.error(message, ...args)
  }
}

app.use(createLoggerPlugin({ adapter: new DatadogLoggerAdapter() }))
```

```ts
interface LoggerAdapter {
  debug: (message: string, ...args: unknown[]) => void
  info:  (message: string, ...args: unknown[]) => void
  warn:  (message: string, ...args: unknown[]) => void
  error: (message: string, ...args: unknown[]) => void
  trace?: (message: string, ...args: unknown[]) => void  // optional
  fatal?: (message: string, ...args: unknown[]) => void  // optional
}
```

`trace` and `fatal` are optional — if omitted, those calls are silently dropped.

## Architecture

`useLogger` uses the plugin pattern with a log adapter:

```mermaid "Logger Plugin"
flowchart LR
  createLoggerPlugin --> createContext
  createContext --> LoggerContext
  LoggerContext --> Adapter[ConsoleAdapter/PinoAdapter/ConsolaAdapter]
  Adapter --> output[console/file/etc]
```

## Reactivity

The logger exposes only functions — no reactive properties. All interactions are imperative.

| Method | Notes |
| - | - |
| `debug(msg, ...args)` | Log at debug level |
| `info(msg, ...args)` | Log at info level |
| `warn(msg, ...args)` | Log at warn level |
| `error(msg, ...args)` | Log at error level |
| `trace(msg, ...args)` | Log at trace level |
| `fatal(msg, ...args)` | Log at fatal level |
| `level(newLevel)` | Change the active log level at runtime |
| `current()` | Return the current `LogLevel` string |
| `enabled()` | Return `true` if logging is enabled |
| `enable()` | Enable logging |
| `disable()` | Disable logging (silences all output) |

## Examples

::: example
/composables/use-logger/log-console

### Log Console

Interactive logger level control with live console output, demonstrating `debug()`, `info()`, `warn()`, and `error()` across all log levels.

:::

<DocsApi />
