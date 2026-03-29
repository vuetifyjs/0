// Types
import type { Extensible } from '@vuetify/v0/types'

export interface CalloutConfig {
  icon: string
  title: string
  classes?: string
}

export type CalloutType = Extensible<'tip' | 'info' | 'warning' | 'error' | 'askai' | 'discord' | 'tour'>

const CALLOUT_CONFIG: Record<string, CalloutConfig> = {
  tip: {
    icon: 'lightbulb',
    title: 'Tip',
    classes: 'border-success bg-success',
  },
  info: {
    icon: 'info',
    title: 'Info',
    classes: 'border-info bg-info',
  },
  warning: {
    icon: 'alert',
    title: 'Warning',
    classes: 'border-warning bg-warning',
  },
  error: {
    icon: 'error',
    title: 'Error',
    classes: 'border-error bg-error',
  },
  askai: {
    icon: 'sparkle',
    title: 'Ask AI',
    classes: 'border-primary bg-primary',
  },
  discord: {
    icon: 'discord',
    title: 'Ask on Discord',
    classes: 'border-[#5865F2] bg-[#5865F2]',
  },
  tour: {
    icon: 'play',
    title: 'Interactive Tour',
    classes: 'border-accent bg-accent',
  },
}

const DEFAULT_CONFIG: CalloutConfig = {
  icon: 'alert',
  title: 'Note',
  classes: 'border-divider bg-surface-tint',
}

export function getCalloutConfig (type: CalloutType | string): CalloutConfig {
  return CALLOUT_CONFIG[type] ?? DEFAULT_CONFIG
}
