// Framework
import { useHotkey } from '@vuetify/v0'

// Utilities
import { watch } from 'vue'

// Types
import type { StepHandlerContext } from '@/composables/useDiscovery'
import type { UseSearchReturn } from '@/composables/useSearch'

interface TourContext {
  search: UseSearchReturn
}

/**
 * Keyboard navigation tour handlers.
 * Interactive mode: each step waits for the user to perform the action.
 */
export function defineTour (context: TourContext) {
  const { search } = context ?? {}

  if (!search) {
    console.error('[navigating-by-keyboard] search not provided in context!')
    return { handlers: {} }
  }

  return {
    exit: () => {
      search.close()
    },
    handlers: {
      // Step 1: Open search with Ctrl+K (highlights search button)
      'search': {
        enter ({ next }: StepHandlerContext) {
          search.close()
          // Watch for search to open
          const unwatch = watch(search.isOpen, isOpen => {
            if (isOpen) {
              unwatch()
              next()
            }
          })
        },
      },

      // Step 2: Type to search (highlights search input)
      'search-input': {
        enter ({ next }: StepHandlerContext) {
          search.clear()
          search.focus()
          // Watch for user to type "tabs"
          const unwatch = watch(search.text, text => {
            if (text.toLowerCase().includes('tabs')) {
              unwatch()
              next()
            }
          })
        },
      },

      // Step 3: Select result with Enter
      'select-result': {
        enter ({ next }: StepHandlerContext) {
          search.open()
          search.query('Tabs')
          // Watch for search to close (Enter navigates and closes)
          const unwatch = watch(search.isOpen, isOpen => {
            if (!isOpen) {
              unwatch()
              next()
            }
          })
        },
      },

      // Step 4: Reopen search with Ctrl+K
      'reopen-search': {
        enter ({ next }: StepHandlerContext) {
          search.close()
          // Watch for search to open again
          const unwatch = watch(search.isOpen, isOpen => {
            if (isOpen) {
              unwatch()
              next()
            }
          })
        },
      },

      // Step 5: Close search with Escape
      'close-search': {
        enter ({ next }: StepHandlerContext) {
          search.open()
          search.clear()
          // Watch for Escape to close
          useHotkey('escape', () => {
            next()
          }, { inputs: true })
        },
      },

      // Step 6: Complete
      'complete': {
        enter () {
          search.close()
        },
      },
    },
  }
}
