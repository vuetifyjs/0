// Types
import type { UseAskReturn } from '@/composables/useAsk'
import type { NavigationContext } from '@/composables/useNavigation'
import type { SettingsContext } from '@/composables/useSettings'

interface TourContext {
  ask: UseAskReturn
  navigation: NavigationContext
  settings: SettingsContext
}

/**
 * Returns tour definition for registration by the store.
 * Guided mode: handlers set up UI state to show features, users just click next.
 */
export function defineTour ({ ask, navigation, settings }: TourContext) {
  return {
    handlers: {
      'ask-ai': {
        enter: () => ask.close(),
        leave: () => ask.close(),
        back: () => ask.close(),
      },
      'ask-ai-panel': {
        enter: () => ask.open(),
      },
      'ask-ai-features': {
        enter: () => ask.open(),
        back: () => ask.open(),
      },
      'settings': {
        enter: () => ask.close(),
        back: () => settings.close(),
      },
      'skill-level': {
        enter: () => settings.open(),
        back: () => settings.close(),
        leave: () => settings.close(),
      },
      'navigation': {
        enter: () => {
          settings.close()
          navigation.open()
        },
        back: () => {
          navigation.close()
        },
        completed: () => {
          navigation.close()
        },
      },
    },
  }
}
