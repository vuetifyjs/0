/**
 * @module createIcon
 *
 * @remarks
 * Icon token registry for Paper. Design systems register their icon set once
 * (e.g. UnoCSS `i-mdi-*` class names) and Paper's `<PaperIcon>` component
 * resolves alias names to the registered values at render time.
 *
 * @example
 * ```ts
 * // In your design system root component's setup():
 * import { createIconPlugin } from '@vuetify/paper'
 *
 * const { provideIcons } = createIconPlugin({
 *   close: 'i-mdi-close',
 *   menu:  'i-mdi-menu',
 * })
 * provideIcons()
 * ```
 */

import { createTokens, createTokensContext } from '@vuetify/v0'
import type { TokenCollection } from '@vuetify/v0'

export const ICON_NAMESPACE = 'paper:icons'

export const [useIconTokens, provideIconContext] = createTokensContext({
  namespace: ICON_NAMESPACE,
  tokens: {},
})

export interface IconPluginOptions {
  [alias: string]: string
}

export interface IconPlugin {
  /** Call inside a Vue component's setup() to make icons available to descendants */
  provideIcons: () => void
  /** Raw icon alias map */
  icons: IconPluginOptions
}

/**
 * Creates an icon plugin backed by `createTokens` alias resolution.
 *
 * @example
 * ```ts
 * const { provideIcons } = createIconPlugin({
 *   close: 'i-mdi-close',
 *   menu:  'i-mdi-menu',
 * })
 * ```
 */
export function createIconPlugin (icons: IconPluginOptions): IconPlugin {
  const context = createTokens(icons as TokenCollection)
  return {
    icons,
    provideIcons () {
      provideIconContext(context)
    },
  }
}
