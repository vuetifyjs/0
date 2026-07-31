import { ref } from 'vue'

export interface Tab {
  id: string
  label: string
  rows: number
}

export const tabs: Tab[] = [
  { id: 'overview', label: 'Overview', rows: 6 },
  { id: 'analytics', label: 'Analytics', rows: 40 },
  { id: 'settings', label: 'Settings', rows: 12 },
]

const mounts = ref<Record<string, number>>({})

export function useMounts () {
  function track (id: string) {
    mounts.value[id] = (mounts.value[id] ?? 0) + 1
  }

  return { mounts, track }
}
