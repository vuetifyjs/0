// Framework
import { V0StyleSheetThemeAdapter } from '@vuetify/v0'

export interface GenesisAdapterOptions {
  cspNonce?: string
  stylesheetId?: string
  prefix?: string
}

export class GenesisStyleSheetAdapter extends V0StyleSheetThemeAdapter {
  constructor (options: GenesisAdapterOptions = {}) {
    super({ prefix: 'gn', stylesheetId: 'genesis-theme-stylesheet', ...options })
  }
}
