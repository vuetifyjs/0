import type { ComboboxContext } from '@vuetify/v0'
import type { InjectionKey } from 'vue'
import { createCombobox } from '@vuetify/v0'
import { toRef } from 'vue'

export const COMBOBOX_KEY: InjectionKey<ComboboxContext> = Symbol('country-combobox')

export interface Country {
  id: string
  value: string
  code: string
  region: string
}

const countries: Country[] = [
  { id: 'us', value: 'United States', code: 'US', region: 'Americas' },
  { id: 'ca', value: 'Canada', code: 'CA', region: 'Americas' },
  { id: 'br', value: 'Brazil', code: 'BR', region: 'Americas' },
  { id: 'gb', value: 'United Kingdom', code: 'GB', region: 'Europe' },
  { id: 'fr', value: 'France', code: 'FR', region: 'Europe' },
  { id: 'de', value: 'Germany', code: 'DE', region: 'Europe' },
  { id: 'es', value: 'Spain', code: 'ES', region: 'Europe' },
  { id: 'ng', value: 'Nigeria', code: 'NG', region: 'Africa' },
  { id: 'za', value: 'South Africa', code: 'ZA', region: 'Africa' },
  { id: 'jp', value: 'Japan', code: 'JP', region: 'Asia' },
  { id: 'in', value: 'India', code: 'IN', region: 'Asia' },
  { id: 'au', value: 'Australia', code: 'AU', region: 'Oceania' },
]

export function useCountrySearch () {
  const combobox = createCombobox()

  for (const country of countries) {
    combobox.selection.register({ id: country.id, value: country.value })
  }

  const selected = toRef(() => {
    const id = combobox.selection.selectedIds.values().next().value
    return id ? countries.find(country => country.id === id) ?? null : null
  })

  return { combobox, countries, selected }
}
