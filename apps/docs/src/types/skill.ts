// Skill level aligns with docs skill filter (1 = Beginner, 2 = Intermediate, 3 = Advanced)
export type SkillLevel = 1 | 2 | 3

/** Skill interaction mode */
export type SkillMode = 'guided' | 'interactive' | 'tutorial'

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
  /** Route to the tutorial editor (tutorials only) */
  tutorialRoute?: string
  /** Route to navigate to after tour completion */
  completeRoute?: string
  steps: SkillStep[]
}

// Tracks align with docs learning tracks
export type SkillTrack = 'essentials' | 'fundamentals' | 'features' | 'integration'

// Categories for skill tours
export type SkillCategory =
  | 'meta' // Learning the docs (navigation, search, Ask AI)
  // | 'patterns' // Architectural patterns (Trinity, Context, Registry)
  // | 'theming' // Design tokens and themes (useTheme, createTokens)
  // | 'accessibility' // ARIA and keyboard (focus management, screen readers)
  // | 'library-building' // Build your own library (plugins, adapters, extending v0)

export const SKILL_LEVEL_META: Record<SkillLevel, { label: string, icon: string, color: string, title: string }> = {
  1: { label: 'Beginner', icon: 'level-beginner', color: 'var(--v0-success)', title: 'Start here — learn the docs, Vue fundamentals, and your first v0 components' },
  2: { label: 'Intermediate', icon: 'level-intermediate', color: 'var(--v0-info)', title: 'Go deeper — watchers, lifecycle hooks, component composition, and real-world patterns' },
  3: { label: 'Advanced', icon: 'level-advanced', color: 'var(--v0-warning)', title: 'Master the system — composables, generics, scoped slots, and library-grade abstractions' },
}

export const SKILL_MODE_META: Record<SkillMode, { label: string, icon: string, color: string, description: string }> = {
  guided: { label: 'Guided', icon: 'compass', color: 'var(--v0-primary)', description: 'A passive walkthrough. Just click next to continue.' },
  interactive: { label: 'Interactive', icon: 'keyboard', color: 'var(--v0-accent)', description: 'Hands-on practice. Complete tasks to progress.' },
  tutorial: { label: 'Tutorial', icon: 'code', color: '#64748b', description: 'Learn by coding in a live editor with step-by-step instructions.' },
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
  meta: { label: 'Learning', icon: 'book' },
  // 'patterns': { label: 'Patterns', icon: 'map' },
  // 'theming': { label: 'Theming', icon: 'palette' },
  // 'accessibility': { label: 'Accessibility', icon: 'accessibility' },
  // 'library-building': { label: 'Library Building', icon: 'package' },
}
