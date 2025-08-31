// Types
import type { ID } from '#v0/types'

export interface LocaleAdapter {
  t: (message: string, ...params: unknown[]) => string
  n: (value: number, locale: ID | undefined, ...params: unknown[]) => string
}
