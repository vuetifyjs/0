// Utilities
import { nextTick } from 'vue'

// Types
import type { StepHandlerContext } from '@/composables/useDiscovery'

/**
 * Style the control tour handlers.
 *
 * The first gn-example on /components/forms/switch is the basic switch.
 * Document order is the scope, same as Using Examples: a global
 * data-tour=example selector would also match the settings panel later
 * on the page.
 */
export function defineTour () {
  function example (): HTMLElement | null {
    return document.querySelector<HTMLElement>('[data-tour="example"]')
  }

  function getIn (selector: string): HTMLElement | null {
    return example()?.querySelector<HTMLElement>(selector) ?? null
  }

  async function settle () {
    await nextTick()
  }

  function turnOn () {
    const button = getIn('[data-tour="example-preview"] [role="switch"]')
    if (button?.getAttribute('aria-checked') === 'false') button.click()
  }

  function openCode () {
    getIn(
      '[data-tour="example-toggle"][aria-expanded="false"], [data-tour="example-expand"][aria-expanded="false"]',
    )?.click()
  }

  return {
    handlers: {
      preview: {
        enter: async ({ activate }: StepHandlerContext) => {
          await settle()
          const host = example()
          if (host) activate(host)
        },
      },
      on: {
        enter: async ({ activate }: StepHandlerContext) => {
          await settle()
          turnOn()
          const preview = getIn('[data-tour="example-preview"]')
          if (preview) activate(preview)
        },
      },
      source: {
        enter: async ({ activate }: StepHandlerContext) => {
          await settle()
          openCode()
          await settle()
          const pane = getIn('[data-tour="example-code"]')
          if (pane) activate(pane)
        },
      },
      section: {
        enter: async ({ activate }: StepHandlerContext) => {
          await settle()
          const heading = document.querySelector<HTMLElement>('#styling-with-data-attributes')
          if (heading) activate(heading)
        },
      },
      absent: {
        enter: async ({ activate }: StepHandlerContext) => {
          await settle()
          const fence = document.querySelector<HTMLElement>('[data-tour="switch-disabled"]')
          if (fence) activate(fence)
        },
      },
      roles: {
        enter: async ({ activate }: StepHandlerContext) => {
          await settle()
          const heading = document.querySelector<HTMLElement>('#accessibility')
          if (heading) activate(heading)
        },
      },
      renderless: {
        enter: async ({ activate }: StepHandlerContext) => {
          await settle()
          const fence = document.querySelector<HTMLElement>('[data-tour="switch-renderless"]')
          if (fence) activate(fence)
        },
      },
    },
  }
}
