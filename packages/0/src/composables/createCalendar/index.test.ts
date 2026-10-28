import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// Adapters
import { PlainDateAdapter } from '#v0/composables/useDate/adapters/plain'

import { createCalendar } from './index'

// Utilities
import { effectScope, nextTick, shallowRef } from 'vue'

// Types
import type { CalendarCell, CalendarContext, CalendarOptions } from './index'

describe('createCalendar', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 7, 4, 12, 0, 0))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  function setup (options: CalendarOptions = {}) {
    let calendar: CalendarContext | undefined
    const scope = effectScope()

    scope.run(() => {
      calendar = createCalendar(options)
    })

    return {
      calendar: calendar!,
      stop: () => scope.stop(),
    }
  }

  function cell (calendar: CalendarContext, iso: string): CalendarCell {
    const found = calendar.month.value.weeks.flat().find(item => item.iso === iso)

    expect(found).toBeDefined()

    return found!
  }

  describe('grid', () => {
    it('should return one month object', () => {
      const { calendar, stop } = setup({ month: '2026-02', firstDayOfWeek: 0 })

      expect(Array.isArray(calendar.month.value)).toBe(false)
      expect(calendar.month.value.anchor).toBe('2026-02')

      stop()
    })

    it('should render four Sunday-start rows for February 2026', () => {
      const { calendar, stop } = setup({ month: '2026-02', firstDayOfWeek: 0 })

      expect(calendar.month.value.weeks).toHaveLength(4)
      expect(calendar.month.value.weeks[0]![0]!.iso).toBe('2026-02-01')
      expect(calendar.month.value.weeks[0]![0]!.outside).toBe(false)

      stop()
    })

    it('should pad to six rows when fixedWeeks is set', () => {
      const { calendar, stop } = setup({ month: '2026-02', firstDayOfWeek: 0, fixedWeeks: true })

      expect(calendar.month.value.weeks).toHaveLength(6)

      stop()
    })

    it('should rotate a Monday start without writing the adapter', () => {
      const adapter = new PlainDateAdapter('en-US')
      const weeks = vi.spyOn(adapter, 'getWeekArray')
      const { calendar, stop } = setup({
        adapter,
        month: '2026-02',
        firstDayOfWeek: 1,
      })

      expect(adapter.firstDayOfWeek).toBe(0)
      expect(weeks).not.toHaveBeenCalled()
      expect(calendar.month.value.weeks).toHaveLength(5)
      expect(calendar.month.value.weeks[0]![0]!.iso).toBe('2026-01-26')
      expect(calendar.month.value.weeks[0]![0]!.outside).toBe(true)

      stop()
    })

    it('should build weekday labels from the calendar first day', () => {
      const sunday = setup({ month: '2026-02', firstDayOfWeek: 0, locale: 'en-US' })
      const monday = setup({ month: '2026-02', firstDayOfWeek: 1, locale: 'en-US' })

      expect(sunday.calendar.weekdays.value).toHaveLength(7)
      expect(sunday.calendar.weekdays.value[0]).not.toBe(monday.calendar.weekdays.value[0])

      sunday.stop()
      monday.stop()
    })
  })

  describe('selection', () => {
    it('should select a day and clear it on the second click', () => {
      const { calendar, stop } = setup({ month: '2026-02', firstDayOfWeek: 0 })

      calendar.select('2026-02-10')

      expect(calendar.value.value).toBe('2026-02-10')
      expect(cell(calendar, '2026-02-10').selected).toBe(true)

      calendar.select('2026-02-10')

      expect(calendar.value.value).toBeUndefined()

      stop()
    })

    it('should keep the day when preventDeselect is set', () => {
      const { calendar, stop } = setup({
        month: '2026-02',
        firstDayOfWeek: 0,
        preventDeselect: true,
      })

      calendar.select('2026-02-10')
      calendar.select('2026-02-10')

      expect(calendar.value.value).toBe('2026-02-10')

      stop()
    })

    it('should write a ref and leave a getter alone', () => {
      const model = shallowRef<string | undefined>('2026-02-03')
      const external = '2026-02-03'
      const controlled = setup({ month: '2026-02', value: model })
      const derived = setup({ month: '2026-02', value: () => external })

      controlled.calendar.select('2026-02-11')
      derived.calendar.select('2026-02-11')

      expect(model.value).toBe('2026-02-11')
      expect(external).toBe('2026-02-03')
      expect(derived.calendar.value.value).toBe('2026-02-11')

      controlled.stop()
      derived.stop()
    })

    it('should build a range, restart before the start, and open a new range after both ends', () => {
      const { calendar, stop } = setup({ month: '2026-08', mode: 'range' })

      calendar.select('2026-08-10')

      expect(calendar.value.value).toEqual({ start: '2026-08-10', end: undefined })

      calendar.select('2026-08-04')

      expect(calendar.value.value).toEqual({ start: '2026-08-04', end: undefined })

      calendar.select('2026-08-12')

      expect(calendar.value.value).toEqual({ start: '2026-08-04', end: '2026-08-12' })
      expect(cell(calendar, '2026-08-08').selected).toBe(true)

      calendar.select('2026-08-20')

      expect(calendar.value.value).toEqual({ start: '2026-08-20', end: undefined })

      stop()
    })

    it('should refuse outside, disabled, and unavailable days', () => {
      const { calendar, stop } = setup({
        month: '2026-02',
        firstDayOfWeek: 1,
        min: '2026-02-10',
        unavailable: (iso: string) => iso === '2026-02-12',
      })

      const early = cell(calendar, '2026-02-09')
      const booked = cell(calendar, '2026-02-12')

      expect(early.disabled).toBe(true)
      expect(early.unavailable).toBe(false)
      expect(booked.disabled).toBe(false)
      expect(booked.unavailable).toBe(true)

      calendar.select('2026-01-26')
      calendar.select('2026-02-09')
      calendar.select('2026-02-12')

      expect(calendar.value.value).toBeUndefined()

      calendar.select('2026-02-13')

      expect(calendar.value.value).toBe('2026-02-13')

      stop()
    })

    it('should mark a day both disabled and unavailable', () => {
      const { calendar, stop } = setup({
        month: '2026-02',
        firstDayOfWeek: 0,
        min: '2026-02-10',
        unavailable: (iso: string) => iso === '2026-02-05',
      })
      const day = cell(calendar, '2026-02-05')

      expect(day.disabled).toBe(true)
      expect(day.unavailable).toBe(true)

      stop()
    })

    it('should ignore select when readonly and still page', () => {
      const { calendar, stop } = setup({ month: '2026-08', readonly: true })

      expect(cell(calendar, '2026-08-12').disabled).toBe(false)

      calendar.select('2026-08-12')
      calendar.next()

      expect(calendar.value.value).toBeUndefined()
      expect(calendar.anchor.value).toBe('2026-09')

      stop()
    })
  })

  describe('navigation', () => {
    it('should clamp the visible month when min moves past it', async () => {
      const min = shallowRef<string | undefined>(undefined)
      const { calendar, stop } = setup({ month: '2026-02', min, firstDayOfWeek: 0 })

      expect(calendar.anchor.value).toBe('2026-02')

      min.value = '2026-06-15'
      await nextTick()

      expect(calendar.anchor.value).toBe('2026-06')
      expect(calendar.focused.value >= '2026-06-15').toBe(true)

      stop()
    })

    it('should pull focus when a wall moves inside the month', async () => {
      const min = shallowRef<string | undefined>(undefined)
      const { calendar, stop } = setup({ month: '2026-08', min })

      calendar.goto('2026-08-04')
      min.value = '2026-08-10'
      await nextTick()

      expect(calendar.anchor.value).toBe('2026-08')
      expect(calendar.focused.value).toBe('2026-08-10')

      stop()
    })

    it('should let focus land on a disabled day and refuse selection', () => {
      const { calendar, stop } = setup({ month: '2026-08', disabled: true })
      const before = calendar.focused.value

      calendar.move('day', 1)

      expect(calendar.focused.value).not.toBe(before)
      expect(cell(calendar, calendar.focused.value).disabled).toBe(true)

      calendar.select(calendar.focused.value)

      expect(calendar.value.value).toBeUndefined()
      expect(calendar.anchor.value).toBe('2026-08')

      calendar.next()

      expect(calendar.anchor.value).toBe('2026-09')

      stop()
    })

    it('should page to today without selecting, then selectToday when allowed', () => {
      const { calendar, stop } = setup({ month: '2026-02' })

      calendar.today()

      expect(calendar.anchor.value).toBe('2026-08')
      expect(calendar.focused.value).toBe('2026-08-04')
      expect(calendar.value.value).toBeUndefined()

      calendar.selectToday()

      expect(calendar.value.value).toBe('2026-08-04')

      stop()
    })

    it('should refuse selectToday when today is outside min', () => {
      const { calendar, stop } = setup({ month: '2026-02', min: '2026-08-10' })

      calendar.selectToday()

      expect(calendar.value.value).toBeUndefined()
      expect(calendar.focused.value).toBe('2026-08-10')

      stop()
    })

    it('should write a month ref when paging', () => {
      const month = shallowRef('2026-02')
      const { calendar, stop } = setup({ month, firstDayOfWeek: 0 })

      calendar.next()

      expect(month.value).toBe('2026-03')
      expect(calendar.anchor.value).toBe('2026-03')

      stop()
    })
  })

  describe('timer', () => {
    it('should not schedule a midnight timer outside a scope', () => {
      const pending = vi.getTimerCount()

      createCalendar({ month: '2026-02' })

      expect(vi.getTimerCount()).toBe(pending)
    })

    it('should schedule a midnight timer inside a scope', () => {
      const pending = vi.getTimerCount()
      const { stop } = setup({ month: '2026-02' })

      expect(vi.getTimerCount()).toBeGreaterThan(pending)

      stop()
    })
  })
})
