// Utilities
import { nextTick } from 'vue'

// Types
import type { StepHandlerContext } from '@/composables/useDiscovery'

// Document order on /components/forms/switch. The basic switch is first.
// The settings panel, with the mixed Enable all lever, is second.
const LIVE = 0
const PANEL = 1

/**
 * Style the control tour handlers.
 *
 * Targets are pieces of the Switch page, so each enter calls activate.
 * A global data-tour=example selector would also match the settings
 * panel, so every example lookup takes a document-order index.
 * Guided steps block the target, so clicks are simulated.
 */
export function defineTour () {
  function example (index = LIVE): HTMLElement | null {
    return document.querySelectorAll<HTMLElement>('[data-tour="example"]')[index] ?? null
  }

  function getIn (selector: string, index = LIVE): HTMLElement | null {
    return example(index)?.querySelector<HTMLElement>(selector) ?? null
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

  // Default saved state is already mixed. A reader who toggled the panel
  // first needs one child flip: all-on or all-off both become mixed.
  function ensureMixed () {
    const master = getIn('[data-tour="example-preview"] [role="switch"]', PANEL)
    if (!master || master.dataset.state === 'indeterminate') return
    const rows = example(PANEL)?.querySelectorAll<HTMLElement>(
      '[data-tour="example-preview"] [role="switch"]',
    )
    rows?.[1]?.click()
  }

  function attributeTable (): HTMLElement | null {
    const heading = document.querySelector('#styling-with-data-attributes')
    let node = heading?.nextElementSibling ?? null
    while (node) {
      if (node.classList.contains('docs-table')) return node as HTMLElement
      if (node.id === 'accessibility') return null
      node = node.nextElementSibling
    }
    return null
  }

  // The cutout otherwise sits on the element's own border. 8px keeps a gap
  // without swallowing the neighbors.
  function spotlight (
    activate: StepHandlerContext['activate'],
    target: HTMLElement | null,
    scroll = true,
  ) {
    if (!target) return
    activate(target, { padding: 8, scroll })
  }

  // The tallest card is about 350px. Centering a tall target leaves less
  // than that, and the title slides off the top. Nudge the target down so
  // the card fits. Anchor positioning follows the scroll.
  function clearCard (target: HTMLElement | null) {
    if (!target) return
    const top = target.getBoundingClientRect().top
    if (top >= 380) return
    window.scrollBy(0, top - 380)
  }

  function show (
    activate: StepHandlerContext['activate'],
    target: HTMLElement | null,
  ) {
    spotlight(activate, target)
    clearCard(target)
  }

  return {
    handlers: {
      preview: {
        enter: async ({ activate }: StepHandlerContext) => {
          await settle()
          show(activate, example())
        },
      },
      on: {
        enter: async ({ activate }: StepHandlerContext) => {
          await settle()
          turnOn()
          show(activate, getIn('[data-tour="example-preview"]'))
        },
      },
      track: {
        enter: async ({ activate }: StepHandlerContext) => {
          await settle()
          turnOn()
          await settle()
          show(activate, getIn('[data-tour="example-preview"] [role="switch"] > [data-state]'))
        },
      },
      thumb: {
        enter: async ({ activate }: StepHandlerContext) => {
          await settle()
          turnOn()
          await settle()
          show(activate, getIn('[data-tour="example-preview"] [role="switch"] > [data-state] > [data-state]'))
        },
      },
      source: {
        enter: async ({ activate }: StepHandlerContext) => {
          await settle()
          openCode()
          await settle()
          show(activate, getIn('[data-tour="example-code"]'))
        },
      },
      section: {
        enter: async ({ activate }: StepHandlerContext) => {
          await settle()
          show(activate, document.querySelector<HTMLElement>('#styling-with-data-attributes'))
        },
      },
      attributes: {
        enter: async ({ activate }: StepHandlerContext) => {
          await settle()
          show(activate, attributeTable())
        },
      },
      absent: {
        enter: async ({ activate }: StepHandlerContext) => {
          await settle()
          show(activate, document.querySelector<HTMLElement>('[data-tour="switch-disabled"]'))
        },
      },
      mixed: {
        enter: async ({ activate }: StepHandlerContext) => {
          await settle()
          ensureMixed()
          await settle()
          show(activate, getIn('[data-tour="example-preview"] [role="switch"]', PANEL))
        },
      },
      roles: {
        enter: async ({ activate }: StepHandlerContext) => {
          await settle()
          show(activate, document.querySelector<HTMLElement>('#accessibility'))
        },
      },
      renderless: {
        enter: async ({ activate }: StepHandlerContext) => {
          await settle()
          show(activate, document.querySelector<HTMLElement>('[data-tour="switch-renderless"]'))
        },
      },
    },
  }
}
