/**
 * Optional host renderer for genesis chrome icons.
 *
 * Not a plugin and not a glyph registry. Hosts call `provideGnIcons` at app
 * install (or in a parent setup) with a `render` function; chrome components
 * fall back to a component-local inline SVG when nothing is provided or
 * `render` returns `null`. Named icon slots still win.
 */

// Framework
import { createContext } from '@vuetify/v0'

// Types
import type { VNode } from 'vue'

export type GnIconRole =
  | 'callout-caution'
  | 'callout-important'
  | 'callout-note'
  | 'callout-tip'
  | 'callout-warning'
  | 'example-bin'
  | 'example-combine'
  | 'example-playground'
  | 'example-reset'
  | 'example-split'
  | 'example-toggle'
  | 'peek'

export interface GnIconsContext {
  /**
   * Draw this genesis chrome role. Return `null` to use the component-local
   * inline SVG (unknown role, version skew, or deliberate miss).
   */
  render: (role: GnIconRole, options?: { size?: number }) => VNode | null
}

export const [useGnIcons, provideGnIcons] = createContext<GnIconsContext | null>(
  'genesis:icons',
  null,
)
