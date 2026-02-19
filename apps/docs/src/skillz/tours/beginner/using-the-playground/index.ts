// Types
import type { PlaygroundControl } from '@/stores/playground'

interface PlaygroundContext {
  panel: PlaygroundControl
  sidebar: PlaygroundControl
  examples: PlaygroundControl
}

interface TourContext {
  playground: PlaygroundContext
}

/**
 * Tour definition for "Using the Playground".
 * Opens and closes playground panels so users see each feature in context.
 */
export function defineTour ({ playground }: TourContext) {
  return {
    handlers: {
      'welcome': {
        enter: () => {
          playground.panel.close()
          playground.examples.close()
        },
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
      },
      'file-tree': {
        enter: () => {
          playground.examples.close()
          playground.sidebar.open()
        },
      },
      'editor': {
        enter: () => playground.examples.close(),
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
