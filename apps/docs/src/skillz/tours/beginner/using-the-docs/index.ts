// Types
import type { UseAskReturn } from '@/composables/useAsk'
import type { SettingsContext } from '@/composables/useSettings'

interface TourContext {
  ask: UseAskReturn
  settings: SettingsContext
}

/**
 * Returns tour definition for registration by the store.
 * Guided mode: handlers set up UI state to show features, users just click next.
 */
export function defineTour ({ ask, settings }: TourContext) {
  return {
    handlers: {
      'ask-ai': {
        leave: () => ask.close(),
        back: () => ask.close(),
      },
      'ask-ai-panel': {
        enter: () => ask.open(),
      },
      'ask-ai-features': {
        back: () => ask.open(),
      },
      'settings': {
        enter: () => ask.close(),
        back: () => settings.close(),
      },
      'skill-level': {
        enter: () => settings.open(),
        leave: () => settings.close(),
      },
      'navigation': {
        enter: () => {
          settings.close()
          // TODO: app().drawer = true - needs app store in context
        },
        leave: () => {
          // TODO: app().drawer = false - needs app store in context
        },
      },
    },
  }
}
