/**
 * @module OneSignalNotificationsAdapter
 *
 * @remarks
 * OneSignal adapter for createNotifications.
 * Push-only (inbound): maps foreground notification events to ctx.notify().
 * Does not sync outbound state back to OneSignal.
 *
 * @example
 * ```ts
 * import OneSignal from 'react-onesignal' // or window.OneSignalDeferred
 * import { createNotifications } from '#v0/composables/createNotifications'
 * import { createOneSignalAdapter } from '#v0/composables/createNotifications/adapters/onesignal'
 *
 * const notifications = createNotifications({
 *   adapter: createOneSignalAdapter(OneSignal),
 * })
 * ```
 */

// Types
import type { NotificationsAdapter, NotificationInput } from '..'

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
): NotificationsAdapter {
  const { transform, suppress = false } = options

  return ctx => {
    function onForeground (event: OneSignalNotificationEvent) {
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

    onesignal.Notifications.addEventListener('foregroundWillDisplay', onForeground)

    return () => {
      onesignal.Notifications.removeEventListener('foregroundWillDisplay', onForeground)
    }
  }
}
