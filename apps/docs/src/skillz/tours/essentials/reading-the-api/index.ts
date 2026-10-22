// Utilities
import { nextTick } from 'vue'

// Types
import type { StepHandlerContext } from '@/composables/useDiscovery'
import type { SettingsContext } from '@/composables/useSettings'

interface TourContext {
  settings: Pick<SettingsContext, 'showInlineApi'>
}

/**
 * Reading the API tour handlers.
 *
 * Targets live in the Tabs page's generated reference, so each enter
 * calls ctx.activate. showInlineApi is the reader's persisted setting.
 * The first change snapshots it; exit writes it back. stop() and
 * complete() both run exit.
 */
export function defineTour ({ settings }: TourContext) {
  let saved: boolean | undefined
  let hoverTarget: HTMLElement | null = null
  let opened: HTMLElement | null = null

  function remember () {
    if (saved === undefined) saved = settings.showInlineApi.value
  }

  function setInline (open: boolean) {
    remember()
    settings.showInlineApi.value = open
  }

  function restore () {
    if (saved === undefined) return
    settings.showInlineApi.value = saved
    saved = undefined
    hideHover()
  }

  async function query (selector: string): Promise<HTMLElement | null> {
    await nextTick()
    return document.querySelector<HTMLElement>(selector)
  }

  function searchInput (): HTMLInputElement | null {
    return document.querySelector<HTMLInputElement>('[data-tour="api-search"] input')
  }

  function writeSearch (value: string) {
    const input = searchInput()
    if (!input) return
    input.value = value
    input.dispatchEvent(new Event('input', { bubbles: true }))
  }

  function conceal () {
    if (!opened) return
    const region = opened
    opened = null
    if (region.hasAttribute('hidden')) return
    region.parentElement?.querySelector<HTMLButtonElement>('button')?.click()
  }

  function reveal (target: HTMLElement) {
    const region = target.closest<HTMLElement>('[role="region"]')
    if (!region || !region.hasAttribute('hidden')) return
    region.parentElement?.querySelector<HTMLButtonElement>('button')?.click()
    opened = region
  }

  function hideHover () {
    conceal()
    if (!hoverTarget) return
    hoverTarget.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }))
    hoverTarget = null
  }

  // The tour card sits above the token and is about 310px tall, so a token
  // higher than that gets covered when the card is shifted back on screen.
  // The reference opens above its token until the space above reaches 400px,
  // then flips below. 380 clears the tour card and stays under that line, so
  // the reference opens under the highlight. On a phone the tour card moves
  // below when the space above is under 256px, and 380 keeps it above.
  function placeHoverTarget (target: HTMLElement) {
    const rect = target.getBoundingClientRect()
    window.scrollBy(0, rect.top - 380)
  }

  function proseCandidate (): HTMLElement | null {
    const nodes = document.querySelectorAll<HTMLElement>('[data-api-candidate="Tabs.Root"]')
    for (const node of nodes) {
      if (!node.closest('pre, .shiki')) return node
    }
    return null
  }

  async function settle () {
    await nextTick()
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))
  }

  // The event id contains a colon, which a #id selector reads as a pseudo.
  function row (id: string): HTMLElement | null {
    const heading = document.querySelector<HTMLElement>(`[id="${CSS.escape(id)}"]`)
    const card = heading?.closest('.border')
    return card instanceof HTMLElement ? card : null
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

  // A card placed above its target is about 310px tall. Centering a tall
  // target leaves less than that, and the title slides off the top. Nudge
  // the target down so the card fits. Anchor positioning follows the scroll.
  function clearCard (target: HTMLElement | null) {
    if (!target) return
    const top = target.getBoundingClientRect().top
    if (top >= 340) return
    window.scrollBy(0, top - 340)
  }

  async function list () {
    setInline(true)
    hideHover()
    await query('[data-tour="api-search"]')
    writeSearch('')
  }

  function raiseHover () {
    const popover = document.querySelector<HTMLElement>('.docs-api-hover-popover')
    if (!popover) return
    // Scrim is 9998. z-index is an integer, and 9999 is the tour card.
    // This step keeps that card above the token and the hover card below it.
    popover.style.zIndex = '9999'
  }

  return {
    exit: restore,
    handlers: {
      reference: {
        enter: async ({ activate }: StepHandlerContext) => {
          setInline(false)
          hideHover()
          const target = await query('[data-tour="api-reference"]')
          spotlight(activate, target)
          clearCard(target)
        },
      },
      parts: {
        enter: async ({ activate }: StepHandlerContext) => {
          setInline(false)
          hideHover()
          const target = await query('[data-tour="api-cards"]')
          spotlight(activate, target)
          clearCard(target)
        },
      },
      inline: {
        enter: async ({ activate }: StepHandlerContext) => {
          setInline(true)
          hideHover()
          writeSearch('')
          const target = await query('[data-tour="api-inline-toggle"]')
          spotlight(activate, target)
        },
      },
      filter: {
        enter: async ({ activate }: StepHandlerContext) => {
          setInline(true)
          hideHover()
          const target = await query('[data-tour="api-search"]')
          writeSearch('model')
          spotlight(activate, target)
        },
      },
      props: {
        enter: async ({ activate }: StepHandlerContext) => {
          await list()
          const target = await query('#tabs-root-props')
          spotlight(activate, target)
          clearCard(target)
        },
      },
      model: {
        enter: async ({ activate }: StepHandlerContext) => {
          await list()
          const target = row('modelValue')
          spotlight(activate, target)
          clearCard(target)
        },
      },
      mandatory: {
        enter: async ({ activate }: StepHandlerContext) => {
          await list()
          const target = row('mandatory')
          spotlight(activate, target)
          clearCard(target)
        },
      },
      events: {
        enter: async ({ activate }: StepHandlerContext) => {
          await list()
          const target = row('update:model-value')
          spotlight(activate, target)
          clearCard(target)
        },
      },
      slots: {
        enter: async ({ activate }: StepHandlerContext) => {
          await list()
          const target = await query('#tabs-item-slots')
          spotlight(activate, target)
          clearCard(target)
        },
      },
      hover: {
        enter: async ({ activate }: StepHandlerContext) => {
          hideHover()
          const target = proseCandidate()
          if (!target) return
          // The prose name lives in a collapsed FAQ answer. A code-fence
          // token is inside an overflow clip, and anchoring the tour card
          // there paints it under the scrim.
          reveal(target)
          await settle()
          // Scroll before activate. The tour card measures the token once,
          // and a token above the fold would flip the card down onto the
          // reference on a phone.
          placeHoverTarget(target)
          spotlight(activate, target, false)
          hoverTarget = target
          await settle()
          // Opening the answer and scrolling fires a mouseleave that cancels
          // the card's open delay. Dispatch once the page has stopped moving,
          // then once more if that leave landed after the first dispatch.
          target.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
          await new Promise(resolve => setTimeout(resolve, 350))
          if (!document.querySelector('.docs-api-hover-popover')) {
            target.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
            await new Promise(resolve => setTimeout(resolve, 350))
          }
          raiseHover()
        },
        leave: hideHover,
      },
      standalone: {
        enter: async ({ activate }: StepHandlerContext) => {
          setInline(true)
          hideHover()
          const target = await query('[data-tour="api-inline-toggle"]')
          spotlight(activate, target)
        },
      },
    },
  }
}
