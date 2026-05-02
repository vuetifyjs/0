// Types
import type { Intent } from './types'

export interface Question {
  id: string
  question: string
  description: string
  feature: string
  icon?: string
}

// Questions per intent type
// For now, all intents share the same core questions
// but the order and descriptions can be customized per intent later
export function getQuestions (_intent: Intent): Question[] {
  return [
    {
      id: 'theme',
      question: 'Do you need light/dark theme support?',
      description: 'Adds a theme system with CSS custom properties. Users can switch between light and dark modes, or you can define custom themes with your own color tokens.',
      feature: 'useTheme',
    },
    {
      id: 'locale',
      question: 'Do you need to support multiple languages?',
      description: 'Adds internationalization with message translation, pluralization, and locale switching. Supports vue-i18n or a built-in adapter.',
      feature: 'useLocale',
    },
    {
      id: 'rtl',
      question: 'Do you need RTL (right-to-left) support?',
      description: 'Adds bidirectional text support for Arabic, Hebrew, and other RTL languages. Automatically mirrors layouts and components.',
      feature: 'useRtl',
    },
    {
      id: 'ssr',
      question: 'Do you need SSR or SSG support?',
      description: 'Adds server-side rendering compatibility. Ensures composables hydrate correctly and avoids client-only API calls during server rendering.',
      feature: 'useHydration',
    },
    {
      id: 'breakpoints',
      question: 'Do you need responsive breakpoints?',
      description: 'Adds reactive viewport tracking with named breakpoints. Detect mobile, tablet, and desktop layouts programmatically.',
      feature: 'useBreakpoints',
    },
    {
      id: 'features',
      question: 'Do you need feature flags?',
      description: 'Adds boolean feature toggles for A/B testing and progressive rollout. Supports external providers like LaunchDarkly, Flagsmith, and PostHog.',
      feature: 'useFeatures',
    },
    {
      id: 'permissions',
      question: 'Do you need permission-based access control?',
      description: 'Adds role-based and attribute-based access control. Gate UI elements and routes based on user roles and permissions.',
      feature: 'usePermissions',
    },
    {
      id: 'storage',
      question: 'Do you need persistent user preferences?',
      description: 'Adds reactive localStorage/sessionStorage with automatic serialization. Persist theme choice, sidebar state, or any user preference.',
      feature: 'useStorage',
    },
    {
      id: 'logger',
      question: 'Do you need structured logging?',
      description: 'Adds a pluggable logging system with namespaces and log levels. Supports console, Pino, and Consola adapters.',
      feature: 'useLogger',
    },
    {
      id: 'date',
      question: 'Do you need date/time utilities?',
      description: 'Adds date manipulation and formatting with adapter support. Works with native Date, date-fns, luxon, or dayjs.',
      feature: 'useDate',
    },
  ]
}
