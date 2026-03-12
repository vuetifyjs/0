/**
 * @module FcmNotificationsAdapter
 *
 * @remarks
 * Firebase Cloud Messaging adapter for useNotifications.
 * Maps incoming FCM foreground messages to notification tickets
 * via the adapter context's `notify()` method.
 *
 * @example
 * ```ts
 * import { getMessaging } from 'firebase/messaging'
 * import { createFcmAdapter } from '#v0/composables/useNotifications/adapters/fcm'
 *
 * app.use(createNotificationsPlugin({
 *   adapter: createFcmAdapter(getMessaging(firebaseApp)),
 * }))
 * ```
 */

// Types
import type { NotificationInput, NotificationsAdapterInterface, NotificationSeverity } from '../index'

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

const SEVERITIES: Set<string> = new Set(['info', 'warning', 'error', 'success'])

function toInput (payload: FcmMessagePayload, severity: NotificationSeverity): NotificationInput {
  const { notification, data, messageId } = payload
  const raw = data?.severity

  return {
    ...(messageId && { id: messageId }),
    subject: notification?.title,
    body: notification?.body,
    severity: (raw && SEVERITIES.has(raw) ? raw as NotificationSeverity : severity),
    data: data as Record<string, unknown> | undefined,
  }
}

export function createFcmAdapter (
  messaging: FcmMessaging,
  options: FcmAdapterOptions = {},
): NotificationsAdapterInterface {
  const { transform, severity = 'info' } = options
  let unsubscribe: Unsubscribe | undefined

  return {
    setup (ctx) {
      unsubscribe = messaging.onMessage(payload => {
        const input = transform
          ? transform(payload)
          : toInput(payload, severity)

        ctx.notify(input)
      })
    },
    dispose () {
      unsubscribe?.()
    },
  }
}
