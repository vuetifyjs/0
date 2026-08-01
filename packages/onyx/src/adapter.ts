// Framework
import { V0StyleSheetThemeAdapter } from '@vuetify/v0'

// Emitters
import { themes } from './colors'
import { block, contrastMore, foundations } from './css'

// Types
import type { Colors } from '@vuetify/v0'

export interface OnyxAdapterOptions {
  cspNonce?: string
  stylesheetId?: string
  prefix?: string
}

// mirrors v0 ThemeAdapter.SAFE_IDENT (packages/0/src/composables/useTheme/adapters/adapter.ts)
const SAFE_IDENT = /^[a-zA-Z0-9_-]+$/

export class OnyxStyleSheetAdapter extends V0StyleSheetThemeAdapter {
  constructor (options: OnyxAdapterOptions = {}) {
    super({ prefix: 'onyx', stylesheetId: 'onyx-theme-stylesheet', ...options })
  }

  override generate (colors: Record<string, Colors>, _isDark?: boolean): string {
    let css = foundations()

    for (const name in colors) {
      if (!SAFE_IDENT.test(name)) continue

      const themeColors = colors[name]
      if (!themeColors) continue

      const dark = (themes as Record<string, { dark?: boolean }>)[name]?.dark ?? name.endsWith('-dark')
      css += block(`[data-theme="${name}"]`, themeColors, dark)
    }

    css += contrastMore()

    return css
  }
}
