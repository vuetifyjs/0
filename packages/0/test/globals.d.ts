// Types
import type { CustomCommands } from './commands'

declare module 'vitest/browser' {
  interface BrowserCommands extends CustomCommands {}
}
