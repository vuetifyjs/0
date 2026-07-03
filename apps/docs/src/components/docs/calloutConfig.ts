/**
 * Configuration for DocsCallout component types.
 * Extracted for maintainability and potential reuse.
 */

export interface CalloutConfig {
  icon: string
  title: string
  classes: string
}

export type CalloutType = 'tip' | 'note' | 'warning' | 'caution' | 'important' | 'askai' | 'discord' | 'tour'

const CALLOUT_CONFIG: Record<CalloutType, CalloutConfig> = {
  tip: {
    icon: 'lightbulb',
    title: 'Tip',
    classes: 'bg-success-10 border-success-50 text-success',
  },
  note: {
    icon: 'info',
    title: 'Note',
    classes: 'bg-info-10 border-info-50 text-info',
  },
  warning: {
    icon: 'alert',
    title: 'Warning',
    classes: 'bg-warning-10 border-warning-50 text-warning',
  },
  caution: {
    icon: 'error',
    title: 'Caution',
    classes: 'bg-error-10 border-error-50 text-error',
  },
  important: {
    icon: 'alert-circle',
    title: 'Important',
    classes: 'bg-accent-10 border-accent-50 text-accent',
  },
  askai: {
    icon: 'create',
    title: 'Ask AI',
    classes: 'bg-secondary-10 border-secondary-50 text-secondary cursor-pointer hover:bg-secondary-20 transition-colors',
  },
  discord: {
    icon: 'discord',
    title: 'Discord',
    classes: 'bg-discord-10 border-discord-50 text-discord cursor-pointer hover:bg-discord-20 transition-colors',
  },
  tour: {
    icon: 'compass',
    title: 'Interactive Tour',
    classes: 'bg-tour-10 border-tour-50 text-tour cursor-pointer hover:bg-tour-20 transition-colors',
  },
}

const DEFAULT_CALLOUT_CONFIG: CalloutConfig = {
  icon: 'alert',
  title: 'Note',
  classes: 'bg-surface-variant-10 border-divider text-on-surface',
}

export function getCalloutConfig (type: CalloutType | string): CalloutConfig {
  return CALLOUT_CONFIG[type as CalloutType] ?? DEFAULT_CALLOUT_CONFIG
}
