// Framework
import { createContext } from '@vuetify/v0'

// Types
import type { CalendarUnit } from './calendar'
import type { EmCalendarDate, EmCalendarWeekday } from './date'
import type { Ref } from 'vue'

/** Re-exported so `EmCalendarContext['move']` is nameable without the core. */
export type { CalendarUnit } from './calendar'

export type EmCalendarTone = 'neutral' | 'primary' | 'secondary' | 'info' | 'alert' | 'danger'

export interface EmCalendarEvent {
  /** ISO `YYYY-MM-DD`, or a `Date` normalized to one. */
  date: string | Date
  title: string
  /** Timed events trail their clock time; all-day ones read as a filled bar. */
  time?: string
  allDay?: boolean
  tone?: EmCalendarTone
}

export interface EmCalendarCell {
  date: Date
  iso: string
  day: number
  inMonth: boolean
  today: boolean
}

/** Seam shared by the root, its header shells, and the self-rendering grid and mini. */
export interface EmCalendarContext {
  /** First of the visible month. */
  cursor: Readonly<Ref<Date>>
  /** The 42-cell month matrix, weeks flowing left to right. */
  cells: Readonly<Ref<EmCalendarCell[]>>
  weekdays: Readonly<Ref<EmCalendarWeekday[]>>
  label: Readonly<Ref<string>>
  disabled: Readonly<Ref<boolean>>
  /** Id stamped on `EmCalendarTitle`, so the grid can name itself after it. */
  title: string
  date: EmCalendarDate
  events: (iso: string) => EmCalendarEvent[]
  selected: (iso: string) => boolean
  select: (iso: string) => void
  prev: () => void
  next: () => void
  today: () => void
  /** Move the cursor by whole months. */
  step: (amount: number) => void
  /** The day keyboard navigation walks; drives the grid's roving tabindex. */
  focused: Ref<string>
  /** Walk `focused`, paging the cursor when it leaves the visible month. */
  move: (unit: CalendarUnit, amount: number) => void
}

export const EM_CALENDAR_NAMESPACE = 'emerald:calendar'

export const [useEmCalendarContext, provideEmCalendarContext] = createContext<EmCalendarContext>()
