// Factories
import { createPlugin } from '#v0/factories/createPlugin'

// Composables
import { createContext } from '#v0/factories/createContext'

// Adapters
import { MarkedAdapter } from './adapters'

// Types
import type { App } from 'vue'
import type { PluginOptions } from '#v0/factories/createPlugin'

export interface MarkdownAdapter {
  render: (content: string) => string
}

export interface MarkdownContext {
  render: MarkdownAdapter['render']
}

export interface MarkdownOptions {
  adapter?: MarkdownAdapter
}

export interface MarkdownPlugin extends PluginOptions {}

export const [useMarkdownContext, provideMarkdownContext] = createContext<MarkdownContext>('v0:markdown')

/**
 * Creates a markdown renderer using the specified adapter.
 * This function provides a consistent interface for rendering markdown content
 * regardless of the underlying markdown parsing library.
 *
 * @param options Optional configuration including the markdown adapter to use.
 * @returns A render function that converts markdown strings to HTML.
 */
export function createMarkdown (adapter: MarkdownAdapter) {
  return adapter.render
}

/**
 * Simple hook to access the markdown context.
 *
 * @returns The markdown context containing the render function.
 */
export function useMarkdown () {
  return useMarkdownContext()
}

/**
 * Creates a Vue plugin for providing markdown rendering capabilities.
 * Uses the universal plugin factory to eliminate boilerplate code.
 *
 * @param options Optional configuration for the markdown adapter.
 * @returns A Vue plugin object with install method.
 */
export function createMarkdownPlugin (options: MarkdownOptions = {}): MarkdownPlugin {
  const { adapter = new MarkedAdapter() } = options
  const render = createMarkdown(adapter)

  return createPlugin<MarkdownPlugin>({
    namespace: 'v0:markdown',
    provide: (app: App) => {
      provideMarkdownContext({ render }, app)
    },
  })
}
