// Skill level aligns with docs skill filter (1 = Beginner, 2 = Intermediate, 3 = Advanced)
export type SkillLevel = 1 | 2 | 3

/** Skill interaction mode */
export type SkillMode = 'guided' | 'interactive'

/** Keys that advance to next step */
export type SkillStepNext =
  | string // Single key: "Enter"
  | string[] // Multiple keys: ["Enter", "Space"]
  | { keys: string[], block?: string[] } // Keys with blocked keys

export interface SkillStep {
  id: string
  title: string
  task: string
  hint: string
  learn: string
  /** Keys that advance to next step */
  next?: SkillStepNext
  /** Popover placement (desktop) */
  placement?: string
  /** Popover placement override for mobile */
  placementMobile?: string
  /** Skip this step on mobile (smAndDown breakpoint) */
  skipOnMobile?: boolean
}

export interface SkillMeta {
  mode: SkillMode
  id: string
  name: string
  level: SkillLevel
  track: SkillTrack
  categories: SkillCategory[]
  order: number
  prerequisites: string[]
  description: string
  minutes: number
  startRoute: string
  /** Route to navigate to after tour completion */
  completeRoute?: string
  steps: SkillStep[]
}

// Tracks align with docs learning tracks
export type SkillTrack = 'essentials' | 'fundamentals' | 'features' | 'integration'

// Categories for multi-tag filtering
export type SkillCategory =
  | 'components' // Headless UI components (Tabs, Dialog, Disclosure)
  | 'composables' // Logic building blocks (createSingle, useEventListener)
  | 'patterns' // Architectural patterns (Trinity, Context, Registry)
  | 'forms' // Input and validation (createForm, field state)
  | 'data' // Collections and processing (useFilter, usePagination)
  | 'browser' // DOM and events (observers, hotkeys, media queries)
  | 'theming' // Design tokens and themes (useTheme, createTokens)
  | 'accessibility' // ARIA and keyboard (focus management, screen readers)
  | 'library-building' // Build your own library (plugins, adapters, extending v0)
  | 'meta' // Learning the docs (Ask AI, search, examples)
  | 'typescript' // Type patterns (generics, inference)
  | 'ssr' // Server-side rendering (hydration, Nuxt)

export const SKILL_LEVEL_META: Record<SkillLevel, { label: string, icon: string, color: string, title: string }> = {
  1: { label: 'Beginner', icon: 'level-beginner', color: 'var(--v0-success)', title: 'Beginner experience level' },
  2: { label: 'Intermediate', icon: 'level-intermediate', color: 'var(--v0-info)', title: 'Intermediate experience level' },
  3: { label: 'Advanced', icon: 'level-advanced', color: 'var(--v0-warning)', title: 'Advanced experience level' },
}

export const SKILL_MODE_META: Record<SkillMode, { label: string, icon: string, color: string, description: string }> = {
  guided: { label: 'Guided', icon: 'compass', color: 'var(--v0-primary)', description: 'A passive walkthrough. Just click next to continue.' },
  interactive: { label: 'Interactive', icon: 'keyboard', color: 'var(--v0-accent)', description: 'Hands-on practice. Complete tasks to progress.' },
}

export const SKILL_TRACK_META: Record<SkillTrack, { label: string, description: string }> = {
  essentials: {
    label: 'Essentials',
    description: 'Getting started — navigating the docs, key concepts, first steps',
  },
  fundamentals: {
    label: 'Fundamentals',
    description: 'Understanding the system — Trinity, Context, Registry patterns',
  },
  features: {
    label: 'Features',
    description: 'Production-ready UIs — Theming, Accessibility, Utilities',
  },
  integration: {
    label: 'Integration',
    description: 'Real-world usage — Nuxt, existing apps, custom components',
  },
}

export const SKILL_CATEGORY_META: Record<SkillCategory, { label: string, icon: string }> = {
  'components': { label: 'Components', icon: 'layers' },
  'composables': { label: 'Composables', icon: 'puzzle' },
  'patterns': { label: 'Patterns', icon: 'map' },
  'forms': { label: 'Forms', icon: 'form' },
  'data': { label: 'Data', icon: 'database' },
  'browser': { label: 'Browser', icon: 'monitor' },
  'theming': { label: 'Theming', icon: 'palette' },
  'accessibility': { label: 'Accessibility', icon: 'accessibility' },
  'library-building': { label: 'Library Building', icon: 'package' },
  'meta': { label: 'Learning', icon: 'book' },
  'typescript': { label: 'TypeScript', icon: 'typescript' },
  'ssr': { label: 'SSR', icon: 'server' },
}
