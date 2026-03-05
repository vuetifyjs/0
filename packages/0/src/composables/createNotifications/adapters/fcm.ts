/**
 * @module FcmNotificationsAdapter
 *
 * @remarks
 * Firebase Cloud Messaging adapter for createNotifications.
 * Maps incoming FCM foreground messages to notification tickets
 * via the adapter context's `notify()` method.
 *
 * @example
 * ```ts
 * import { getMessaging } from 'firebase/messaging'
 * import { createFcmAdapter } from '#v0/composables/createNotifications/adapters/fcm'
 *
 * const notifications = createNotifications({
 *   adapter: createFcmAdapter(getMessaging(firebaseApp)),
 * })
 * ```
 */

// Types
import type { NotificationInput, NotificationsAdapter, NotificationSeverity } from '../index'

/** Minimal subset of the FCM MessagePayload we consume. */
export interface FcmMessagePayload {
  messageId?: string
  notification?: {
    title?: string
    body?: string
    image?: string
  }
  data?: Record<string, string>
}

/** Callback returned by Firebase's `onMessage`. */
type Unsubscribe = () => void

/** Minimal interface for the Firebase Messaging instance. */
export interface FcmMessaging {
  onMessage: (handler: (payload: FcmMessagePayload) => void) => Unsubscribe
}

export interface FcmAdapterOptions {
  /** Map an FCM payload to a NotificationInput. Overrides default mapping. */
  transform?: (payload: FcmMessagePayload) => NotificationInput
  /** Default severity when the payload doesn't specify one. */
  severity?: NotificationSeverity
}

function toInput (payload: FcmMessagePayload, severity: NotificationSeverity): NotificationInput {
  const { notification, data, messageId } = payload

  return {
    ...(messageId && { id: messageId }),
    subject: notification?.title,
    body: notification?.body,
    severity: (data?.severity as NotificationSeverity) ?? severity,
    data: data as Record<string, unknown> | undefined,
  }
}

export function createFcmAdapter (
  messaging: FcmMessaging,
  options: FcmAdapterOptions = {},
): NotificationsAdapter {
  const { transform, severity = 'info' } = options

  return ctx => {
    const unsubscribe = messaging.onMessage(payload => {
      const input = transform
        ? transform(payload)
        : toInput(payload, severity)

      ctx.notify(input)
    })

    return unsubscribe
  }
}
