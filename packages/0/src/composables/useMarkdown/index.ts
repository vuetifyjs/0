// Composables
import { useContext } from '../useContext'

// Adapters
import { MarkedAdapter } from './adapters'

// Types
import type { App } from 'vue'

export interface MarkdownAdapter {
  render: (content: string) => string
}

export interface MarkdownContext {
  render: MarkdownAdapter['render']
}

export interface MarkdownOptions {
  adapter?: MarkdownAdapter
}

export interface MarkdownPlugin {
  install: (app: App) => void
}

export const [useMarkdownContext, provideMarkdownContext] = useContext<MarkdownContext>('v0:markdown')

export function createMarkdown (options: MarkdownOptions = {}) {
  const { adapter = new MarkedAdapter() } = options

  return adapter.render
}

export function useMarkdown () {
  return useMarkdownContext()
}

export function createMarkdownPlugin (options: MarkdownOptions = {}): MarkdownPlugin {
  return {
    install (app: App) {
      const render = createMarkdown(options)

      app.runWithContext(() => {
        provideMarkdownContext({ render }, app)
      })
    },
  }
}
