import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// Composables
import { createCalendar } from './calendar'

// Utilities
import { effectScope, nextTick, shallowRef } from 'vue'

// Types
import type { CalendarContext, CalendarOptions } from './calendar'

/** 2026-08-04 — a Tuesday in a month that spills to six rows naturally. */
const TODAY = new Date(2026, 7, 4)

const scopes: ReturnType<typeof effectScope>[] = []

/** `useTimer` registers an `onScopeDispose`, so every instance gets a scope. */
function make (options: CalendarOptions = {}): CalendarContext {
  const scope = effectScope()

  scopes.push(scope)

  return scope.run(() => createCalendar(options))!
}

function flat (calendar: CalendarContext) {
  return calendar.months.value[0].weeks.flat()
}

beforeEach(() => {
  vi.useFakeTimers()
  vi.setSystemTime(TODAY)
})

afterEach(() => {
  for (const scope of scopes.splice(0)) scope.stop()

  vi.useRealTimers()
})

describe('createCalendar', () => {
  describe('anchor and paging', () => {
    it('should anchor on the current month when uncontrolled', () => {
      const calendar = make()

      expect(calendar.anchor.value).toBe('2026-08')
      expect(calendar.months.value).toHaveLength(1)
      expect(calendar.months.value[0].anchor).toBe('2026-08')
    })

    it('should page whole months with next and prev', () => {
      const calendar = make()

      calendar.next()
      expect(calendar.anchor.value).toBe('2026-09')

      calendar.prev()
      calendar.prev()
      expect(calendar.anchor.value).toBe('2026-07')
    })

    it('should cross the year boundary when stepping', () => {
      const calendar = make()

      calendar.step(5)
      expect(calendar.anchor.value).toBe('2027-01')

      calendar.step(-13)
      expect(calendar.anchor.value).toBe('2025-12')
    })

    it('should clamp a step to the walls rather than overshooting', () => {
      const calendar = make({ min: '2026-06-10', max: '2026-10-20' })

      calendar.step(-12)
      expect(calendar.anchor.value).toBe('2026-06')

      calendar.step(12)
      expect(calendar.anchor.value).toBe('2026-10')
    })

    it('should flag isFirst and isLast only at the walls', () => {
      const calendar = make({ min: '2026-07-01', max: '2026-09-30' })

      expect(calendar.isFirst.value).toBe(false)
      expect(calendar.isLast.value).toBe(false)

      calendar.prev()
      expect(calendar.isFirst.value).toBe(true)
      expect(calendar.isLast.value).toBe(false)

      calendar.step(2)
      expect(calendar.isFirst.value).toBe(false)
      expect(calendar.isLast.value).toBe(true)
    })

    it('should leave both flags false when unbounded', () => {
      const calendar = make()

      calendar.step(-500)
      expect(calendar.isFirst.value).toBe(false)

      calendar.step(1000)
      expect(calendar.isLast.value).toBe(false)
    })

    it('should jump to the walls with first and last', () => {
      const calendar = make({ min: '2026-01-15', max: '2026-12-05' })

      calendar.first()
      expect(calendar.anchor.value).toBe('2026-01')

      calendar.last()
      expect(calendar.anchor.value).toBe('2026-12')
    })

    it('should no-op first and last when unbounded', () => {
      const calendar = make()

      calendar.first()
      expect(calendar.anchor.value).toBe('2026-08')

      calendar.last()
      expect(calendar.anchor.value).toBe('2026-08')
    })
  })

  describe('goto', () => {
    it('should accept a month and focus its entry day', () => {
      const calendar = make()

      calendar.goto('2027-03')

      expect(calendar.anchor.value).toBe('2027-03')
      expect(calendar.focused.value).toBe('2027-03-01')
    })

    it('should accept a day and focus it exactly', () => {
      const calendar = make()

      calendar.goto('2027-03-19')

      expect(calendar.anchor.value).toBe('2027-03')
      expect(calendar.focused.value).toBe('2027-03-19')
    })

    it('should focus today when paging back to the current month', () => {
      const calendar = make()

      calendar.goto('2027-03')
      calendar.goto('2026-08')

      expect(calendar.focused.value).toBe('2026-08-04')
    })

    it('should snap focus into the clamped month when the target is walled off', () => {
      const calendar = make({ max: '2026-09-30' })

      calendar.goto('2027-03-19')

      expect(calendar.anchor.value).toBe('2026-09')
      expect(calendar.focused.value).toBe('2026-09-01')
    })
  })

  describe('today', () => {
    it('should page to the current month and focus today', () => {
      const calendar = make()

      calendar.goto('2027-03')
      calendar.today()

      expect(calendar.anchor.value).toBe('2026-08')
      expect(calendar.focused.value).toBe('2026-08-04')
    })
  })

  describe('move', () => {
    it('should walk the focused day without paging inside the month', () => {
      const calendar = make()

      calendar.move('day', 1)

      expect(calendar.focused.value).toBe('2026-08-05')
      expect(calendar.anchor.value).toBe('2026-08')
    })

    it('should page the anchor when focus leaves the month forwards', () => {
      const calendar = make()

      calendar.goto('2026-08-31')
      calendar.move('day', 1)

      expect(calendar.focused.value).toBe('2026-09-01')
      expect(calendar.anchor.value).toBe('2026-09')
    })

    it('should page the anchor when focus leaves the month backwards', () => {
      const calendar = make()

      calendar.goto('2026-08-01')
      calendar.move('day', -1)

      expect(calendar.focused.value).toBe('2026-07-31')
      expect(calendar.anchor.value).toBe('2026-07')
    })

    it('should walk by week, month, and year', () => {
      const calendar = make()

      calendar.move('week', 1)
      expect(calendar.focused.value).toBe('2026-08-11')

      calendar.move('month', 1)
      expect(calendar.focused.value).toBe('2026-09-11')
      expect(calendar.anchor.value).toBe('2026-09')

      calendar.move('year', -1)
      expect(calendar.focused.value).toBe('2025-09-11')
      expect(calendar.anchor.value).toBe('2025-09')
    })

    it('should land on the wall rather than walking past it', () => {
      const calendar = make({ min: '2026-08-02', max: '2026-08-20' })

      calendar.move('year', 1)
      expect(calendar.focused.value).toBe('2026-08-20')

      calendar.move('year', -1)
      expect(calendar.focused.value).toBe('2026-08-02')
    })
  })

  describe('matrix', () => {
    it('should emit four rows for a month that fills them exactly', () => {
      const calendar = make()

      calendar.goto('2026-02')

      expect(calendar.months.value[0].weeks).toHaveLength(4)
      expect(flat(calendar)[0].iso).toBe('2026-02-01')
    })

    it('should pad that month to six rows under fixedWeeks', () => {
      const calendar = make({ fixedWeeks: true })

      calendar.goto('2026-02')

      const weeks = calendar.months.value[0].weeks
      const cells = flat(calendar)

      expect(weeks).toHaveLength(6)
      expect(cells).toHaveLength(42)
      expect(cells[0].iso).toBe('2026-02-01')
      expect(cells[41].iso).toBe('2026-03-14')
    })

    it('should leave a natural six-row month untouched by fixedWeeks', () => {
      const loose = make()
      const fixed = make({ fixedWeeks: true })

      expect(loose.months.value[0].weeks).toHaveLength(6)
      expect(fixed.months.value[0].weeks).toHaveLength(6)
      expect(flat(fixed).map(cell => cell.iso)).toEqual(flat(loose).map(cell => cell.iso))
    })

    it('should start every row on the configured week start', () => {
      const calendar = make({ firstDayOfWeek: 1 })

      // 2026-08-01 is a Saturday, so a Monday start leads with 2026-07-27.
      expect(flat(calendar)[0].iso).toBe('2026-07-27')
    })
  })

  describe('cells', () => {
    it('should flag today and the surrounding spill', () => {
      const calendar = make()
      const cells = flat(calendar)

      const today = cells.filter(cell => cell.today)

      expect(today).toHaveLength(1)
      expect(today[0].iso).toBe('2026-08-04')
      expect(today[0].outside).toBe(false)
      expect(today[0].day).toBe(4)

      expect(cells[0].outside).toBe(true)
      expect(cells[0].iso).toBe('2026-07-26')
    })

    it('should disable days outside min and max', () => {
      const calendar = make({ min: '2026-08-05', max: '2026-08-20' })
      const cells = flat(calendar)

      function at (iso: string) {
        return cells.find(cell => cell.iso === iso)!
      }

      expect(at('2026-08-04').disabled).toBe(true)
      expect(at('2026-08-05').disabled).toBe(false)
      expect(at('2026-08-20').disabled).toBe(false)
      expect(at('2026-08-21').disabled).toBe(true)
    })

    it('should disable days rejected by the predicate', () => {
      const calendar = make({ disabled: iso => iso.endsWith('-13') })
      const cells = flat(calendar)

      expect(cells.find(cell => cell.iso === '2026-08-13')!.disabled).toBe(true)
      expect(cells.find(cell => cell.iso === '2026-08-14')!.disabled).toBe(false)
    })

    it('should disable every day when the whole calendar is disabled', () => {
      const calendar = make({ disabled: true })

      expect(flat(calendar).every(cell => cell.disabled)).toBe(true)
    })

    it('should track a reactive whole-calendar flag', async () => {
      const disabled = shallowRef(false)
      const calendar = make({ disabled })

      expect(flat(calendar).some(cell => cell.disabled)).toBe(false)

      disabled.value = true
      await nextTick()

      expect(flat(calendar).every(cell => cell.disabled)).toBe(true)
    })
  })

  describe('weekdays', () => {
    it('should rotate to the configured week start', () => {
      const sunday = make()
      const monday = make({ firstDayOfWeek: 1 })

      expect(sunday.weekdays.value).toHaveLength(7)
      expect(sunday.weekdays.value[0].long).toBe('Sunday')
      expect(monday.weekdays.value[0].long).toBe('Monday')
      expect(monday.weekdays.value[6].long).toBe('Sunday')
    })

    it('should carry all three widths', () => {
      const calendar = make()
      const [first] = calendar.weekdays.value

      expect(first.short).toBe('Sun')
      expect(first.narrow).toBe('S')
    })
  })

  describe('label', () => {
    it('should localize the anchor month', () => {
      const calendar = make()

      expect(calendar.label.value).toBe('August 2026')

      calendar.next()
      expect(calendar.label.value).toBe('September 2026')
    })
  })

  describe('controlled month', () => {
    it('should follow a ref the caller owns', async () => {
      const month = shallowRef('2026-08')
      const calendar = make({ month })

      expect(calendar.anchor.value).toBe('2026-08')

      month.value = '2026-11'
      await nextTick()

      expect(calendar.anchor.value).toBe('2026-11')
      expect(calendar.focused.value).toBe('2026-11-01')
    })

    it('should accept a getter and clamp it to the walls', async () => {
      const month = shallowRef('2026-08')
      const calendar = make({ month: () => month.value, max: '2026-09-30' })

      month.value = '2027-05'
      await nextTick()

      expect(calendar.anchor.value).toBe('2026-09')
    })
  })

  describe('now', () => {
    it('should roll the today flag over at midnight', async () => {
      const calendar = make()

      expect(flat(calendar).find(cell => cell.today)!.iso).toBe('2026-08-04')

      // The timer is armed for the next local midnight; advancing the fake
      // clock past it re-reads the date and re-arms.
      await vi.advanceTimersByTimeAsync(24 * 60 * 60 * 1000 + 1000)
      await nextTick()

      expect(flat(calendar).find(cell => cell.today)!.iso).toBe('2026-08-05')
    })
  })
})
