/**
 * Dev-time guard for part components whose parent context is optional.
 *
 * An orphan still renders its Bootstrap markup. The warning fires once at
 * setup so the missing open/close wiring is not silent.
 */

// Framework
import { isNull } from '@vuetify/v0'

/** Warn in dev when a part rendered outside the parent that owns its state. */
export function orphan (part: string, parent: string, context: unknown): void {
  if (!__DEV__ || !isNull(context)) return

  console.warn(
    `[${part}] rendered outside <${parent}> — no ${parent} context was found, so the state it`,
    'contributes (open/close wiring) is inert. Nest the part inside its parent exactly',
    'as the Bootstrap markup nests.',
  )
}
