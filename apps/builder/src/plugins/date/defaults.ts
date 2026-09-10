// apps/builder/src/plugins/date/defaults.ts

export type DateAdapterKind = 'V0DateAdapter' | 'custom'

export interface DateConfig {
  adapter: DateAdapterKind
  locale: string
  locales: Record<string, string>
  firstDayOfWeek: number
}

export const DATE_ADAPTERS: DateAdapterKind[] = ['V0DateAdapter', 'custom']

export const defaultConfig: DateConfig = {
  adapter: 'V0DateAdapter',
  locale: 'en',
  locales: {
    en: 'en-US',
    es: 'es-ES',
    fr: 'fr-FR',
    de: 'de-DE',
    it: 'it-IT',
    pt: 'pt-PT',
    ja: 'ja-JP',
    ko: 'ko-KR',
    zh: 'zh-CN',
    ru: 'ru-RU',
    ar: 'ar-SA',
  },
  firstDayOfWeek: 0,
}
