---
meta:
  title: useLogger
  description: Provides a consistent logging interface with configurable adapters and levels.
  keywords: useLogger, logger, logging, composable, Vue
category: System
performance: 0
---

# useLogger

The `useLogger` composable provides a consistent logging interface that can be configured with different adapters and optimized for production builds with conditional compilation.

## API

### `useLogger(namespace?)`

* **Type**
    
  ```ts
  function useLogger (namespace?: string): LoggerContext
  ```
    
* **Details**
    
  A simple hook to access the logger context. If called within a component setup, it attempts to retrieve the provided logger context. If no context is found or if called outside a component setup, it returns a fallback logger.

### `createLogger(options?)`

* **Type**
    
  ```ts
  export interface LoggerOptions {
    adapter?: LoggerAdapter
    level?: LogLevel
    prefix?: string
    enabled?: boolean
  }

  export function createLogger (options?: LoggerOptions): LoggerContext
  ```
    
* **Details**
    
  Creates a logger context for application logging with configurable adapters and levels. 
  - `adapter`: An optional `LoggerAdapter` instance (defaults to `Vuetify0LoggerAdapter`).
  - `level`: The initial log level (e.g., `trace`, `debug`, `info`, `warn`, `error`, `fatal`, `silent`). Defaults to `info`.
  - `prefix`: An optional string prefix for log messages.
  - `enabled`: An optional boolean to initially enable or disable the logger.

  Returns a `LoggerContext` object with methods like `debug`, `info`, `warn`, `error`, `trace`, `fatal`, `level`, `current`, `enabled`, `enable`, and `disable`.

### `createLoggerPlugin(options?)`

* **Type**
    
  ```ts
  export interface LoggerPlugin {
    install: (app: App, ...options: any[]) => any
  }

  export function createLoggerPlugin (options?: LoggerOptions): LoggerPlugin
  ```
    
* **Details**
    
  Creates a Vue plugin for logging. This plugin sets up the logger context and makes it available throughout the application. The `options` parameter is the same as for `createLogger`.

## Examples

### Using `useLogger` in a Component

```html
<template>
  <div>
    <button @click="logInfo">Log Info</button>
    <button @click="logError">Log Error</button>
  </div>
</template>

<script setup lang="ts">
  import { useLogger } from "@vuetify/v0/composables/useLogger";

  const logger = useLogger("MyComponent");

  const logInfo = () => {
    logger.info("This is an informational message.");
  };

  const logError = () => {
    logger.error("An error occurred!");
  };
</script>
```

### Using `createLoggerPlugin` to Configure Global Logging

```ts
// main.ts
import { createApp } from "vue";
import App from "./App.vue";
import { createLoggerPlugin, LogLevel } from "@vuetify/v0/composables/useLogger";

const app = createApp(App);

app.use(
  createLoggerPlugin({
    level: LogLevel.Debug, // Set global log level to debug
    prefix: "MyApp", // Add a prefix to all log messages
  })
);

app.mount("#app");
```


