// Types
import type { Ref } from 'vue'

export type PopoverSide = 'top' | 'bottom' | 'left' | 'right'
export type PopoverAlign = 'start' | 'center' | 'end'

export interface PopoverPlacement {
  /** Which side of the anchor the content prefers to render on. */
  side: PopoverSide
  /** Alignment along that side, relative to the anchor. */
  align: PopoverAlign
  /**
   * The `position-area` value this placement was derived from, verbatim.
   * `side`/`align` are a best-effort normalization of the common cases
   * (single keyword, or a keyword plus a `span-*`/`start`/`end` modifier) -
   * `raw` is the escape hatch for compound values the normalization doesn't
   * cover, and is what the default adapter renders back into CSS.
   */
  raw: string
}

export interface PopoverAdapterContext {
  /** CSS anchor-name custom ident (e.g. `--popover-abc123`). */
  anchorName: string
  /** The activator/reference element, once registered via `attachAnchor()`. */
  anchorEl: Readonly<Ref<Element | null | undefined>>
  /** The content/floating element, once registered via `attach()`. */
  contentEl: Readonly<Ref<HTMLElement | null | undefined>>
  /** Whether the popover is currently open. */
  isOpen: Readonly<Ref<boolean>>
  /** Normalized placement intent, derived from the `positionArea` option. */
  placement: Readonly<Ref<PopoverPlacement>>
  /** The `positionTry` option, verbatim - CSS `position-try-fallbacks` passthrough. */
  positionTry: string
}

/**
 * Positioning engine seam for `usePopover`. `V0PopoverAdapter` (the default)
 * emits CSS anchor positioning and needs nothing installed. A consumer who
 * wants a JS positioning library (floating-ui, Popper, or their own) extends
 * this class and passes an instance via the `adapter` option.
 *
 * @see https://0.vuetifyjs.com/composables/system/use-popover
 */
export abstract class PopoverAdapter {
  /** Optional teardown; read lazily when the popover's scope disposes. */
  dispose?: () => void
  /**
   * Called once, synchronously, during `usePopover()` setup. Returns the
   * reactive style object to spread onto the content element. Implementations
   * that need to react to `isOpen`, `placement`, or the anchor/content
   * elements becoming available should watch `context`'s refs themselves -
   * `anchorEl`/`contentEl` populate asynchronously, after `attachAnchor()` /
   * `attach()` run in the consuming component.
   */
  abstract setup (context: PopoverAdapterContext): Readonly<Ref<Record<string, string>>>
}
