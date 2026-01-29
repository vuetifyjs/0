// Types
import type { UseSearchReturn } from '@/composables/useSearch'

interface TourContext {
  search: UseSearchReturn
}

const TABS_PAGE = {
  id: '/components/disclosure/tabs',
  title: 'Tabs',
  category: 'Component',
  path: '/components/disclosure/tabs',
}

/**
 * Search tour handlers.
 * Opens search modal and manages query state to demonstrate features.
 *
 * Uses the unified `enter` handler pattern - each handler ensures the correct
 * state regardless of how the user arrived (forward, back, resume).
 */
export function defineTour (context: TourContext) {
  const { search } = context ?? {}

  if (!search) {
    console.error('[using-search] search not provided in context!')
    return { handlers: {} }
  }

  return {
    exit: () => {
      search.close()
    },
    handlers: {
      // Step 1: Show the search button (search closed)
      'search': {
        enter: () => {
          search.close()
        },
      },

      // Step 2: Search input (search open, ready to type)
      'search-input': {
        enter: () => {
          search.open()
          search.clear()
        },
      },

      // Step 3: Search results (show results for "Tabs")
      'search-results': {
        enter: () => {
          search.open()
          search.query('Tabs')
        },
      },

      // Step 4: Favorite button on first result
      'search-favorite': {
        enter: () => {
          search.open()
          search.query('Tabs')
        },
      },

      // Step 5: Ask AI button
      'search-ask-ai': {
        enter: () => {
          search.open()
          search.query('Tabs')
        },
      },

      // Step 6: Dismiss button
      'search-dismiss': {
        enter: () => {
          search.open()
          search.query('Tabs')
        },
      },

      // Step 7: Recent searches (empty query shows history)
      'search-history': {
        enter: () => {
          search.open()
          // Ensure there's a recent entry to show
          if (search.recents.value.length === 0) {
            search.addRecent(TABS_PAGE)
          }
          search.clear()
        },
      },

      // Step 8: Favorites section (after favoriting Tabs)
      'search-favorited': {
        enter: () => {
          search.open()
          // Favorite the Tabs page if not already
          if (!search.isFavorite(TABS_PAGE.id)) {
            search.addRecent(TABS_PAGE)
            search.favorite(TABS_PAGE.id)
          }
          search.clear()
        },
      },

      // Step 9: Conclusion (search closed)
      'conclusion': {
        enter: () => {
          search.close()
        },
      },
    },
  }
}
