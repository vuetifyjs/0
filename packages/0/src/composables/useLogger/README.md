# useLogger

A comprehensive logging system for Vue applications with adapter-based architecture, production optimizations, and Vue-style configuration.

## Features

- **Adapter Architecture**: Support for multiple logging libraries (Console, Winston, Pino, Log4js)
- **Production Optimization**: Automatic stripping of log calls in production builds
- **Log Levels**: Trace, Debug, Info, Warn, Error, Fatal, Silent
- **Vue Integration**: Plugin-based setup with dependency injection
- **Development Helpers**: Global logger access in development mode
- **SSR Compatible**: Works in both browser and server environments

## Basic Usage

```typescript
// Basic usage
import { useLogger } from '@vuetify/0'

const logger = useLogger()
logger.info('Application started')
logger.error('Something went wrong', { error: new Error() })
logger.debug('Debug information', { userId: 123 })
```

## Plugin Setup

```typescript
// main.ts
import { createApp } from 'vue'
import { createLoggerPlugin } from '@vuetify/0'
import App from './App.vue'

const app = createApp(App)

// Basic setup with default console adapter
app.use(createLoggerPlugin())

// Custom configuration
app.use(createLoggerPlugin({
  level: 'debug',
  prefix: 'myapp',
  stripInProduction: true,
}))

app.mount('#app')
```

## Log Levels

The logger supports the following levels in order of priority:

- `trace` (0) - Detailed tracing information
- `debug` (1) - Debug information for development
- `info` (2) - General information messages
- `warn` (3) - Warning messages
- `error` (4) - Error messages
- `fatal` (5) - Fatal error messages
- `silent` (6) - No logging

```typescript
const logger = useLogger()

// Set log level - only messages at this level and above will be logged
logger.level('warn') // Only warn, error, and fatal messages

// Check current level
console.log(logger.current()) // 'warn'

// Enable/disable logging
logger.disable()
logger.enable()
```

## Adapters

### Vuetify0 Adapter (Default)

Console-based logging with formatting, colors, and timestamps:

```typescript
import { createLoggerPlugin, Vuetify0LoggerAdapter } from '@vuetify/0'

app.use(createLoggerPlugin({
  adapter: new Vuetify0LoggerAdapter({
    prefix: 'myapp',
    colors: true,
    timestamps: true,
  }),
}))
```

### Winston Adapter

For enterprise-grade logging with transports:

```typescript
import winston from 'winston'
import { createLoggerPlugin, WinstonLoggerAdapter } from '@vuetify/0'

const winstonLogger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
})

app.use(createLoggerPlugin({
  adapter: new WinstonLoggerAdapter(winstonLogger),
}))
```

### Pino Adapter

For high-performance structured logging:

```typescript
import pino from 'pino'
import { createLoggerPlugin, PinoLoggerAdapter } from '@vuetify/0'

const pinoLogger = pino({
  level: 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
    },
  },
})

app.use(createLoggerPlugin({
  adapter: new PinoLoggerAdapter(pinoLogger),
}))
```

### Log4js Adapter

For Java-style logging with categories:

```typescript
import log4js from 'log4js'
import { createLoggerPlugin, Log4jsLoggerAdapter } from '@vuetify/0'

log4js.configure({
  appenders: {
    cheese: { type: 'file', filename: 'cheese.log' },
  },
  categories: {
    default: { appenders: ['cheese'], level: 'error' },
  },
})

const log4jsLogger = log4js.getLogger('cheese')

app.use(createLoggerPlugin({
  adapter: new Log4jsLoggerAdapter(log4jsLogger),
}))
```

## Production Optimization

The logger can be optimized for production builds:

```typescript
// Development: Full logging
app.use(createLoggerPlugin({
  level: 'debug',
  stripInProduction: false, // Keep all logging
}))

// Production: Minimal logging
app.use(createLoggerPlugin({
  level: 'error', // Only errors
  stripInProduction: true, // Strip debug/info calls
}))

// Production: No logging
app.use(createLoggerPlugin({
  level: 'silent',
  stripInProduction: true,
}))
```

### Environment Variables

Control logging through environment variables:

```bash
# Enable logging in production
VITE_LOGGER_ENABLED=true

# Build configuration
NODE_ENV=production
```

### Build Configuration

Update your `vite.config.ts` for build-time optimizations:

```typescript
// vite.config.ts
export default defineConfig({
  define: {
    __DEV__: JSON.stringify(process.env.NODE_ENV !== 'production'),
    __LOGGER_ENABLED__: JSON.stringify(
      process.env.NODE_ENV !== 'production' ||
      process.env.VITE_LOGGER_ENABLED === 'true'
    ),
  },
  // ... rest of config
})
```

## Advanced Usage

### Custom Adapter

Create your own adapter by implementing the `LoggerAdapter` interface:

```typescript
import type { LoggerAdapter } from '@vuetify/0'

class CustomLoggerAdapter implements LoggerAdapter {
  debug(message: string, ...args: unknown[]) {
    // Custom debug implementation
  }

  info(message: string, ...args: unknown[]) {
    // Custom info implementation
  }

  // ... implement other methods
}

app.use(createLoggerPlugin({
  adapter: new CustomLoggerAdapter(),
}))
```

### Development Helpers

In development mode, the logger is available globally:

```typescript
// Available in browser console during development
window.__v0Logger__.info('Debug from console')
window.__v0Logger__.level('trace')
```

### Programmatic Usage

Create loggers without the plugin:

```typescript
import { createLogger, Vuetify0LoggerAdapter } from '@vuetify/0'

const logger = createLogger({
  adapter: new Vuetify0LoggerAdapter({ prefix: 'worker' }),
  level: 'info',
})

logger.info('Worker started')
```

## TypeScript Support

Full TypeScript support with proper types:

```typescript
import type {
  LoggerContext,
  LoggerAdapter,
  LogLevel,
  LoggerOptions
} from '@vuetify/0'

const logger: LoggerContext = useLogger()
const level: LogLevel = 'debug'
```
