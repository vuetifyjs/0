import { createContext, createNotifications } from '@vuetify/v0'
import type { NotificationsContext, NotificationTicketInput } from '@vuetify/v0'

export type NotificationType = 'banner' | 'toast' | 'inline' | 'inbox'

export interface AppNotificationInput extends NotificationTicketInput {
  data?: { [key: string]: unknown, type?: NotificationType }
}

const [useNotifications, provideNotifications] = createContext<NotificationsContext>('app:notifications')

export { provideNotifications, useNotifications }

export function createAppNotifications () {
  return createNotifications()
}
