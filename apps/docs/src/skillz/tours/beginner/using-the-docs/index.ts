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
 * Guided mode: handlers set up UI state to show features, users just click next.
 */
export function defineTour ({ app, settings, sheet }: TourComposables): TourDefinition {
  return {
    tour: tour as SkillMeta,
    steps: tour.steps.map(s => s.id),
    handlers: {
      'ask-ai': {
        leave: () => {
          sheet.close()
        },
        back: () => {
          sheet.close()
        },
      },
      'ask-ai-sheet': {
        enter: () => {
          sheet.open()
        },
      },
      'ask-ai-features': {
        back: () => {
          sheet.open()
        },
      },
      'settings': {
        enter: () => {
          sheet.close()
        },
        back: () => {
          settings.close()
        },
      },
      'skill-level': {
        enter: () => {
          settings.open()
        },
        leave: () => {
          settings.close()
        },
      },
      'navigation': {
        enter: () => {
          settings.close()
          app.drawer = true
        },
        leave: () => {
          app.drawer = false
        },
      },
    },
  }
}
