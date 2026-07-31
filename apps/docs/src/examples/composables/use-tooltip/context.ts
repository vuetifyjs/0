import { createContext } from '@vuetify/v0'
import type { Ref } from 'vue'

export interface RegionSettings {
  openDelay: Ref<number>
  closeDelay: Ref<number>
  skipDelay: Ref<number>
  disabled: Ref<boolean>
}

export const [useRegionSettings, provideRegionSettings] =
  createContext<RegionSettings>('demo:tooltip-region')

export interface Tool {
  id: string
  glyph: string
  label: string
  hint: string
}

export const tools: Tool[] = [
  { id: 'bold', glyph: 'B', label: 'Bold', hint: 'Strong emphasis · Ctrl+B' },
  { id: 'italic', glyph: 'I', label: 'Italic', hint: 'Emphasis · Ctrl+I' },
  { id: 'link', glyph: '#', label: 'Link', hint: 'Insert link · Ctrl+K' },
  { id: 'quote', glyph: '"', label: 'Quote', hint: 'Block quote' },
  { id: 'code', glyph: '<>', label: 'Code', hint: 'Inline code · Ctrl+E' },
]
