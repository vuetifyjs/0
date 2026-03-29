// Types
import type { Extensible } from '@vuetify/v0/types'

export interface CalloutConfig {
  icon: string
  title: string
}

export type CalloutType = Extensible<'tip' | 'info' | 'warning' | 'error' | 'askai' | 'discord' | 'tour'>

const CALLOUT_CONFIG: Record<string, CalloutConfig> = {
  tip: {
    icon: 'lightbulb',
    title: 'Tip',
  },
  info: {
    icon: 'info',
    title: 'Info',
  },
  warning: {
    icon: 'alert',
    title: 'Warning',
  },
  error: {
    icon: 'error',
    title: 'Error',
  },
  askai: {
    icon: 'sparkle',
    title: 'Ask AI',
  },
  discord: {
    icon: 'discord',
    title: 'Ask on Discord',
  },
  tour: {
    icon: 'play',
    title: 'Interactive Tour',
  },
}

const DEFAULT_CONFIG: CalloutConfig = {
  icon: 'alert',
  title: 'Note',
}

export function getCalloutConfig (type: CalloutType | string): CalloutConfig {
  return CALLOUT_CONFIG[type] ?? DEFAULT_CONFIG
}
