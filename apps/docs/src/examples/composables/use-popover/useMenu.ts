import { usePopover } from '@vuetify/v0'
import { shallowRef } from 'vue'

export interface MenuItem {
  id: string
  label: string
  danger?: boolean
}

const items: MenuItem[] = [
  { id: 'profile', label: 'View profile' },
  { id: 'settings', label: 'Account settings' },
  { id: 'billing', label: 'Billing and plans' },
  { id: 'signout', label: 'Sign out', danger: true },
]

export function useMenu () {
  const popover = usePopover({
    positionArea: 'bottom',
    positionTry: 'flip-block',
  })

  const selected = shallowRef<MenuItem>()

  function select (item: MenuItem) {
    selected.value = item
    popover.close()
  }

  return { ...popover, items, selected, select }
}

export type Menu = ReturnType<typeof useMenu>
