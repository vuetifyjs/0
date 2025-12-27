// Globals
import { IN_BROWSER } from '#v0/constants/globals'

// Utilities
import { isNull, isString } from '#v0/utilities'
import { onScopeDispose, watch } from 'vue'

// Types
import type { ID } from '#v0/types'
import type { Colors } from '../index'
import type { ThemeAdapterSetupContext } from './adapter'
import type { App } from 'vue'

import { ThemeAdapter } from './adapter'

export interface Vuetify0ThemeOptions {
  cspNonce?: string
  stylesheetId?: string
  prefix?: string
}

/**
 * Theme adapter implementation for Vuetify v0 design system.
 * This adapter generates CSS custom properties and injects them into the DOM
 * as a stylesheet, allowing themes to be applied globally.
 */
export class Vuetify0ThemeAdapter extends ThemeAdapter {
  cspNonce?: string

  constructor (options: Vuetify0ThemeOptions = {}) {
    super(options.prefix ?? 'v0')
    this.cspNonce = options.cspNonce
    this.stylesheetId = options.stylesheetId ?? this.stylesheetId
  }

  setup <T extends ThemeAdapterSetupContext>(
    app: App,
    context: T,
    target?: string | HTMLElement | null,
  ): void {
    if (IN_BROWSER) {
      const stopWatch = watch([context.colors, context.isDark], ([colors, isDark]) => {
        this.update(colors, isDark)
      }, { immediate: true })

      onScopeDispose(stopWatch, true)

      if (isNull(target)) return

      const targetEl = target instanceof HTMLElement
        ? target
        : (isString(target)
            ? document.querySelector(target) as HTMLElement | null
            : (app._container as HTMLElement | undefined) || document.querySelector('#app') as HTMLElement | null || document.body)

      if (!targetEl) return

      const stopTheme = watch(context.selectedId, id => {
        if (!id) return

        targetEl.dataset.theme = String(id)
      }, { immediate: true })

      onScopeDispose(stopTheme, true)
    } else {
      const head = app._context?.provides?.usehead ?? app._context?.provides?.head
      if (head?.push) {
        const id = context.selectedId.value
        head.push({
          htmlAttrs: {
            'data-theme': id ? String(id) : '',
          },
          style: [{
            innerHTML: this.generate(context.colors.value, context.isDark.value),
            id: this.stylesheetId,
          }],
        })
      }
    }
  }

  update (
    colors: Record<ID, Colors>,
    isDark?: boolean,
  ): void {
    if (!IN_BROWSER) return

    this.upsert(this.generate(colors, isDark))
  }

  upsert (styles: string): void {
    if (!IN_BROWSER) return

    const selector = this.stylesheetId.startsWith('#') ? this.stylesheetId : `#${this.stylesheetId}`
    const id = this.stylesheetId.startsWith('#') ? this.stylesheetId.slice(1) : this.stylesheetId
    let styleEl = document.querySelector(selector) as HTMLStyleElement | null

    if (!styleEl) {
      styleEl = document.createElement('style')
      styleEl.id = id

      if (this.cspNonce) styleEl.setAttribute('nonce', this.cspNonce)

      document.head.append(styleEl)
    }

    styleEl.textContent = styles
  }
}
