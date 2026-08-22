/**
 * Shared dev-time guard for part components.
 *
 * Region parts (BuModalHead, BuMessageHeader, BuDropdownMenu, …) read their
 * state from the parent Bu component's context. Injection is optional so an
 * orphan part still renders its Bulma markup instead of throwing; this warns
 * once at setup so the missing wiring is not silent. Mirrors the BuHelp
 * precedent for an ambient context that never arrived.
 */

// Framework
import { isNull } from '@vuetify/v0'

/** Warn in dev when a part rendered outside the parent that owns its state. */
export function orphan (part: string, parent: string, context: unknown): void {
  if (!__DEV__ || !isNull(context)) return

  console.warn(
    `[${part}] rendered outside <${parent}> — no ${parent} context was found, so the state it`,
    'contributes (open/close wiring, ids, aria) is inert. Nest the part inside its parent exactly',
    'as the Bulma markup nests.',
  )
}
