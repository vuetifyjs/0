// Stores
import { usePlaygroundStore } from '@/stores/playground'

/**
 * Tour definition for "Using the Playground".
 * Opens and closes playground panels so users see each feature in context.
 */
export function defineTour () {
  const playground = usePlaygroundStore()

  return {
    handlers: {
      'welcome': {
        enter: () => {
          playground.panel.close()
          playground.examples.close()
          playground.sidebar.close()
        },
      },
      'sidebar-toggle': {
        enter: () => {
          playground.panel.close()
          playground.examples.close()
        },
      },
      'file-tree': {
        enter: () => {
          playground.examples.close()
          playground.sidebar.open()
        },
        back: () => playground.sidebar.close(),
      },
      'editor': {
        enter: () => playground.examples.close(),
      },
      'preview': {
        enter: () => playground.examples.close(),
      },
      'panel-toggle': {
        enter: () => {
          playground.panel.close()
          playground.examples.close()
        },
      },
      'intro-panel': {
        enter: () => playground.panel.open(),
        back: () => playground.panel.close(),
      },
      'examples': {
        enter: () => {
          playground.panel.close()
          playground.examples.close()
        },
        back: () => playground.panel.open(),
      },
      'examples-menu': {
        enter: () => playground.examples.open(),
        back: () => playground.examples.close(),
      },
      'complete': {
        enter: () => {
          playground.panel.close()
          playground.examples.close()
        },
      },
    },
  }
}
