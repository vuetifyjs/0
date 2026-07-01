// Utilities
import { nextTick } from 'vue'

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
 * Guided steps never require the reader to click the highlighted target -
 * DocsHighlight.vue blocks clicks on the activator for every non-interactive
 * tour (`blockActivator = !discovery.isInteractive.value`). Steps that want
 * to show a real interaction (selecting a preview item, revealing code,
 * switching a code-group tab) simulate the click themselves via a real
 * `HTMLElement.click()` so the reader sees the result without needing to
 * (and being unable to) perform the action.
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

  // Reveal the code pane if it's collapsed. Idempotent - checks
  // aria-expanded first so re-entering this step (back/resume) never
  // accidentally re-toggles it closed.
  function openCode (): void {
    const toggle = getInHost('[data-tour="example-toggle"]')
    if (toggle?.getAttribute('aria-expanded') === 'false') toggle.click()
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
          const preview = getInHost('[data-tour="example-preview"]')
          if (preview) {
            activate(preview)
            preview.querySelector<HTMLElement>('button')?.click()
          }
          done()
        },
      },

      source: {
        enter: async ({ activate }: StepHandlerContext) => {
          openCode()
          await nextTick()
          activate('[data-tour="example-code"]')
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

      codegroups: {
        enter: ({ activate, done }: StepHandlerContext) => {
          const group = document.querySelector<HTMLElement>('[data-tour="example-codegroup"]')
          if (group) {
            activate(group)
            const npmTab = [...group.querySelectorAll<HTMLElement>('button')]
              .find(button => button.textContent?.trim() === 'npm')
            npmTab?.click()
          }
          done()
        },
      },
    },
  }
}
