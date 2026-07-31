import { EmeraldStyleSheetAdapter, emeraldColors } from '@paper/emerald'

// Framework
import { IN_BROWSER } from '@vuetify/v0'

let installed = false

/** One-shot Emerald token install for showcase pages (idempotent). */
export function installEmeraldTheme () {
  if (!IN_BROWSER || installed) return
  const adapter = new EmeraldStyleSheetAdapter()
  adapter.upsert(adapter.generate({ emerald: emeraldColors }, false))
  document.documentElement.dataset.theme = 'emerald'
  installed = true
}
