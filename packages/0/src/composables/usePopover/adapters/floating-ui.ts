/**
 * @module FloatingUIPopoverAdapter
 *
 * @remarks
 * First-party [Floating UI](https://floating-ui.com) positioning adapter for
 * `usePopover`. Subpath-only — import from
 * `@vuetify/v0/popover/adapters/floating-ui`. Requires the `@floating-ui/dom`
 * peer. `positionTry` is ignored; `flip()` covers the overflow intent.
 *
 * @example
 * ```ts
 * import { usePopover } from '@vuetify/v0'
 * import { FloatingUIPopoverAdapter } from '@vuetify/v0/popover/adapters/floating-ui'
 *
 * const popover = usePopover({ adapter: new FloatingUIPopoverAdapter() })
 * ```
 */

// Adapters
import { PopoverAdapter } from './adapter'

// Globals
import { IN_BROWSER } from '#v0/constants/globals'

// Utilities
import { autoUpdate, computePosition, flip, offset, shift } from '@floating-ui/dom'
import { isNullOrUndefined } from '#v0/utilities'
import { onScopeDispose, shallowRef, watch } from 'vue'

// Types
import type { PopoverAdapterContext } from './adapter'
import type { Middleware, Placement } from '@floating-ui/dom'
import type { Ref } from 'vue'

export interface FloatingUIPopoverAdapterOptions {
  /** Middleware passed to `computePosition`. @default `[offset(8), flip(), shift({ padding: 8 })]` */
  middleware?: Middleware[]
}

/**
 * JS-engine positioning adapter backed by `@floating-ui/dom`.
 *
 * `setup()` is re-entrant: a single shared instance (e.g. the one passed to
 * `createPopoverPlugin`) can serve every popover. Per-call state lives in the
 * setup closure, never on `this.dispose`.
 *
 * `positionTry` is ignored; `flip()` covers the overflow intent.
 */
export class FloatingUIPopoverAdapter extends PopoverAdapter {
  private middleware: Middleware[]

  constructor (options?: FloatingUIPopoverAdapterOptions) {
    super()
    this.middleware = options?.middleware ?? [offset(8), flip(), shift({ padding: 8 })]
  }

  setup (context: PopoverAdapterContext): Readonly<Ref<Record<string, string>>> {
    function positionStyles (top: string, left: string): Record<string, string> {
      return {
        'position': 'fixed',
        'margin': 'unset',
        'inset': 'unset',
        top,
        left,
      }
    }

    const styles = shallowRef<Record<string, string>>(positionStyles('0px', '0px'))
    const middleware = this.middleware
    let stopAutoUpdate: (() => void) | undefined

    async function reposition () {
      if (!IN_BROWSER) return

      const anchor = context.anchorEl.value
      const content = context.contentEl.value

      if (isNullOrUndefined(anchor) || isNullOrUndefined(content)) return
      if (!context.isOpen.value) return

      const { side, align } = context.placement.value
      const placement: Placement = align === 'center' ? side : `${side}-${align}`

      const { x, y } = await computePosition(anchor, content, {
        placement,
        middleware,
      })

      if (!context.isOpen.value) return

      styles.value = positionStyles(`${y}px`, `${x}px`)
    }

    function sync () {
      stopAutoUpdate?.()
      stopAutoUpdate = undefined

      if (!IN_BROWSER) return

      const anchor = context.anchorEl.value
      const content = context.contentEl.value

      if (isNullOrUndefined(anchor) || isNullOrUndefined(content) || !context.isOpen.value) return

      stopAutoUpdate = autoUpdate(anchor, content, reposition)
    }

    const stopWatch = watch(
      [context.anchorEl, context.contentEl, context.isOpen, context.placement],
      sync,
      { immediate: true },
    )

    function stop () {
      stopWatch()
      stopAutoUpdate?.()
      stopAutoUpdate = undefined
    }

    onScopeDispose(stop, true)

    return styles
  }
}
