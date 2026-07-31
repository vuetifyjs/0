// apps/builder/src/plugins/locale/defaults.ts

// LocaleOptions in packages/0/src/composables/useLocale is exactly
// { adapter?, default?, fallback?, messages? } — there is no `locales` list, and the only
// shipped adapter is the built-in one (VueI18nLocaleAdapter is not publicly exported), so
// omitting `adapter` entirely is what selects the default. The registered languages are the
// keys of `messages`.
export interface LocaleConfig {
  default: string
  fallback: string
  messages: Record<string, Record<string, unknown>>
  persist: boolean
}

export const defaultConfig: LocaleConfig = {
  default: 'en',
  fallback: 'en',
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
    fr: {
      $rules: { required: 'Ce champ est requis' },
      hello: 'Bonjour',
    },
  },
  null,
  2,
)
