// Types
import type { UseSearchReturn } from '@/composables/useSearch'

interface TourContext {
  search: UseSearchReturn
}

/**
 * Search tour handlers.
 * Opens search modal and manages query state to demonstrate features.
 */
export function defineTour (context: TourContext) {
  const { search } = context ?? {}

  if (!search) {
    console.error('[using-search] search not provided in context!')
    return { handlers: {} }
  }

  return {
    handlers: {
      'search': {
        enter: () => {
          search.close()
        },
      },
      'search-input': {
        enter: () => {
          search.open()
        },
        back: () => {
          search.close()
        },
      },
      'search-results': {
        enter: () => {
          search.query('Tabs')
        },
        back: () => {
          search.clear()
        },
      },
      'search-favorite': {
        enter: () => {
          if (!search.isOpen.value) search.open()
          search.query('Tabs')
        },
      },
      'search-ask-ai': {
        enter: () => {
          if (!search.isOpen.value) search.open()
          search.query('Tabs')
        },
      },
      'search-dismiss': {
        enter: () => {
          if (!search.isOpen.value) search.open()
          search.query('Tabs')
        },
      },
      'search-history': {
        enter: () => {
          if (!search.isOpen.value) search.open()
          search.clear()
        },
        back: () => {
          search.query('Tabs')
        },
      },
      'search-favorited': {
        enter: () => {
          if (!search.isOpen.value) search.open()
          // Favorite the Tabs page directly
          const tabsPage = {
            id: '/components/disclosure/tabs',
            title: 'Tabs',
            category: 'Component',
            path: '/components/disclosure/tabs',
          }
          if (!search.isFavorite(tabsPage.id)) {
            search.addRecent(tabsPage)
            search.favorite(tabsPage.id)
          }
          search.clear()
        },
        back: () => {
          search.query('Tabs')
        },
      },
      'conclusion': {
        enter: () => {
          search.close()
        },
        back: () => {
          search.open()
        },
      },
    },
  }
}
