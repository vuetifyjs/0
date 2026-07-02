// Utilities
import { nextTick } from 'vue'

// Types
import type { StepHandlerContext } from '@/composables/useDiscovery'

// Document-order positions of the host page's gn-examples
// (/guide/essentials/using-the-docs): the live Group preview and the
// multi-file combobox example. The recipe is a plain code fence, not a
// gn-example - it's resolved from the #recipes heading instead.
const LIVE = 0
const FILES = 1

/**
 * Using Examples tour handlers.
 *
 * Every step highlights a piece of the page's live examples rather than app
 * chrome, so there's no `<Discovery.Activator>` to hang a step id on. Each
 * handler resolves its target via `ctx.activate(el)` instead - see
 * `useDiscovery`'s `activate`/`deactivate` context helpers. The page hosts
 * three examples, so every lookup is scoped to one of them by document
 * order - a global selector would match the wrong instance.
 *
 * Guided steps never require the reader to click the highlighted target -
 * DocsHighlight.vue blocks clicks on the activator for every non-interactive
 * tour (`blockActivator = !discovery.isInteractive.value`). Steps that want
 * to show a real interaction (selecting a preview item, revealing code,
 * switching a file tab) simulate the click themselves via a real
 * `HTMLElement.click()` so the reader sees the result without needing to
 * (and being unable to) perform the action.
 *
 * Uses the unified `enter` handler pattern - each handler re-resolves its
 * host example so it works regardless of how the user arrived (forward,
 * back, resume).
 */
export function defineTour () {
  function example (index: number): HTMLElement | null {
    return document.querySelectorAll<HTMLElement>('[data-tour="example"]')[index] ?? null
  }

  function getIn (index: number, selector: string): HTMLElement | null {
    return example(index)?.querySelector<HTMLElement>(selector) ?? null
  }

  // The copy/size/wrap/playground toolbar is opacity:0 until the pane is
  // hovered or focus-within (see DocsGenesisExample.vue). The tour highlights
  // these buttons without the user's cursor over them, so force it visible
  // for the duration of the step and let CSS take back over on leave.
  function showToolbar (index: number): void {
    getIn(index, '[data-tour="example-toolbar"]')?.style.setProperty('opacity', '1')
  }

  function hideToolbar (index: number): void {
    getIn(index, '[data-tour="example-toolbar"]')?.style.removeProperty('opacity')
  }

  // Reveal the full code. Which control exists depends on the example's
  // mode: non-peek examples render a "Show code" toggle bar
  // (example-toggle), peek examples render the always-visible-but-
  // truncated pane with an Expand pill (example-expand). The
  // [aria-expanded="false"] guard makes this idempotent - re-entering the
  // step (back/resume) never re-collapses an already-open pane.
  function openCode (index: number): void {
    getIn(
      index,
      '[data-tour="example-toggle"][aria-expanded="false"], [data-tour="example-expand"][aria-expanded="false"]',
    )?.click()
  }

  // The recipe is a plain code fence tagged with a data-tour=example-recipe
  // fence token (see build/markdown.ts), which lands on DocsMarkup's root.
  function recipe (): HTMLElement | null {
    return document.querySelector<HTMLElement>('[data-tour="example-recipe"]')
  }

  // A fence's action buttons hide behind an opacity:0 hover ancestor, and
  // unlike gn-examples there's no example-toolbar hook to flip - walk up
  // from the button to whichever ancestor carries the fade and force it
  // visible for the step.
  let revealed: HTMLElement | null = null

  function reveal (from: HTMLElement): void {
    let node: HTMLElement | null = from
    while (node) {
      if (getComputedStyle(node).opacity === '0') {
        node.style.setProperty('opacity', '1')
        revealed = node
        return
      }
      node = node.parentElement
    }
  }

  function unreveal (): void {
    revealed?.style.removeProperty('opacity')
    revealed = null
  }

  return {
    handlers: {
      'intro': {
        enter: ({ activate, done }: StepHandlerContext) => {
          const host = example(LIVE)
          if (host) activate(host)
          done()
        },
      },

      'preview': {
        enter: ({ activate, done }: StepHandlerContext) => {
          const preview = getIn(LIVE, '[data-tour="example-preview"]')
          if (preview) {
            activate(preview)
            // Group items toggle, so an unguarded click on re-entry (back/
            // resume, or state left over from an earlier run) would unselect
            // apple and contradict the step copy.
            const first = preview.querySelector<HTMLElement>('button')
            if (first?.getAttribute('aria-checked') === 'false') first.click()
          }
          done()
        },
      },

      'source': {
        enter: async ({ activate }: StepHandlerContext) => {
          openCode(LIVE)
          await nextTick()
          const pane = getIn(LIVE, '[data-tour="example-code"]')
          if (pane) activate(pane)
        },
      },

      'copy': {
        enter: ({ activate, done }: StepHandlerContext) => {
          showToolbar(LIVE)
          const button = getIn(LIVE, '[aria-label="Copy code"]')
          if (button) activate(button)
          done()
        },
        leave: () => hideToolbar(LIVE),
      },

      'playground': {
        enter: ({ activate, done }: StepHandlerContext) => {
          showToolbar(LIVE)
          const button = getIn(LIVE, '[aria-label="Open in Vuetify Play"]')
          if (button) activate(button)
          done()
        },
        leave: () => hideToolbar(LIVE),
      },

      'tune': {
        enter: ({ activate, done }: StepHandlerContext) => {
          showToolbar(LIVE)
          const toolbar = getIn(LIVE, '[data-tour="example-toolbar"]')
          if (toolbar) activate(toolbar)
          done()
        },
        leave: () => hideToolbar(LIVE),
      },

      'files': {
        // Target the "Hide code - N file(s)" toggle bar rather than the
        // whole example: the expanded multi-file example is taller than the
        // viewport, which would push the anchored popover off-screen.
        enter: async ({ activate }: StepHandlerContext) => {
          openCode(FILES)
          await nextTick()
          const toggle = getIn(FILES, '[data-tour="example-toggle"]')
          if (toggle) activate(toggle)
        },
      },

      'file-tabs': {
        enter: async ({ activate }: StepHandlerContext) => {
          openCode(FILES)
          await nextTick()
          example(FILES)?.querySelectorAll<HTMLElement>('[role="tab"]')[1]?.click()
          const bar = getIn(FILES, '[data-tour="example-tabs"]')
          if (bar) activate(bar)
        },
      },

      'file-actions': {
        enter: async ({ activate }: StepHandlerContext) => {
          openCode(FILES)
          await nextTick()
          const toolbar = getIn(FILES, '[role="toolbar"]')
          if (toolbar) activate(toolbar)
        },
      },

      'recipes': {
        enter: ({ activate, done }: StepHandlerContext) => {
          const fence = recipe()
          if (fence) activate(fence)
          done()
        },
      },

      'recipe-play': {
        enter: ({ activate, done }: StepHandlerContext) => {
          const button = recipe()?.querySelector<HTMLElement>('[aria-label="Open in Vuetify Play"]')
          if (button) {
            reveal(button)
            activate(button)
          }
          done()
        },
        leave: unreveal,
      },

      'codegroups': {
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
