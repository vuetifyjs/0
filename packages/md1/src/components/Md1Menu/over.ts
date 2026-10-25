/**
 * The simple-menu placement of the menus page: the sheet opens over the
 * emitting element with the currently selected item sitting on top of it,
 * never below it. Near a screen edge the whole sheet shifts vertically so
 * every item stays visible, and a sheet taller than the room scrolls
 * internally with the selected item centred in it (menus page, "Location",
 * "Vertical realignment", "Scrolling").
 *
 * CSS anchor positioning cannot express an offset measured from a row inside
 * the sheet, so this is a v0 `PopoverAdapter` that measures. It takes over
 * only while the sheet holds a selected row; otherwise it hands placement to
 * the adapter it wraps (the app's `createPopoverPlugin` adapter, or v0's CSS
 * anchor default), so action menus and cascading sub menus keep their areas.
 */

// Framework
import { clamp, createContext, IN_BROWSER, isNull, isNullOrUndefined, PopoverAdapter, useEventListener, V0PopoverAdapter } from '@vuetify/v0'

// Utilities
import { nextTick, shallowRef, toRef, toValue, watch } from 'vue'

// Types
import type { PopoverAdapterContext, PopoverPluginContext } from '@vuetify/v0'
import type { MaybeRefOrGetter, Ref } from 'vue'

export interface Md1OverOptions {
  /** The row to lay over the emitting element, or null to leave placement to the wrapped adapter. */
  item: (sheet: HTMLElement) => HTMLElement | null
  /** The element the row lands on. Defaults to the popover's anchor. */
  emitter?: () => Element | null | undefined
  /** Which inline edge of the sheet lines up with the emitter's. @default 'start' */
  align?: MaybeRefOrGetter<'start' | 'end'>
  /** Pixels the sheet moves toward the inline end from that edge; negative moves it toward the start. @default 0 */
  inset?: MaybeRefOrGetter<number>
}

/** The screen margin and the dismiss row when the theme sets no tokens: 16 dp and 48 dp. */
const MARGIN = 16

const [useOuter, provideOuter] = createContext<PopoverPluginContext | null>('v0:popover', null)

/** The row's top from the sheet's top edge, untouched by the entrance scale. */
function offset (item: HTMLElement, sheet: HTMLElement): number {
  let top = 0
  let el: HTMLElement | null = item

  while (!isNull(el) && el !== sheet) {
    top += el.offsetTop
    const parent: Element | null = el.offsetParent

    el = parent instanceof HTMLElement && sheet.contains(parent) ? parent : null
  }

  // offsetTop is measured from the sheet's padding edge when the sheet is the offset parent.
  return top + sheet.clientTop
}

export class Md1OverAdapter extends PopoverAdapter {
  private options: Md1OverOptions
  private fallback: PopoverAdapter

  constructor (options: Md1OverOptions, fallback?: PopoverAdapter) {
    super()
    this.options = options
    this.fallback = fallback ?? new V0PopoverAdapter()
  }

  setup (context: PopoverAdapterContext): Readonly<Ref<Record<string, string>>> {
    const { item: find, emitter, align: _align = 'start', inset: _inset = 0 } = this.options
    const base = this.fallback.setup(context)
    const placed = shallowRef<Record<string, string> | null>(null)
    // Pixels from the sheet's top to the selected row's centre, fixed at open so a scroll inside the sheet does not move it.
    let center: number | null = null

    // A renderless activator registers no element with v0; the control that names the sheet in `aria-controls` is the emitter then.
    function anchor (): Element | null {
      const sheet = context.contentEl.value
      const controls = isNullOrUndefined(sheet) || !sheet.id ? null : document.querySelector(`[aria-controls="${CSS.escape(sheet.id)}"]`)

      return emitter?.() ?? context.anchorEl.value ?? controls
    }

    function place () {
      const sheet = context.contentEl.value
      const target = anchor()

      if (isNullOrUndefined(sheet) || isNull(target) || isNull(center)) return

      const style = getComputedStyle(sheet)
      const margin = Number.parseFloat(style.getPropertyValue('--md1-keyline-margin')) || MARGIN
      const rtl = style.direction === 'rtl'
      const align = toValue(_align)
      const inset = toValue(_inset)
      const rect = target.getBoundingClientRect()
      const width = document.documentElement.clientWidth
      const height = document.documentElement.clientHeight
      const w = sheet.offsetWidth
      const h = sheet.offsetHeight
      const y = rect.top + rect.height / 2

      const start = rtl ? rect.right - inset - w : rect.left + inset
      const end = rtl ? rect.left - inset : rect.right + inset - w
      const left = clamp(align === 'start' ? start : end, margin, Math.max(margin, width - margin - w))
      const top = clamp(y - center, margin, Math.max(margin, height - margin - h))

      placed.value = {
        'position': 'fixed',
        'margin': '0',
        'inset': 'auto',
        'top': `${Math.round(top)}px`,
        'left': `${Math.round(left)}px`,
        'position-anchor': context.anchorName,
        'transform-origin': `${Math.round(rect.left + rect.width / 2 - left)}px ${Math.round(y - top)}px`,
      }
    }

    async function open () {
      center = null
      placed.value = null

      await nextTick()

      const sheet = context.contentEl.value
      const row = isNullOrUndefined(sheet) ? null : find(sheet)

      if (!context.isOpen.value || isNullOrUndefined(sheet) || isNull(row) || isNull(anchor())) return

      // A provisional place off the anchor areas, so the sheet lays out at its own height before it is measured.
      placed.value = { 'position': 'fixed', 'margin': '0', 'inset': 'auto', 'top': '0px', 'left': '0px', 'position-anchor': context.anchorName }

      await nextTick()

      if (!context.isOpen.value) return

      // A sheet taller than the room scrolls so the selected row sits in its middle (Vuetify 1.5, menu-position.js:15-23).
      const top = offset(row, sheet)
      const limit = sheet.scrollHeight - sheet.clientHeight

      sheet.scrollTop = clamp(top - sheet.clientHeight / 2 + row.offsetHeight / 2, 0, Math.max(0, limit))
      center = top - sheet.scrollTop + row.offsetHeight / 2

      place()
    }

    watch([context.isOpen, context.contentEl, context.anchorEl], ([isOpen]) => {
      if (IN_BROWSER && isOpen) open()
    }, { immediate: true, flush: 'post' })

    function onMove (event: Event) {
      if (!context.isOpen.value || isNull(placed.value) || isNull(center)) return

      const sheet = context.contentEl.value

      // The sheet's own scroll is the reader moving through it, not the emitter moving.
      if (event.target instanceof Node && sheet?.contains(event.target)) return

      place()
    }

    if (IN_BROWSER) {
      useEventListener(window, 'resize', onMove, { passive: true })
      useEventListener(window, 'scroll', onMove, { capture: true, passive: true })
    }

    return toRef(() => placed.value ?? base.value)
  }
}

/**
 * Wraps the adapter in effect for this subtree (the app's `createPopoverPlugin`
 * adapter, or none) so the popovers below place the selected row over their
 * emitter. Call during a component's setup.
 */
export function provideOver (options: Md1OverOptions): Md1OverAdapter {
  const adapter = createOver(options)

  provideOuter({ adapter })

  return adapter
}

/** The same adapter for a v0 part that takes one as a prop (`Select.Root`). Call during a component's setup. */
export function createOver (options: Md1OverOptions): Md1OverAdapter {
  return new Md1OverAdapter(options, useOuter()?.adapter)
}
