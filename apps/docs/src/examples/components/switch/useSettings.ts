import { ref, shallowRef } from 'vue'

export interface Setting {
  id: string
  label: string
  description: string
}

export interface SavedSettings {
  enabled: string[]
}

export function useSettings () {
  const settings: Setting[] = [
    { id: 'email', label: 'Email notifications', description: 'Order receipts, password resets, and account alerts.' },
    { id: 'push', label: 'Push notifications', description: 'Real-time updates delivered to this device.' },
    { id: 'sms', label: 'SMS notifications', description: 'Text messages for time-sensitive activity.' },
    { id: 'marketing', label: 'Marketing emails', description: 'Product news, tips, and occasional promotions.' },
  ]

  const enabled = ref<string[]>(['email', 'push'])
  const saved = shallowRef<SavedSettings>()

  function onSubmit (valid: boolean) {
    if (!valid) return

    saved.value = { enabled: [...enabled.value] }
  }

  function reset () {
    enabled.value = ['email', 'push']
    saved.value = undefined
  }

  return { settings, enabled, saved, onSubmit, reset }
}
