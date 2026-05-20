// apps/builder/src/plugins/notifications/defaults.ts

export type NotificationsAdapter =
  | 'none'
  | 'KnockNotificationsAdapter'
  | 'NovuNotificationsAdapter'

export interface NotificationsConfig {
  timeout: number
  namespace: string
  adapter: NotificationsAdapter
}

export const NOTIFICATIONS_ADAPTERS: NotificationsAdapter[] = [
  'none',
  'KnockNotificationsAdapter',
  'NovuNotificationsAdapter',
]

export const defaultConfig: NotificationsConfig = {
  timeout: 3000,
  namespace: 'v0:notifications',
  adapter: 'none',
}
