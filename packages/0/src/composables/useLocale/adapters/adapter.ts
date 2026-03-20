// Types
import type { TokenContext, TokenTicket } from '#v0/composables/createTokens'
import type { ID } from '#v0/types'
import type { Ref } from 'vue'

export interface LocaleAdapterContext {
  tokens: TokenContext<TokenTicket>
  selectedId: Ref<ID | null | undefined>
  fallbackLocale: ID | undefined
  has: (id: ID) => boolean
}

export interface LocaleAdapter {
  t: (key: string, ...params: unknown[]) => string
  n: (value: number) => string
}
