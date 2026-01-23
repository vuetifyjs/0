// Types
import type { DiscoveryStepConfig } from '@/composables/useDiscovery'
import type { TourComposables } from '@/stores/skillz'
import type { SkillMeta } from '@/types/skill'

// Data
import tour from './index.json'

export interface TourDefinition {
  tour: SkillMeta
  steps: string[]
  handlers?: Record<string, DiscoveryStepConfig>
}

/**
 * Returns tour definition for registration by the store.
 * Guided mode: handlers set up UI state, but no advanceWhen (users click next).
 */
export function defineTour ({ search, settings, sheet }: TourComposables): TourDefinition {
  return {
    tour: tour as SkillMeta,
    steps: tour.steps.map(s => s.id),
    handlers: {
      'open-search': {
        enter: () => {
          search.close()
          settings.close()
        },
      },
      'search-tabs': {
        enter: () => {
          search.open()
          search.focus()
        },
        leave: () => search.close(),
      },
      'ask-ai': {
        enter: () => sheet.close(),
      },
      'ask-ai-close': {
        enter: () => sheet.open(),
        leave: () => sheet.close(),
      },
      'ask-ai-reopen': {
        enter: () => sheet.close(),
      },
      'ask-ai-options': {
        enter: () => sheet.open(),
        leave: () => sheet.close(),
      },
      'open-settings': {
        enter: () => {
          sheet.close()
          settings.close()
        },
      },
      'skill-level': {
        enter: () => settings.open(),
        leave: () => settings.close(),
      },
    },
  }
}
