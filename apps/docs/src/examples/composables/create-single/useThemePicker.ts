import { createSingle } from '@vuetify/v0'
import { toRef } from 'vue'

import type { SingleTicket, SingleTicketInput } from '@vuetify/v0'

export interface Theme {
  name: string
  bg: string
  fg: string
  accent: string
}

export type ThemeInput = SingleTicketInput<Theme>
export type ThemeTicket = SingleTicket<ThemeInput>

const themes: Theme[] = [
  { name: 'Ocean', bg: '#0f172a', fg: '#e2e8f0', accent: '#38bdf8' },
  { name: 'Forest', bg: '#14532d', fg: '#dcfce7', accent: '#4ade80' },
  { name: 'Sunset', bg: '#431407', fg: '#fed7aa', accent: '#fb923c' },
  { name: 'Lavender', bg: '#2e1065', fg: '#e9d5ff', accent: '#a78bfa' },
  { name: 'Slate', bg: '#1e293b', fg: '#cbd5e1', accent: '#94a3b8' },
]

export function useThemePicker () {
  const single = createSingle<ThemeInput, ThemeTicket>({ mandatory: true })

  const tickets = single.onboard(themes.map(theme => ({
    id: theme.name.toLowerCase(),
    value: theme,
  })))

  single.seek('first')?.select()

  const selected = toRef(() => single.selectedValue.value)
  const selectedId = toRef(() => single.selectedId.value)
  const selectedIndex = toRef(() => single.selectedIndex.value)
  const count = toRef(() => single.size)

  return { tickets, selected, selectedId, selectedIndex, count }
}

export type ThemePicker = ReturnType<typeof useThemePicker>
