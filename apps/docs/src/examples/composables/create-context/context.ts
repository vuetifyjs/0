import { createContext } from '@vuetify/v0'
import type { ShallowReactive } from 'vue'

export interface Notification {
  id: number
  title: string
  description?: string
  type: 'info' | 'success' | 'warning' | 'error'
}

export interface NotificationContext {
  notifications: ShallowReactive<Notification[]>
  notify: (
    title: string,
    description?: string,
    type?: Notification['type'],
  ) => void
  dismiss: (id: number) => void
  clear: () => void
}

export const [
  useNotifications,
  provideNotifications,
] = createContext<NotificationContext>('v0:notifications')
