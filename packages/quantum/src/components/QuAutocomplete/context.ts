// Framework
import { createContext, isNull, useLogger } from '@vuetify/v0'

// Types
import type { Ref } from 'vue'

export interface QuAutocompleteContext {
  /** The v0 Combobox namespace the parts join. */
  namespace: Readonly<Ref<string>>
  /** The condensed field: 40 dp rows at 14 sp in the list. */
  dense: Readonly<Ref<boolean>>
  /** A value's text: `displayValue`, or the value itself. */
  display: (value: unknown) => string
}

/**
 * Lives beside the parts rather than in `QuAutocomplete.vue`: the root imports
 * its in-line completion part, which reads this context, so the parts cannot
 * import the root back.
 */
export const [useQuAutocomplete, provideQuAutocomplete] = createContext<QuAutocompleteContext | null>('quantum:autocomplete', null)

/** Dev warning for a part rendered outside QuAutocomplete: the part renders nothing. */
export function orphan (part: string, context: QuAutocompleteContext | null): void {
  if (__DEV__ && isNull(context)) useLogger().warn(`[${part}] rendered outside <QuAutocomplete>; it renders nothing`)
}
