import { isString } from '@vuetify/v0'

import type { CalendarMode, CalendarValue } from '@vuetify/v0'

export type CalendarMark = 'start' | 'end' | 'between' | 'day'

export function day (date: number) {
  const today = new Date()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const value = String(date).padStart(2, '0')

  return `${today.getFullYear()}-${month}-${value}`
}

export function caption (current: CalendarValue, mode: CalendarMode) {
  if (isString(current)) return current
  if (!current || !isString(current.start)) return mode === 'range' ? 'No range' : 'No day'
  if (!isString(current.end)) return current.start

  return `${current.start} to ${current.end}`
}

export function mark (current: CalendarValue, iso: string): CalendarMark | undefined {
  if (isString(current)) return iso === current ? 'day' : undefined
  if (!current || !isString(current.start)) return undefined
  if (!isString(current.end) || current.start === current.end) {
    return iso === current.start ? 'day' : undefined
  }

  const [low, high] = [current.start, current.end].toSorted()

  if (iso === low) return 'start'
  if (iso === high) return 'end'
  if (iso > low && iso < high) return 'between'

  return undefined
}
