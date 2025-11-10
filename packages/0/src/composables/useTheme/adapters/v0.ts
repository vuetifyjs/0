// Adapters
import { ThemeAdapter } from './adapter'

// Utilities
import { watch, onScopeDispose } from 'vue'
import { isNull, isString } from '#v0/utilities'

// Globals
import { IN_BROWSER } from '#v0/constants/globals'

// Types
import type { App } from 'vue'
import type { ThemeAdapterSetupContext } from './adapter'
import type { Colors } from '../index'
import type { ID } from '#v0/types'

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
      const stopWatch = watch(context.colors, colors => {
        this.update(colors)
      }, { immediate: true })

      onScopeDispose(stopWatch, true)

      if (isNull(target)) return

      const targetEl = target instanceof HTMLElement
        ? target
        : (isString(target)
            ? document.querySelector(target)
            : (app._container as HTMLElement | undefined) || document.querySelector('#app') || document.body)

      if (!targetEl) return

      let prevClass = ''

      const stopClass = watch(context.selectedId, id => {
        if (!id) return

        const themeClass = `${this.prefix}-theme--${id}`
        if (prevClass) targetEl.classList.remove(prevClass)
        targetEl.classList.add(themeClass)
        prevClass = themeClass
      }, { immediate: true })

      onScopeDispose(stopClass, true)
    } else {
      const head = app._context?.provides?.usehead ?? app._context?.provides?.head
      if (head?.push) {
        const id = context.selectedId.value
        head.push({
          htmlAttrs: { class: id ? `${this.prefix}-theme--${id}` : '' },
          style: [{
            innerHTML: this.generate(context.colors.value),
            id: this.stylesheetId,
          }],
        })
      }
    }
  }

  update (colors: Record<ID, Colors>): void {
    if (!IN_BROWSER) return

    this.upsert(this.generate(colors))
  }

  upsert (styles: string): void {
    if (!IN_BROWSER) return

    let styleEl = document.querySelector(`#${this.stylesheetId}`) as HTMLStyleElement | null

    if (!styleEl) {
      styleEl = document.createElement('style')
      styleEl.id = this.stylesheetId.startsWith('#') ? this.stylesheetId.slice(1) : this.stylesheetId

      if (this.cspNonce) styleEl.setAttribute('nonce', this.cspNonce)

      document.head.append(styleEl)
    }

    styleEl.textContent = styles
  }
}
