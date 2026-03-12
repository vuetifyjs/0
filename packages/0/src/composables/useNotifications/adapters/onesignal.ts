/**
 * @module OneSignalNotificationsAdapter
 *
 * @remarks
 * OneSignal adapter for useNotifications.
 * Push-only (inbound): maps foreground notification events to ctx.notify().
 * Does not sync outbound state back to OneSignal.
 *
 * @example
 * ```ts
 * import OneSignal from '@onesignal/web-sdk'
 * import { createOneSignalAdapter } from '#v0/composables/useNotifications/adapters/onesignal'
 *
 * app.use(createNotificationsPlugin({
 *   adapter: createOneSignalAdapter(OneSignal),
 * }))
 * ```
 */

// Types
import type { NotificationsAdapterInterface, NotificationInput } from '../index'

/**
 * Minimal subset of the OneSignal Web SDK used by this adapter.
 * Consumers pass their own OneSignal instance; we only depend on
 * the Notifications namespace for type safety.
 */
export interface OneSignalNotificationEvent {
  readonly notification: {
    title?: string
    body?: string
    additionalData?: Record<string, unknown>
    notificationId?: string
  }
  preventDefault: () => void
}

export interface OneSignalInstance {
  Notifications: {
    addEventListener: (
      event: 'foregroundWillDisplay',
      listener: (event: OneSignalNotificationEvent) => void,
    ) => void
    removeEventListener: (
      event: 'foregroundWillDisplay',
      listener: (event: OneSignalNotificationEvent) => void,
    ) => void
  }
}

export interface OneSignalAdapterOptions {
  /**
   * Transform the raw OneSignal event into a NotificationInput.
   * When provided, completely replaces the default mapping.
   */
  transform?: (event: OneSignalNotificationEvent) => NotificationInput
  /**
   * When true, calls `event.preventDefault()` to suppress
   * OneSignal's native notification display. Defaults to false.
   */
  suppress?: boolean
}

export function createOneSignalAdapter (
  onesignal: OneSignalInstance,
  options: OneSignalAdapterOptions = {},
): NotificationsAdapterInterface {
  const { transform, suppress = false } = options
  let listener: ((event: OneSignalNotificationEvent) => void) | undefined

  return {
    setup (ctx) {
      listener = (event: OneSignalNotificationEvent) => {
        if (suppress) {
          event.preventDefault()
        }

        const input = transform
          ? transform(event)
          : {
            id: event.notification.notificationId,
            subject: event.notification.title,
            body: event.notification.body,
            data: event.notification.additionalData,
          } satisfies NotificationInput

        ctx.notify(input)
      }

      onesignal.Notifications.addEventListener('foregroundWillDisplay', listener)
    },
    dispose () {
      if (listener) {
        onesignal.Notifications.removeEventListener('foregroundWillDisplay', listener)
      }
    },
  }
}
