import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// Composables
import { provideContext } from '#v0/composables/createContext'
import { createDateContext } from '#v0/composables/useDate'

// Adapters
import { PlainDateAdapter } from '#v0/composables/useDate/adapters/plain'

import { createCalendar } from './index'

// Utilities
import { mount } from '@vue/test-utils'
import { computed, defineComponent, effectScope, nextTick, shallowRef } from 'vue'

// Types
import type { CalendarCell, CalendarContext, CalendarOptions, CalendarRange, CalendarValue } from './index'

/** `addMonths` overflows the way `Date` does, so 31 January becomes 3 March. */
class OverflowMonthAdapter extends PlainDateAdapter {
  override addMonths (date: Date, amount: number): Date {
    return new Date(
      date.getFullYear(),
      date.getMonth() + amount,
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds(),
      date.getMilliseconds(),
    )
  }
}

/** Next midnight is not ahead of the current instant. */
class FrozenDayAdapter extends PlainDateAdapter {
  override addDays (date: Date, _amount: number): Date {
    return new Date(date)
  }

  override startOfDay (date: Date): Date {
    return new Date(date)
  }
}

/** No current instant. */
class NullDateAdapter extends PlainDateAdapter {
  override date (_value?: unknown): Date | null {
    return null
  }
}

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
      expect(sunday.calendar.label.value).toContain('February')

      sunday.stop()
      monday.stop()
    })

    it('should treat a negative first day as a Saturday start', () => {
      const { calendar, stop } = setup({ month: '2026-02', firstDayOfWeek: -1 })

      expect(calendar.month.value.weeks[0]![0]!.iso).toBe('2026-01-31')

      stop()
    })

    it('should label weekdays from an owned locale and follow a locale ref', async () => {
      const locale = shallowRef('fr-FR')
      const { calendar, stop } = setup({ month: '2026-02', locale, firstDayOfWeek: 0 })

      expect(calendar.weekdays.value[0]).toBe('D')

      locale.value = 'en-US'
      await nextTick()

      expect(calendar.weekdays.value[0]).toBe('S')

      stop()
    })

    it('should read weekday labels from an explicit adapter', () => {
      const { calendar, stop } = setup({
        month: '2026-02',
        adapter: new PlainDateAdapter('fr-FR'),
      })

      expect(calendar.weekdays.value[0]).toBe('L')
      expect(calendar.label.value).toContain('février')
      expect(calendar.month.value.weeks[0]![0]!.iso).toBe('2026-01-26')

      stop()
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
      const { calendar, stop } = setup({ month: '2026-08', readonly: true, value: '2026-08-04' })

      expect(cell(calendar, '2026-08-12').disabled).toBe(false)

      calendar.select('2026-08-12')
      calendar.unselect()
      calendar.next()

      expect(calendar.value.value).toBe('2026-08-04')
      expect(calendar.anchor.value).toBe('2026-09')

      stop()
    })

    it('should clear a selection with unselect', () => {
      const { calendar, stop } = setup({ month: '2026-08' })

      calendar.select('2026-08-12')
      calendar.unselect()

      expect(calendar.value.value).toBeUndefined()
      expect(cell(calendar, '2026-08-12').selected).toBe(false)

      stop()
    })

    it('should write a range ref and follow an external range', async () => {
      const model = shallowRef<CalendarRange>({})
      const { calendar, stop } = setup({ month: '2026-08', mode: 'range', value: model })

      calendar.select('2026-08-10')
      calendar.select('2026-08-12')

      expect(model.value).toEqual({ start: '2026-08-10', end: '2026-08-12' })

      model.value = { start: '2026-08-02', end: '2026-08-03' }
      await nextTick()

      expect(calendar.value.value).toEqual({ start: '2026-08-02', end: '2026-08-03' })
      expect(cell(calendar, '2026-08-02').selected).toBe(true)
      expect(cell(calendar, '2026-08-10').selected).toBe(false)

      stop()
    })

    it('should follow an external single value', async () => {
      const model = shallowRef<string | undefined>('2026-02-03')
      const { calendar, stop } = setup({ month: '2026-02', value: model })

      model.value = '2026-02-20'
      await nextTick()

      expect(calendar.value.value).toBe('2026-02-20')
      expect(cell(calendar, '2026-02-20').selected).toBe(true)

      stop()
    })

    it('should read an unavailable ref', async () => {
      const unavailable = shallowRef<(iso: string) => boolean>(() => false)
      const { calendar, stop } = setup({ month: '2026-08', unavailable })

      expect(cell(calendar, '2026-08-15').unavailable).toBe(false)

      unavailable.value = (iso: string) => iso === '2026-08-15'
      await nextTick()

      expect(cell(calendar, '2026-08-15').unavailable).toBe(true)

      calendar.select('2026-08-15')

      expect(calendar.value.value).toBeUndefined()

      stop()
    })

    it('should skip the write when preventDeselect selects the current day', () => {
      const model = shallowRef<CalendarValue>('2026-08-12')
      const { calendar, stop } = setup({
        month: '2026-08',
        value: model,
        preventDeselect: true,
      })

      calendar.select('2026-08-12')

      expect(model.value).toBe('2026-08-12')

      stop()
    })

    it('should replace a non-day controlled value', () => {
      const model = shallowRef<CalendarValue>(1 as unknown as CalendarValue)
      const { calendar, stop } = setup({ month: '2026-08', value: model })

      calendar.select('2026-08-09')

      expect(model.value).toBe('2026-08-09')

      stop()
    })

    it('should treat a cleared unavailable ref as available', async () => {
      const unavailable = shallowRef<((iso: string) => boolean) | undefined>(
        (iso: string) => iso === '2026-08-15',
      )
      const { calendar, stop } = setup({ month: '2026-08', unavailable })

      expect(cell(calendar, '2026-08-15').unavailable).toBe(true)

      unavailable.value = undefined
      await nextTick()

      expect(cell(calendar, '2026-08-15').unavailable).toBe(false)

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

    it('should page without writing a readonly month', () => {
      const month = computed(() => '2026-02')
      const { calendar, stop } = setup({ month, firstDayOfWeek: 0 })

      calendar.next()

      expect(month.value).toBe('2026-02')
      expect(calendar.anchor.value).toBe('2026-03')

      stop()
    })

    it('should follow an external month and write a clamped month back', async () => {
      const month = shallowRef('2026-02')
      const { calendar, stop } = setup({ month, max: '2026-04-30', firstDayOfWeek: 0 })

      month.value = '2026-03'
      await nextTick()

      expect(month.value).toBe('2026-03')
      expect(calendar.anchor.value).toBe('2026-03')

      month.value = 'nope'
      await nextTick()

      expect(month.value).toBe('nope')
      expect(calendar.anchor.value).toBe('2026-03')

      month.value = '2026-08'
      await nextTick()

      expect(month.value).toBe('2026-04')
      expect(calendar.anchor.value).toBe('2026-04')
      expect(calendar.focused.value.startsWith('2026-04')).toBe(true)
      expect(calendar.isLast.value).toBe(true)

      stop()
    })

    it('should walk by week, month, and year and stop at the walls', () => {
      const bounded = setup({ month: '2026-08', min: '2026-08-10', max: '2026-08-20' })

      bounded.calendar.goto('2026-08-12')
      bounded.calendar.move('week', -1)

      expect(bounded.calendar.focused.value).toBe('2026-08-10')
      expect(bounded.calendar.anchor.value).toBe('2026-08')

      bounded.calendar.goto('2026-08-18')
      bounded.calendar.move('week', 1)

      expect(bounded.calendar.focused.value).toBe('2026-08-20')

      bounded.calendar.goto('2026-08-25')

      expect(bounded.calendar.focused.value).toBe('2026-08-20')

      bounded.stop()

      const open = setup({ month: '2026-08' })

      open.calendar.goto('2026-08-04')
      open.calendar.move('week', 1)

      expect(open.calendar.focused.value).toBe('2026-08-11')

      open.calendar.move('month', 1)

      expect(open.calendar.anchor.value).toBe('2026-09')
      expect(open.calendar.focused.value).toBe('2026-09-11')

      open.calendar.move('year', 1)

      expect(open.calendar.anchor.value).toBe('2027-09')
      expect(open.calendar.focused.value).toBe('2027-09-11')

      open.stop()
    })

    it('should honor first and last, and ignore them when unbounded', () => {
      const bounded = setup({ month: '2026-08', min: '2026-06-01', max: '2026-10-31' })

      bounded.calendar.prev()

      expect(bounded.calendar.anchor.value).toBe('2026-07')
      expect(bounded.calendar.isFirst.value).toBe(false)
      expect(bounded.calendar.isLast.value).toBe(false)

      bounded.calendar.first()

      expect(bounded.calendar.anchor.value).toBe('2026-06')
      expect(bounded.calendar.isFirst.value).toBe(true)

      bounded.calendar.last()

      expect(bounded.calendar.anchor.value).toBe('2026-10')
      expect(bounded.calendar.isLast.value).toBe(true)

      bounded.stop()

      const open = setup({ month: '2026-08' })
      const anchor = open.calendar.anchor.value

      open.calendar.first()
      open.calendar.last()

      expect(open.calendar.anchor.value).toBe(anchor)

      open.stop()
    })

    it('should ignore a malformed goto and focus the first day of a month token', () => {
      const { calendar, stop } = setup({ month: '2026-08' })

      calendar.goto('nope')

      expect(calendar.anchor.value).toBe('2026-08')

      calendar.goto('2026-11')

      expect(calendar.anchor.value).toBe('2026-11')
      expect(calendar.focused.value).toBe('2026-11-01')

      stop()
    })

    it('should pull the visible month back when max moves before it', async () => {
      const max = shallowRef<string | undefined>(undefined)
      const { calendar, stop } = setup({ month: '2026-08', max })

      max.value = '2026-03-10'
      await nextTick()

      expect(calendar.anchor.value).toBe('2026-03')
      expect(calendar.focused.value <= '2026-03-10').toBe(true)
      expect(calendar.isLast.value).toBe(true)

      stop()
    })

    it('should refuse a day that is not on the visible grid', () => {
      const { calendar, stop } = setup({ month: '2026-02', firstDayOfWeek: 0 })

      calendar.select('2026-04-01')

      expect(calendar.value.value).toBeUndefined()

      stop()
    })

    it('should open on today when the month is omitted', () => {
      const { calendar, stop } = setup()

      expect(calendar.anchor.value).toBe('2026-08')
      expect(calendar.focused.value).toBe('2026-08-04')
      expect(calendar.weekdays.value[0]).toBe('S')
      expect(calendar.label.value).toContain('2026')

      stop()
    })

    it('should keep a month ref when the page stays inside its month', () => {
      const month = shallowRef('2026-08-04')
      const { calendar, stop } = setup({ month })

      calendar.goto('2026-08-20')

      expect(month.value).toBe('2026-08-04')
      expect(calendar.focused.value).toBe('2026-08-20')

      stop()
    })

    it('should use the first of the month when the shifted day overflows it', () => {
      const { calendar, stop } = setup({
        month: '2026-01',
        adapter: new OverflowMonthAdapter(),
      })

      calendar.goto('2026-01-31')
      calendar.step(1)

      expect(calendar.anchor.value).toBe('2026-02')
      expect(calendar.focused.value).toBe('2026-02-01')

      stop()
    })

    it('should leave focus when a new wall still contains it', async () => {
      const max = shallowRef('2026-08-28')
      const { calendar, stop } = setup({ month: '2026-08', max })

      calendar.goto('2026-08-10')
      max.value = '2026-08-20'
      await nextTick()

      expect(calendar.focused.value).toBe('2026-08-10')
      expect(calendar.anchor.value).toBe('2026-08')

      stop()
    })

    it('should follow a readonly month without writing it back', async () => {
      const external = shallowRef('2026-08')
      const month = computed(() => external.value)
      const { calendar, stop } = setup({ month })

      external.value = '2026-11'
      await nextTick()

      expect(calendar.anchor.value).toBe('2026-11')
      expect(month.value).toBe('2026-11')

      stop()
    })

    it('should mark days after max disabled', () => {
      const { calendar, stop } = setup({ month: '2026-08', max: '2026-08-02' })

      expect(calendar.focused.value).toBe('2026-08-02')
      expect(cell(calendar, '2026-08-03').disabled).toBe(true)
      expect(cell(calendar, '2026-08-01').disabled).toBe(false)

      calendar.select('2026-08-03')

      expect(calendar.value.value).toBeUndefined()

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

    it('should roll today forward at midnight', () => {
      const { calendar, stop } = setup({ month: '2026-08' })

      expect(cell(calendar, '2026-08-04').today).toBe(true)

      vi.advanceTimersByTime(12 * 60 * 60 * 1000)

      expect(cell(calendar, '2026-08-04').today).toBe(false)
      expect(cell(calendar, '2026-08-05').today).toBe(true)

      stop()
    })

    it('should apply a locale outside a scope without scheduling a timer', () => {
      const pending = vi.getTimerCount()
      const calendar = createCalendar({ month: '2026-02', locale: 'fr-FR', firstDayOfWeek: 0 })

      expect(vi.getTimerCount()).toBe(pending)
      expect(calendar.weekdays.value[0]).toBe('D')
    })

    it('should fall back to 1970-01-01 when the adapter has no current date', () => {
      const { calendar, stop } = setup({ adapter: new NullDateAdapter() })

      expect(calendar.anchor.value).toBe('1970-01')
      expect(calendar.focused.value).toBe('1970-01-01')
      expect(cell(calendar, '1970-01-01').today).toBe(true)

      stop()
    })

    it('should fall back when the next midnight is not ahead', () => {
      const pending = vi.getTimerCount()
      const { calendar, stop } = setup({
        month: '2026-08',
        adapter: new FrozenDayAdapter(),
      })

      expect(vi.getTimerCount()).toBeGreaterThan(pending)
      expect(calendar.anchor.value).toBe('2026-08')
      expect(calendar.focused.value).toBe('2026-08-04')

      stop()
    })
  })

  describe('installed date context', () => {
    it('should borrow the installed adapter, locale, and week start', () => {
      const adapter = new PlainDateAdapter('de-DE')
      const [, provideDate, context] = createDateContext({
        adapter,
        locale: 'de-DE',
        namespace: 'v0:date',
      })

      let calendar: CalendarContext | undefined

      const Child = defineComponent({
        setup () {
          calendar = createCalendar({ month: '2026-02' })
        },
        template: '<span />',
      })

      const Parent = defineComponent({
        components: { Child },
        setup () {
          provideDate(context)
        },
        template: '<Child />',
      })

      const wrapper = mount(Parent)

      expect(calendar!.month.value.weeks[0]![0]!.iso).toBe('2026-01-26')
      expect(calendar!.weekdays.value[0]).toBe('M')
      expect(calendar!.label.value).toContain('Februar')
      expect(adapter.firstDayOfWeek).toBe(1)

      wrapper.unmount()
    })

    it('should build its own adapter when nothing is installed', () => {
      let calendar: CalendarContext | undefined

      const Child = defineComponent({
        setup () {
          calendar = createCalendar({ month: '2026-02', firstDayOfWeek: 0 })
        },
        template: '<span />',
      })

      const wrapper = mount(Child)

      expect(calendar!.month.value.weeks).toHaveLength(4)
      expect(calendar!.month.value.weeks[0]![0]!.iso).toBe('2026-02-01')
      expect(calendar!.weekdays.value[0]).toBe('S')

      wrapper.unmount()
    })

    it('should use the adapter locale when the installed locale is unset', () => {
      const adapter = new PlainDateAdapter('fr-FR')
      let calendar: CalendarContext | undefined

      const Child = defineComponent({
        setup () {
          calendar = createCalendar({ month: '2026-02' })
        },
        template: '<span />',
      })

      const Parent = defineComponent({
        components: { Child },
        setup () {
          provideContext('v0:date', {
            adapter,
            locale: shallowRef<string | undefined>(undefined),
            firstDayOfWeek: shallowRef(0),
          })
        },
        template: '<Child />',
      })

      const wrapper = mount(Parent)

      expect(calendar!.month.value.weeks[0]![0]!.iso).toBe('2026-02-01')
      expect(calendar!.weekdays.value[0]).toBe('D')
      expect(adapter.firstDayOfWeek).toBe(1)

      wrapper.unmount()
    })
  })
})
