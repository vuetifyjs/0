// Types
import type { StepHandlerContext } from '@/composables/useDiscovery'

/**
 * Using Examples tour handlers.
 *
 * Every step highlights a piece of the page's live example rather than app
 * chrome, so there's no `<Discovery.Activator>` to hang a step id on. Each
 * handler resolves its target via `ctx.activate(selector)` instead - see
 * `useDiscovery`'s `activate`/`deactivate` context helpers. Lookups for
 * multi-instance elements (copy/playground buttons) are scoped to the single
 * "host" example on the page to avoid matching the wrong instance.
 *
 * Uses the unified `enter` handler pattern - each handler re-resolves the
 * host example so it works regardless of how the user arrived (forward,
 * back, resume).
 */
export function defineTour () {
  function getHost (): HTMLElement | null {
    return document.querySelector<HTMLElement>('[data-tour="example"]')
  }

  function getInHost (selector: string): HTMLElement | null {
    return getHost()?.querySelector<HTMLElement>(selector) ?? null
  }

  // The copy/size/wrap/playground toolbar is opacity:0 until the pane is
  // hovered or focus-within (see DocsGenesisExample.vue). The tour highlights
  // these buttons without the user's cursor over them, so force it visible
  // for the duration of the step and let CSS take back over on leave.
  function showToolbar (): void {
    getInHost('[data-tour="example-toolbar"]')?.style.setProperty('opacity', '1')
  }

  function hideToolbar (): void {
    getInHost('[data-tour="example-toolbar"]')?.style.removeProperty('opacity')
  }

  return {
    handlers: {
      intro: {
        enter: ({ activate, done }: StepHandlerContext) => {
          const host = getHost()
          if (host) activate(host)
          done()
        },
      },

      preview: {
        enter: ({ activate, done }: StepHandlerContext) => {
          activate('[data-tour="example-preview"]')
          done()
        },
      },

      source: {
        enter: ({ activate, done }: StepHandlerContext) => {
          activate('[data-tour="example-code"]')
          done()
        },
      },

      copy: {
        enter: ({ activate, done }: StepHandlerContext) => {
          showToolbar()
          const button = getInHost('[aria-label="Copy code"]')
          if (button) activate(button)
          done()
        },
        leave: hideToolbar,
      },

      playground: {
        enter: ({ activate, done }: StepHandlerContext) => {
          showToolbar()
          const button = getInHost('[aria-label="Open in Vuetify Play"]')
          if (button) activate(button)
          done()
        },
        leave: hideToolbar,
      },

      tune: {
        enter: ({ activate, done }: StepHandlerContext) => {
          showToolbar()
          activate('[data-tour="example-toolbar"]')
          done()
        },
        leave: hideToolbar,
      },
    },
  }
}
