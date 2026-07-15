import { vi } from 'vitest'
import { renderToString } from 'vue/server-renderer'

// Utilities
import { createSSRApp, defineComponent, nextTick } from 'vue'

// Types
import type { App } from 'vue'

export interface HydrateResult {
  html: string
  mismatches: string[]
  messages: string[]
}

export interface HydrateOptions {
  /** Called with each App instance so callers can install plugins before render/hydrate. */
  setup?: (app: App) => void
}

/**
 * Renders a render function to SSR HTML, then hydrates that exact HTML with
 * createSSRApp().mount() and captures Vue's hydration-mismatch console output.
 *
 * Unlike `@vue/test-utils` mount() (which hydrates a fresh container), this
 * helper feeds the actual SSR HTML back to the client — the only path that
 * exercises Vue's real hydration codepath and can produce mismatch warnings.
 */
export async function hydrate (render: () => unknown, options?: HydrateOptions): Promise<HydrateResult> {
  const messages: string[] = []
  function capture (...args: unknown[]) {
    messages.push(args.map(String).join(' '))
  }
  const warn = vi.spyOn(console, 'warn').mockImplementation(capture)
  const error = vi.spyOn(console, 'error').mockImplementation(capture)

  const serverApp = createSSRApp(defineComponent({ render }))
  options?.setup?.(serverApp)
  const html = await renderToString(serverApp)

  const container = document.createElement('div')
  container.innerHTML = html
  const clientApp = createSSRApp(defineComponent({ render }))
  options?.setup?.(clientApp)
  clientApp.mount(container)
  await nextTick()

  warn.mockRestore()
  error.mockRestore()
  clientApp.unmount()

  const mismatches = messages.filter(m => /hydrat|mismatch/i.test(m))
  return { html, mismatches, messages }
}
