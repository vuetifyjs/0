/**
 * @module useTheme/adapters/unhead
 */

// Globals
import { IN_BROWSER } from '#v0/constants/globals'

import { ThemeAdapter } from './adapter'

// Utilities
import { isNull, isString } from '#v0/utilities'
import { watch } from 'vue'

// Types
import type { ID } from '#v0/types'
import type { Colors } from '../index'
import type { ThemeAdapterSetupContext } from './adapter'
import type { App } from 'vue'

// Structural @unhead seam — duck-typed so v0 takes no dependency on @unhead types.
interface ThemeHeadInput {
  htmlAttrs?: { 'data-theme': string }
  style?: Array<{ innerHTML: string, id: string, nonce?: string }>
}

interface HeadEntry {
  dispose?: () => void
  patch?: (input: ThemeHeadInput) => void
}

interface Head {
  push: (input: ThemeHeadInput) => HeadEntry
}

export interface V0UnheadThemeOptions {
  cspNonce?: string
  stylesheetId?: string
  prefix?: string
}

/**
 * Theme adapter that manages CSS custom properties via @unhead.
 * Best for SSR/SSG — the same <style> tag is rendered on the server
 * and patched on the client, eliminating hydration flash.
 *
 * Requires @unhead/vue to be installed in the app.
 */
export class V0UnheadThemeAdapter extends ThemeAdapter {
  private entry?: HeadEntry
  private cspNonce?: string

  constructor (options: V0UnheadThemeOptions = {}) {
    super(options.prefix ?? 'v0')
    this.cspNonce = options.cspNonce
    this.stylesheetId = options.stylesheetId ?? this.stylesheetId
  }

  setup <T extends ThemeAdapterSetupContext>(
    app: App,
    context: T,
    target?: string | HTMLElement | null,
  ): void {
    const head = (app._context?.provides?.usehead ?? app._context?.provides?.head) as Head | undefined

    if (head?.push) {
      const id = context.selectedId.value
      this.entry = head.push({
        htmlAttrs: {
          'data-theme': id ? String(id) : '',
        },
        style: [{
          innerHTML: this.generate(context.colors.value, context.isDark.value),
          id: this.stylesheetId,
          ...(this.cspNonce ? { nonce: this.cspNonce } : {}),
        }],
      })
    }

    if (IN_BROWSER) {
      let targetEl: HTMLElement | null = null

      if (!isNull(target)) {
        targetEl = target instanceof HTMLElement
          ? target
          : (isString(target)
              ? document.querySelector(target) as HTMLElement | null
              : (app._container as HTMLElement | undefined) || document.querySelector('#app') as HTMLElement | null || document.body)
      }

      if (targetEl && context.selectedId.value) {
        targetEl.dataset.theme = String(context.selectedId.value)
      }

      // Single watcher for both style and htmlAttrs — unhead's entry.patch()
      // replaces the entire input, so separate patches would clobber each other.
      // Skip redundant data-theme writes to avoid DOM thrash during hydration.
      const stopWatch = watch(
        [context.colors, context.isDark, context.selectedId],
        ([colors, isDark, id]) => {
          const themeStr = id ? String(id) : ''
          if (targetEl && themeStr && targetEl.dataset.theme !== themeStr) {
            targetEl.dataset.theme = themeStr
          }

          this.entry?.patch?.({
            htmlAttrs: { 'data-theme': themeStr },
            style: [{
              innerHTML: this.generate(colors, isDark),
              id: this.stylesheetId,
              ...(this.cspNonce ? { nonce: this.cspNonce } : {}),
            }],
          })
        },
      )

      this.dispose = () => {
        stopWatch()
        this.entry?.dispose?.()
      }
    } else {
      this.dispose = () => this.entry?.dispose?.()
    }
  }

  update (
    colors: Record<ID, Colors>,
    isDark?: boolean,
  ): void {
    if (!this.entry) return

    this.entry.patch?.({
      style: [{
        innerHTML: this.generate(colors, isDark),
        id: this.stylesheetId,
        ...(this.cspNonce ? { nonce: this.cspNonce } : {}),
      }],
    })
  }
}
