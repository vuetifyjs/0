// Skill level aligns with docs skill filter (1 = Beginner, 2 = Intermediate, 3 = Advanced)
export type SkillLevel = 1 | 2 | 3

// Tracks align with docs learning tracks
export type SkillTrack = 'fundamentals' | 'features' | 'integration'

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

// =============================================================================
// PLAYGROUND MODE - Code-based learning in the embedded editor
// =============================================================================

export interface PlaygroundStep {
  title: string
  task: string
  hint?: string
  validate?: string // Regex pattern to match in code
  startCode: string
  solution?: string
}

export interface PlaygroundSkill {
  mode: 'playground'
  id: string
  name: string
  level: SkillLevel
  track: SkillTrack
  categories: SkillCategory[]
  order: number
  prerequisites: string[]
  description: string
  estimatedMinutes: number
  steps: PlaygroundStep[]
}

// =============================================================================
// GUIDED MODE - Interactive tours on actual docs pages
// =============================================================================

// What the user needs to do
export type GuidedAction =
  | 'click' // Click an element
  | 'hover' // Hover over an element
  | 'scroll-to' // Scroll element into view
  | 'input' // Type into an input field
  | 'observe' // Just read/observe (no interaction required)
  | 'navigate' // Click a link to navigate somewhere

// How to validate the step is complete
export type GuidedValidation =
  | { type: 'click', selector: string } // User clicked the element
  | { type: 'hover', selector: string } // User hovered the element
  | { type: 'input', selector: string, match?: string } // User typed (optionally matching pattern)
  | { type: 'navigation', path: string } // User navigated to path
  | { type: 'element-visible', selector: string } // Element became visible (e.g., popover opened)
  | { type: 'element-hidden', selector: string } // Element was hidden (e.g., modal closed)
  | { type: 'manual' } // User clicks "Done" button manually

// Highlight configuration for drawing attention to elements
export interface GuidedHighlight {
  selector: string // CSS selector for element(s) to highlight
  style?: 'outline' | 'pulse' | 'spotlight' // Visual style
  padding?: number // Extra padding around highlight
}

// Setup action to prepare UI state before a step
export type GuidedSetup =
  | { type: 'click', selector: string } // Click an element (e.g., open a dialog)
  | { type: 'focus', selector: string } // Focus an element
  | { type: 'scroll', selector: string } // Scroll element into view

export interface GuidedStep {
  title: string
  task: string // What the user should do
  hint?: string

  // Where this step takes place
  route: string // Docs route, e.g., '/guide/using-the-docs'

  // Setup action to prepare UI state (e.g., open dialog before highlighting inside it)
  setup?: GuidedSetup

  // Visual guidance
  highlight?: GuidedHighlight // Element to highlight
  anchor?: string // Selector to position the tooltip near
  position?: 'top' | 'bottom' | 'left' | 'right' | 'auto' // Tooltip position

  // User action
  action: GuidedAction
  validation: GuidedValidation

  // Optional: auto-advance after delay (for 'observe' actions)
  autoAdvanceMs?: number
}

export interface GuidedSkill {
  mode: 'guided'
  id: string
  name: string
  level: SkillLevel
  track: SkillTrack
  categories: SkillCategory[]
  order: number
  prerequisites: string[]
  description: string
  estimatedMinutes: number
  steps: GuidedStep[]

  // Starting point for the guided tour
  startRoute: string
}

// =============================================================================
// UNION TYPES
// =============================================================================

export type SkillStep = PlaygroundStep | GuidedStep
export type SkillMeta = PlaygroundSkill | GuidedSkill

// Type guards
export function isPlaygroundSkill (skill: SkillMeta): skill is PlaygroundSkill {
  return skill.mode === 'playground'
}

export function isGuidedSkill (skill: SkillMeta): skill is GuidedSkill {
  return skill.mode === 'guided'
}

export function isPlaygroundStep (step: SkillStep): step is PlaygroundStep {
  return 'startCode' in step
}

export function isGuidedStep (step: SkillStep): step is GuidedStep {
  return 'route' in step
}

// =============================================================================
// PROGRESS & REGISTRY
// =============================================================================

export interface SkillProgress {
  skillId: string
  completedSteps: number[]
  completed: boolean
  completedAt?: string
}

export interface SkillRegistry {
  [skillId: string]: SkillMeta
}

// =============================================================================
// GUIDED MODE RUNTIME STATE
// =============================================================================

// State for tracking active guided tour
export interface GuidedTourState {
  skillId: string
  currentStepIndex: number
  startedAt: string
}

// =============================================================================
// METADATA
// =============================================================================

export const SKILL_LEVEL_META: Record<SkillLevel, { label: string, icon: string, color: string }> = {
  1: { label: 'Beginner', icon: 'level-beginner', color: 'var(--v0-success)' },
  2: { label: 'Intermediate', icon: 'level-intermediate', color: 'var(--v0-info)' },
  3: { label: 'Advanced', icon: 'level-advanced', color: 'var(--v0-warning)' },
}

export const SKILL_TRACK_META: Record<SkillTrack, { label: string, description: string }> = {
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
