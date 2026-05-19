// Types
import type { Intent } from './types'

export interface Question {
  id: string
  title: string
  description: string
  feature: string
  category: string
}

export interface QuestionCategory {
  id: string
  title: string
  description: string
  questions: Question[]
}

const COMPONENT_LIBRARY: QuestionCategory[] = [
  {
    id: 'appearance',
    title: 'Appearance',
    description: 'Theming and responsive behavior',
    questions: [
      {
        id: 'theme',
        title: 'Theme',
        description: 'Light/dark mode with custom color tokens and CSS variables',
        feature: 'useTheme',
        category: 'appearance',
      },
      {
        id: 'breakpoints',
        title: 'Breakpoints',
        description: 'Reactive viewport tracking with named breakpoints for responsive logic',
        feature: 'useBreakpoints',
        category: 'appearance',
      },
    ],
  },
  {
    id: 'i18n',
    title: 'Internationalization',
    description: 'Language and direction support',
    questions: [
      {
        id: 'locale',
        title: 'Locale',
        description: 'Translate component labels and messages with vue-i18n or built-in adapter',
        feature: 'useLocale',
        category: 'i18n',
      },
      {
        id: 'rtl',
        title: 'Right-to-Left',
        description: 'Reactive RTL direction state for mirroring component layouts',
        feature: 'useRtl',
        category: 'i18n',
      },
    ],
  },
  {
    id: 'infrastructure',
    title: 'Infrastructure',
    description: 'Storage, rendering, and observability',
    questions: [
      {
        id: 'storage',
        title: 'Storage',
        description: 'Persistent localStorage/sessionStorage with auto-serialization',
        feature: 'useStorage',
        category: 'infrastructure',
      },
      {
        id: 'ssr',
        title: 'SSR / SSG',
        description: 'Hydration lifecycle tracking to prevent mismatches and defer browser APIs',
        feature: 'useHydration',
        category: 'infrastructure',
      },
      {
        id: 'logger',
        title: 'Logger',
        description: 'Structured logging with namespaces and pluggable adapters',
        feature: 'useLogger',
        category: 'infrastructure',
      },
    ],
  },
  {
    id: 'access',
    title: 'Access Control',
    description: 'Feature gating and permissions',
    questions: [
      {
        id: 'features',
        title: 'Feature Flags',
        description: 'Boolean toggles for A/B testing with LaunchDarkly, Flagsmith, or local config',
        feature: 'useFeatures',
        category: 'access',
      },
      {
        id: 'permissions',
        title: 'Permissions',
        description: 'Role-based access control for gating UI elements and routes',
        feature: 'usePermissions',
        category: 'access',
      },
    ],
  },
  {
    id: 'utilities',
    title: 'Utilities',
    description: 'Date handling and notifications',
    questions: [
      {
        id: 'date',
        title: 'Date',
        description: 'Date manipulation with adapter support for date-fns, dayjs, or luxon',
        feature: 'useDate',
        category: 'utilities',
      },
      {
        id: 'notifications',
        title: 'Notifications',
        description: 'Toast and notification system with auto-dismiss and queue management',
        feature: 'useNotifications',
        category: 'utilities',
      },
    ],
  },
]

const CATEGORIES: Record<Intent, QuestionCategory[]> = {
  'component-library': COMPONENT_LIBRARY,
  'spa': [],
  'design-system': [],
  'admin-dashboard': [],
  'content-site': [],
  'mobile-first': [],
}

export function getCategories (intent: Intent): QuestionCategory[] {
  return CATEGORIES[intent] ?? []
}
