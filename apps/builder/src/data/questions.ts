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

const CATEGORIES: QuestionCategory[] = [
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
      {
        id: 'reduced-motion',
        title: 'Reduced Motion',
        description: 'Respect or override the OS prefers-reduced-motion setting for transitions',
        feature: 'useReducedMotion',
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
        description: 'Translate component labels and messages with the built-in message registry',
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
      {
        id: 'stack',
        title: 'Stack',
        description: 'Z-index management for overlays (Dialog, Popover, Tooltip, Snackbar, Scrim)',
        feature: 'useStack',
        category: 'infrastructure',
      },
      {
        id: 'tooltip',
        title: 'Tooltip',
        description: 'Region-wide tooltip timing so neighbouring targets open without re-waiting',
        feature: 'useTooltip',
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
        description: 'Date manipulation via the bundled Temporal-based adapter, or one you write',
        feature: 'useDate',
        category: 'utilities',
      },
      {
        id: 'notifications',
        title: 'Notifications',
        description: 'Snackbar and notification queue with auto-dismiss and timeout management',
        feature: 'useNotifications',
        category: 'utilities',
      },
    ],
  },
  {
    id: 'forms',
    title: 'Forms',
    description: 'Validation and form-state management',
    questions: [
      {
        id: 'rules',
        title: 'Rules',
        description: 'Name the validation aliases your forms reference (required, email, min, ...)',
        feature: 'useRules',
        category: 'forms',
      },
    ],
  },
]

// One catalogue, not one per intent. The wizard has no intent picker, and every intent but
// `component-library` mapped to an empty list — so keying on intent only ever produced an
// empty screen. Reintroduce the split when there are real per-intent catalogues to show.
export function getCategories (): QuestionCategory[] {
  return CATEGORIES
}
