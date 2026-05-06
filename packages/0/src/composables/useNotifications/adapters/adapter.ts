/**
 * @module NotificationsAdapter
 *
 * @remarks
 * Abstract base class for notifications adapters.
 * Adapters receive a {@link NotificationsAdapterContext} on setup
 * and optionally clean up on dispose.
 *
 * @example
 * ```ts
 * import { NotificationsAdapter } from '@vuetify/v0/notifications'
 * import type { NotificationsAdapterContext } from '@vuetify/v0'
 *
 * class MyAdapter extends NotificationsAdapter {
 *   setup (context: NotificationsAdapterContext) {
 *     myBackend.onMessage(msg => {
 *       context.send({ id: msg.id, subject: msg.title, body: msg.body })
 *     })
 *   }
 *
 *   dispose () {
 *     myBackend.disconnect()
 *   }
 * }
 * ```
 */

// Types
import type { NotificationInput, NotificationsAdapterContext, NotificationTicket } from '../index'

export abstract class NotificationsAdapter<
  Z extends NotificationInput = NotificationInput,
  E extends NotificationTicket<Z> = NotificationTicket<Z>,
> {
  /** Called once when the plugin installs. Wire inbound/outbound sync here. */
  abstract setup (context: NotificationsAdapterContext<Z, E>): void
  /** Called on app unmount. Tear down listeners and connections. */
  dispose? (): void
}
