import { shallowRef } from 'vue'

export const tries = [
  { label: 'Most width, then bottom', value: 'most-width bottom' },
  { label: 'Flip block', value: 'flip-block' },
  { label: 'Flip inline', value: 'flip-inline' },
  { label: 'Flip both', value: 'flip-block flip-inline' },
]

export const subs = [
  { label: 'End, align start', value: 'inline-end span-block-start' },
  { label: 'Start, align start', value: 'inline-start span-block-start' },
  { label: 'Below the item', value: 'block-end' },
  { label: 'Above the item', value: 'block-start' },
]

export function usePlacement () {
  const area = shallowRef('bottom')
  const fallback = shallowRef('most-width bottom')
  const subArea = shallowRef('inline-end span-block-start')
  const hover = shallowRef(false)
  const openDelay = shallowRef(100)
  const closeDelay = shallowRef(250)
  const disabled = shallowRef(false)
  const open = shallowRef<string | null>(null)

  function delay (value: number) {
    return Number.isFinite(value) ? value : 0
  }

  function pick (value: string) {
    area.value = value
    if (disabled.value) return
    // The direction control sits outside the menu, so the click light-dismisses
    // it before this write is visible. Open again on the next turn.
    open.value = 'actions'
    setTimeout(() => {
      if (!disabled.value) open.value = 'actions'
    })
  }

  return {
    area,
    fallback,
    subArea,
    hover,
    openDelay,
    closeDelay,
    disabled,
    open,
    delay,
    pick,
  }
}
