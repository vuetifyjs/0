// apps/builder/src/plugins/locale/defaults.ts

export type LocaleAdapterKind = 'built-in' | 'vue-i18n'

export interface LocaleConfig {
  default: string
  fallback: string
  locales: string[]
  adapter: LocaleAdapterKind
  messages: Record<string, Record<string, unknown>>
  persist: boolean
}

export const ADAPTERS: LocaleAdapterKind[] = ['built-in', 'vue-i18n']

export const defaultConfig: LocaleConfig = {
  default: 'en',
  fallback: 'en',
  locales: ['en'],
  adapter: 'built-in',
  messages: {
    en: {
      $rules: {
        required: 'This field is required',
      },
    },
  },
  persist: false,
}

export const SAMPLE_MESSAGES = JSON.stringify(
  {
    en: {
      $rules: { required: 'This field is required' },
      hello: 'Hello',
    },
  },
  null,
  2,
)
