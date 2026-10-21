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

  // The reference opens above its token until the space above reaches 400px,
  // then flips below. The tour card also sits above the token, and on a phone
  // it moves below when that space is under 256px. Keep the token just past
  // that line so the tour card stays above and the reference opens under it.
  function placeHoverTarget (target: HTMLElement) {
    const rect = target.getBoundingClientRect()
    window.scrollBy(0, rect.top - 270)
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
          if (target) activate(target)
        },
      },
      parts: {
        enter: async ({ activate }: StepHandlerContext) => {
          setInline(false)
          hideHover()
          const target = await query('[data-tour="api-cards"]')
          if (target) activate(target)
        },
      },
      inline: {
        enter: async ({ activate }: StepHandlerContext) => {
          setInline(true)
          hideHover()
          writeSearch('')
          const target = await query('[data-tour="api-inline-toggle"]')
          if (target) activate(target)
        },
      },
      filter: {
        enter: async ({ activate }: StepHandlerContext) => {
          setInline(true)
          hideHover()
          const target = await query('[data-tour="api-search"]')
          writeSearch('model')
          if (target) activate(target)
        },
      },
      props: {
        enter: async ({ activate }: StepHandlerContext) => {
          setInline(true)
          hideHover()
          await query('[data-tour="api-search"]')
          writeSearch('')
          const target = await query('#tabs-root-props')
          if (target) activate(target)
        },
      },
      slots: {
        enter: async ({ activate }: StepHandlerContext) => {
          setInline(true)
          hideHover()
          await query('[data-tour="api-search"]')
          writeSearch('')
          const target = await query('#tabs-item-slots')
          if (target) activate(target)
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
          activate(target, { scroll: false })
          hoverTarget = target
          target.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
          await new Promise(resolve => setTimeout(resolve, 250))
          raiseHover()
        },
        leave: hideHover,
      },
      standalone: {
        enter: async ({ activate }: StepHandlerContext) => {
          setInline(true)
          hideHover()
          const target = await query('[data-tour="api-inline-toggle"]')
          if (target) activate(target)
        },
      },
    },
  }
}
