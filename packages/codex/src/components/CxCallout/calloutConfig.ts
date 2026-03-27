export interface CalloutConfig {
  icon: string
  title: string
}

export type CalloutType = 'tip' | 'info' | 'warning' | 'error'

const CALLOUT_CONFIG: Record<CalloutType, CalloutConfig> = {
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
}

const DEFAULT_CONFIG: CalloutConfig = {
  icon: 'alert',
  title: 'Note',
}

export function getCalloutConfig (type: CalloutType | string): CalloutConfig {
  return CALLOUT_CONFIG[type as CalloutType] ?? DEFAULT_CONFIG
}
