/**
 * Theme adapter for Bootstrap 6.
 *
 * Bootstrap's stylesheet already defines both modes. `[data-bs-theme=dark]`
 * sets `color-scheme: dark`, and the color variables use `light-dark()`.
 * This adapter sets that attribute. It does not emit `[data-theme]` or
 * `--v0-*`, and it does not ship a stylesheet of its own.
 *
 * A passed color overrides one variable. `primary` writes `--bs-primary-base`,
 * which is the seed `.theme-primary` reads. `blue-500` writes `--bs-blue-500`.
 * One hex does not rebuild the rest of the ramp.
 */

// Framework
import { IN_BROWSER, ThemeAdapter } from '@vuetify/v0'
import { isNull, isString, isUndefined } from '@vuetify/v0/utilities'

// Utilities
import { watch } from 'vue'

// Types
import type { Colors } from '@vuetify/v0'
import type { App, Ref } from 'vue'

export interface BootstrapAdapterOptions {
  cspNonce?: string
}

/**
 * Role names a theme record is likely to use, and the Bootstrap variable
 * that actually feeds `.theme-*`. The bare name `--bs-primary` is not in
 * the pin.
 */
const ROLE_VARIABLE: Record<string, string> = {
  primary: '--bs-primary-base',
  secondary: '--bs-secondary-base',
  success: '--bs-success-base',
  danger: '--bs-danger-base',
  warning: '--bs-warning-base',
  info: '--bs-info-base',
}

interface ThemeSource {
  colors: Ref<Record<string, Colors>>
  selectedId: Ref<unknown>
  isDark: Ref<boolean>
}

interface ThemeHeadInput {
  htmlAttrs: { 'data-bs-theme': 'light' | 'dark' }
  style: Array<{ innerHTML: string, id: string, nonce?: string }>
}

interface HeadEntry {
  dispose?: () => void
  patch?: (input: ThemeHeadInput) => void
}

interface Head {
  push: (input: ThemeHeadInput) => HeadEntry
}

export class BootstrapThemeAdapter extends ThemeAdapter {
  readonly cspNonce?: string
  private selected: unknown = null
  private themes: Record<string, Colors> = {}
  private dark = false
  private target: HTMLElement | null = null
  private written: string[] = []
  private priorAttribute: string | undefined
  private priorValue = new Map<string, string>()
  private bound = false

  constructor (options: BootstrapAdapterOptions = {}) {
    super('bs')
    this.cspNonce = options.cspNonce
    this.stylesheetId = 'bootstrap-theme'
  }

  /**
   * The base generator emits `[data-theme]`. Bootstrap does not read that
   * selector, so this stays empty. `setup` writes `data-bs-theme` instead.
   */
  override generate (): string {
    return ''
  }

  setup (
    app: App,
    context: ThemeSource,
    target?: string | HTMLElement | null,
  ): void {
    const read = () => {
      this.selected = context.selectedId.value
      this.themes = context.colors.value
      this.dark = context.isDark.value
    }

    if (IN_BROWSER) {
      this.target = resolveTarget(app, target)
      read()
      this.update(this.themes, this.dark)

      const stop = watch(
        [context.selectedId, context.colors, context.isDark],
        () => {
          read()
          this.update(this.themes, this.dark)
        },
      )

      this.dispose = () => {
        stop()
        this.restore()
      }
      return
    }

    const head = (app._context?.provides?.usehead ?? app._context?.provides?.head) as Head | undefined
    if (!head?.push) return

    read()
    const entry = head.push(this.headInput())
    const stop = watch(
      [context.selectedId, context.colors, context.isDark],
      () => {
        read()
        entry.patch?.(this.headInput())
      },
    )

    this.dispose = () => {
      stop()
      entry.dispose?.()
    }
  }

  update (colors: Record<string, Colors>, isDark?: boolean): void {
    this.themes = colors
    if (!isUndefined(isDark)) this.dark = isDark
    if (!IN_BROWSER || !this.target) return
    this.applyElement(this.target)
  }

  private headInput (): ThemeHeadInput {
    return {
      htmlAttrs: { 'data-bs-theme': this.mode() },
      style: [{
        innerHTML: rootCss(this.selectedColors()),
        id: this.stylesheetId,
        ...(this.cspNonce ? { nonce: this.cspNonce } : {}),
      }],
    }
  }

  private applyElement (element: HTMLElement): void {
    if (!this.bound) {
      this.priorAttribute = element.dataset.bsTheme
      this.bound = true
    }

    element.dataset.bsTheme = this.mode()

    const next = new Map(declarations(this.selectedColors()))
    const keep = new Set(next.keys())

    for (const name of this.written) {
      if (keep.has(name)) continue
      const prior = this.priorValue.get(name) ?? ''
      if (prior.length > 0) element.style.setProperty(name, prior)
      else element.style.removeProperty(name)
    }

    for (const [name, value] of next) {
      if (!this.priorValue.has(name)) {
        this.priorValue.set(name, element.style.getPropertyValue(name))
      }
      element.style.setProperty(name, value)
    }

    this.written = [...next.keys()]
  }

  private restore (): void {
    const element = this.target
    this.target = null
    this.written = []
    if (!element) return

    if (isUndefined(this.priorAttribute)) delete element.dataset.bsTheme
    else element.dataset.bsTheme = this.priorAttribute

    for (const [name, prior] of this.priorValue) {
      if (prior.length > 0) element.style.setProperty(name, prior)
      else element.style.removeProperty(name)
    }

    this.priorValue.clear()
    this.bound = false
  }

  private mode (): 'light' | 'dark' {
    if (this.selected === 'light' || this.selected === 'dark') return this.selected
    return this.dark ? 'dark' : 'light'
  }

  private selectedColors (): Colors | undefined {
    if (isNull(this.selected) || isUndefined(this.selected)) return undefined
    return this.themes[String(this.selected)]
  }
}

function declarations (colors: Colors | undefined): Array<[string, string]> {
  if (!colors) return []

  const out = new Map<string, string>()

  for (const [key, value] of Object.entries(colors)) {
    const variable = ROLE_VARIABLE[key]
    if (isUndefined(variable)) continue
    assign(out, variable, value)
  }

  for (const [key, value] of Object.entries(colors)) {
    if (!isUndefined(ROLE_VARIABLE[key])) continue
    if (!ThemeAdapter.SAFE_IDENT.test(key)) continue
    assign(out, `--bs-${key}`, value)
  }

  return [...out]
}

function assign (out: Map<string, string>, name: string, value: unknown): void {
  if (!isString(value) || value.length === 0) return
  if (ThemeAdapter.UNSAFE_CSS.test(value)) return
  out.set(name, value)
}

function rootCss (colors: Colors | undefined): string {
  const lines = declarations(colors)
  if (lines.length === 0) return ''
  return `:root {\n${lines.map(([name, value]) => `  ${name}: ${value};`).join('\n')}\n}\n`
}

function resolveTarget (
  app: App,
  target: string | HTMLElement | null | undefined,
): HTMLElement | null {
  if (isNull(target)) return null
  if (target instanceof HTMLElement) return target
  if (isString(target)) {
    const found = document.querySelector(target)
    return found instanceof HTMLElement ? found : null
  }
  const container = app._container as HTMLElement | undefined
  return container ?? document.documentElement
}
