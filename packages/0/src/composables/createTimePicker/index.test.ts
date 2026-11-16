import { afterEach, describe, expect, it, vi } from 'vitest'

import { createTimePicker } from './index'

// Utilities
import { customRef, effectScope, nextTick, shallowRef } from 'vue'

// Types
import type { TimeHourCycle, TimePickerContext, TimePickerOptions } from './index'
import type { EffectScope } from 'vue'

let scope: EffectScope | undefined

function setup (options?: TimePickerOptions): TimePickerContext {
  scope = effectScope()
  let time!: TimePickerContext
  scope.run(() => {
    time = createTimePicker(options)
  })
  return time
}

function walk (time: TimePickerContext, part: 'hour' | 'minute' | 'second', count: number, times: number): (number | null)[] {
  const seen: (number | null)[] = []
  for (let index = 0; index < times; index++) {
    time.step(part, count)
    seen.push(time[part].value)
  }
  return seen
}

afterEach(() => {
  scope?.stop()
  scope = undefined
})

describe('createTimePicker', () => {
  describe('24-hour value', () => {
    it('should round-trip a 24-hour time', () => {
      const time = setup()

      time.commit('hour', 15)
      time.commit('minute', 45)

      expect(time.value.value).toBe('15:45')
      expect(time.hour.value).toBe(15)
      expect(time.minute.value).toBe(45)
      expect(time.period.value).toBeNull()
      expect(time.second.value).toBeNull()
    })

    it('should stay null until hour and minute are both set', () => {
      const time = setup()

      time.commit('hour', 9)
      expect(time.value.value).toBeNull()

      time.commit('minute', 5)
      expect(time.value.value).toBe('09:05')
    })

    it('should parse an initial canonical value', () => {
      const time = setup({ value: shallowRef('08:05') })

      expect(time.hour.value).toBe(8)
      expect(time.minute.value).toBe(5)
      expect(time.value.value).toBe('08:05')
    })

    it('should ingest a later write to the value ref', () => {
      const value = shallowRef<string | null>(null)
      const time = setup({ value })

      value.value = '16:45'

      expect(time.hour.value).toBe(16)
      expect(time.minute.value).toBe(45)
      expect(time.value.value).toBe('16:45')
    })

    it('should return the value to null and keep the other fields when one field is cleared', () => {
      const time = setup({ value: shallowRef('09:30') })

      time.commit('minute', null)

      expect(time.value.value).toBeNull()
      expect(time.hour.value).toBe(9)
      expect(time.minute.value).toBeNull()

      time.commit('minute', 15)
      expect(time.value.value).toBe('09:15')
    })

    it('should keep partial fields when a controlled model echoes the published value', () => {
      let inner: string | null = '09:30'
      let emitted: string | null | undefined
      let notify!: () => void

      // Mirrors a controlled v-model: a write only emits, and the new value
      // arrives later from the parent.
      const value = customRef<string | null>((track, trigger) => {
        notify = trigger
        return {
          get () {
            track()
            return inner
          },
          set (next) {
            emitted = next
          },
        }
      })
      const time = setup({ value })

      time.commit('minute', null)
      expect(emitted).toBeNull()

      inner = emitted as null
      notify()

      expect(time.hour.value).toBe(9)
      expect(time.minute.value).toBeNull()
    })
  })

  describe('batched changes', () => {
    it('should show an incoming value at once and normalize it before the next flush', async () => {
      const value = shallowRef<string | null>(null)
      const time = setup({ value, minuteStep: 15 })

      value.value = '10:58'

      expect(time.hour.value).toBe(10)
      expect(time.minute.value).toBe(58)

      await nextTick()

      expect(time.minute.value).toBe(45)
      expect(value.value).toBe('10:45')
    })

    it('should apply a value and an option that change together as one', async () => {
      const value = shallowRef<string | null>('10:00')
      const min = shallowRef<string | null>('09:00')
      const minuteStep = shallowRef(15)
      const seconds = shallowRef(false)
      setup({ value, min, minuteStep, seconds })

      value.value = '08:07:45'
      min.value = null
      minuteStep.value = 1
      seconds.value = true
      await nextTick()

      expect(value.value).toBe('08:07:45')
    })

    it('should hide the seconds of an incoming value while seconds are off', async () => {
      const value = shallowRef<string | null>(null)
      const time = setup({ value })

      value.value = '09:30:45'

      expect(time.second.value).toBeNull()

      await nextTick()

      expect(value.value).toBe('09:30')
    })

    it('should write the end state of edits that return to the last incoming value', () => {
      let inner: string | null = '09:30'
      const writes: (string | null)[] = []

      // A controlled model keeps returning the old value until the parent
      // re-renders, however many writes it has been sent.
      const value = customRef<string | null>(track => ({
        get () {
          track()
          return inner
        },
        set (next) {
          writes.push(next)
        },
      }))
      const time = setup({ value })

      time.step('minute', 1)
      time.step('minute', -1)

      expect(writes).toEqual(['09:31', '09:30'])

      inner = '09:30'
      time.clear()
      time.commit('hour', 9)
      time.commit('minute', 30)

      expect(writes).toEqual(['09:31', '09:30', null, '09:30'])
    })

    it('should not write a canonical value back', async () => {
      const writes: (string | null)[] = []
      let inner: string | null = '09:30'
      let notify!: () => void

      const value = customRef<string | null>((track, trigger) => {
        notify = trigger
        return {
          get () {
            track()
            return inner
          },
          set (next) {
            writes.push(next)
          },
        }
      })
      setup({ value })

      inner = '12:00'
      notify()
      await nextTick()

      expect(writes).toEqual([])
    })
  })

  describe('incoming value', () => {
    it.each([
      ['9:30'],
      ['24:00'],
      ['12:60'],
      ['12:30:60'],
      ['12:30:'],
      [' 12:30'],
      ['noon'],
      [930],
    ])('should empty the fields and warn for %j', raw => {
      using spy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const time = setup({ value: shallowRef(raw as string) })

      expect(time.value.value).toBeNull()
      expect(time.hour.value).toBeNull()
      expect(time.minute.value).toBeNull()
      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledWith(expect.stringContaining('createTimePicker: value'))
    })

    it.each([[''], [null]])('should stay silent for the empty value %j', raw => {
      using spy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const time = setup({ value: shallowRef(raw) })

      expect(time.hour.value).toBeNull()
      expect(spy).not.toHaveBeenCalled()
    })

    it('should warn when a later write cannot be parsed', async () => {
      using spy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const value = shallowRef<string | null>('09:30')
      const time = setup({ value })

      value.value = '9:30'
      await nextTick()

      expect(time.value.value).toBeNull()
      expect(time.hour.value).toBeNull()
      expect(spy).toHaveBeenCalledTimes(1)
    })
  })

  describe('12-hour cycle', () => {
    it('should shift the stored hour when the period changes', () => {
      const time = setup({ hourCycle: 'h12' })

      time.commit('hour', 3)
      time.commit('minute', 0)

      expect(time.period.value).toBe('am')
      expect(time.hour.value).toBe(3)
      expect(time.value.value).toBe('03:00')

      time.commit('period', 'pm')

      expect(time.period.value).toBe('pm')
      expect(time.hour.value).toBe(3)
      expect(time.value.value).toBe('15:00')
    })

    it('should map 12 am to midnight and 12 pm to noon', () => {
      const midnight = setup({ hourCycle: 'h12' })
      midnight.commit('period', 'am')
      midnight.commit('hour', 12)
      midnight.commit('minute', 0)
      expect(midnight.value.value).toBe('00:00')

      const noon = setup({ hourCycle: 'h12' })
      noon.commit('period', 'pm')
      noon.commit('hour', 12)
      noon.commit('minute', 0)
      expect(noon.value.value).toBe('12:00')
    })

    it('should remember a period set before the hour', () => {
      const time = setup({ hourCycle: 'h12' })

      time.commit('period', 'pm')
      expect(time.value.value).toBeNull()
      expect(time.period.value).toBe('pm')

      time.commit('hour', 3)
      time.commit('minute', 15)

      expect(time.value.value).toBe('15:15')
    })

    it('should remember a period chosen while the hour was set', () => {
      const time = setup({ hourCycle: 'h12' })

      time.commit('hour', 3)
      time.commit('minute', 0)
      time.commit('period', 'pm')
      time.commit('hour', null)

      expect(time.period.value).toBe('pm')

      time.commit('hour', 3)
      expect(time.value.value).toBe('15:00')
    })

    it('should remember the period of an ingested value', () => {
      const time = setup({ hourCycle: 'h12', value: shallowRef('15:00') })

      time.commit('hour', null)
      time.commit('hour', 4)

      expect(time.value.value).toBe('16:00')
    })

    it('should ignore a period commit while the cycle is h23', () => {
      const time = setup()

      time.commit('hour', 3)
      time.commit('minute', 0)
      time.commit('period', 'pm')

      expect(time.value.value).toBe('03:00')
      expect(time.period.value).toBeNull()
    })

    it('should wrap between 12 and 1 without leaving the meridiem', () => {
      const time = setup({ hourCycle: 'h12', value: shallowRef('00:00') })

      expect(time.hour.value).toBe(12)

      time.step('hour', 1)
      expect(time.hour.value).toBe(1)
      expect(time.value.value).toBe('01:00')

      time.step('hour', -1)
      expect(time.hour.value).toBe(12)
      expect(time.value.value).toBe('00:00')

      time.step('hour', -1)
      expect(time.hour.value).toBe(11)
      expect(time.value.value).toBe('11:00')

      time.step('hour', 1)
      expect(time.hour.value).toBe(12)
      expect(time.period.value).toBe('am')
      expect(time.value.value).toBe('00:00')
    })

    it('should keep a pm hour inside the afternoon', () => {
      const time = setup({ hourCycle: 'h12', value: shallowRef('23:00') })

      time.step('hour', 1)

      expect(time.hour.value).toBe(12)
      expect(time.period.value).toBe('pm')
      expect(time.value.value).toBe('12:00')
    })

    it('should follow a runtime change of the hour cycle', () => {
      const hourCycle = shallowRef<TimeHourCycle>('h23')
      const time = setup({ hourCycle, value: shallowRef('15:30') })

      expect(time.hour.value).toBe(15)
      expect(time.period.value).toBeNull()

      hourCycle.value = 'h12'

      expect(time.hour.value).toBe(3)
      expect(time.period.value).toBe('pm')
      expect(time.value.value).toBe('15:30')
    })
  })

  describe('seconds', () => {
    it('should omit seconds until the option is on', () => {
      const time = setup()

      time.commit('hour', 1)
      time.commit('minute', 2)
      time.commit('second', 3)

      expect(time.value.value).toBe('01:02')
      expect(time.second.value).toBeNull()
    })

    it('should read a missing second as zero', () => {
      const time = setup({ seconds: true, value: shallowRef('09:30') })

      expect(time.second.value).toBe(0)
      expect(time.value.value).toBe('09:30:00')
    })

    it('should drop the seconds of an incoming value while seconds are off', () => {
      const time = setup({ value: shallowRef('09:30:45') })

      expect(time.second.value).toBeNull()
      expect(time.value.value).toBe('09:30')
    })

    it('should keep the time and zero the second when seconds turn on', async () => {
      const seconds = shallowRef(false)
      const time = setup({ seconds })

      time.commit('hour', 1)
      time.commit('minute', 2)
      expect(time.value.value).toBe('01:02')

      seconds.value = true
      await nextTick()
      expect(time.second.value).toBe(0)
      expect(time.value.value).toBe('01:02:00')

      time.commit('second', 3)
      expect(time.value.value).toBe('01:02:03')

      seconds.value = false
      await nextTick()
      expect(time.value.value).toBe('01:02')
      expect(time.second.value).toBeNull()
    })

    it('should leave the second empty when seconds turn on for a partial time', async () => {
      const seconds = shallowRef(false)
      const time = setup({ seconds })

      time.commit('hour', 1)
      seconds.value = true
      await nextTick()

      expect(time.second.value).toBeNull()
      expect(time.value.value).toBeNull()
    })

    it('should stay null until the user sets the second', () => {
      const time = setup({ seconds: true })

      time.commit('hour', 1)
      time.step('minute', 1)
      expect(time.value.value).toBeNull()

      time.commit('second', 3)
      expect(time.value.value).toBe('01:00:03')
    })
  })

  describe('step grid', () => {
    it('should cycle the minute through its grid in both directions', () => {
      const time = setup({ minuteStep: 15, value: shallowRef('10:00') })

      expect(walk(time, 'minute', 1, 4)).toEqual([15, 30, 45, 0])
      expect(walk(time, 'minute', -1, 4)).toEqual([45, 30, 15, 0])
      expect(time.value.value).toBe('10:00')
    })

    it('should wrap a step that does not divide the cycle', () => {
      const time = setup({ minuteStep: 7, value: shallowRef('10:56') })

      time.step('minute', 1)
      expect(time.minute.value).toBe(0)

      time.step('minute', -1)
      expect(time.minute.value).toBe(56)
    })

    it('should cycle the 24-hour hour through its grid', () => {
      const time = setup({ hourStep: 5, value: shallowRef('15:00') })

      expect(walk(time, 'hour', 1, 3)).toEqual([20, 0, 5])
      expect(walk(time, 'hour', -1, 2)).toEqual([0, 20])
    })

    it('should cycle the 12-hour hour on the 24-hour grid of its meridiem', () => {
      const time = setup({ hourCycle: 'h12', hourStep: 5 })

      expect(walk(time, 'hour', 1, 4)).toEqual([12, 5, 10, 12])
      expect(walk(time, 'hour', -1, 1)).toEqual([10])

      time.commit('period', 'pm')
      time.commit('minute', 0)
      expect(time.value.value).toBe('20:00')
      expect(walk(time, 'hour', 1, 2)).toEqual([3, 8])
      expect(time.value.value).toBe('20:00')
    })

    it('should step an off-grid value onto the adjacent grid point', () => {
      const up = setup({ minuteStep: 15, min: '10:07', value: shallowRef('10:00') })
      expect(up.value.value).toBe('10:07')
      up.step('minute', 1)
      expect(up.value.value).toBe('10:15')

      const down = setup({ minuteStep: 15, max: '10:53', value: shallowRef('11:00') })
      expect(down.value.value).toBe('10:53')
      down.step('minute', -1)
      expect(down.value.value).toBe('10:45')
    })

    it('should snap a commit to the nearest grid point without wrapping', () => {
      const time = setup({ minuteStep: 15, hourStep: 5 })

      time.commit('hour', 23)
      expect(time.hour.value).toBe(20)

      time.commit('minute', 7)
      expect(time.minute.value).toBe(0)

      time.commit('minute', 8)
      expect(time.minute.value).toBe(15)

      time.commit('minute', 53)
      expect(time.minute.value).toBe(45)

      time.commit('minute', 58)
      expect(time.minute.value).toBe(45)
      expect(time.value.value).toBe('20:45')
    })

    it('should snap a 12-hour commit on the same grid a later resnap uses', async () => {
      const minuteStep = shallowRef(1)
      const time = setup({ hourCycle: 'h12', hourStep: 2, minuteStep })

      time.commit('hour', 3)
      time.commit('minute', 0)
      expect(time.value.value).toBe('04:00')

      minuteStep.value = 5
      await nextTick()
      expect(time.value.value).toBe('04:00')
    })

    it('should snap an ingested value', () => {
      const time = setup({ minuteStep: 15, value: shallowRef('10:58') })

      expect(time.value.value).toBe('10:45')
    })

    it('should resnap when a step changes', async () => {
      const minuteStep = shallowRef(1)
      const time = setup({ minuteStep, value: shallowRef('10:37') })

      minuteStep.value = 15
      await nextTick()

      expect(time.value.value).toBe('10:30')
      expect(time.grid('minute')).toEqual({ min: 0, max: 45, step: 15 })
    })

    it('should land on the first grid point when stepping from empty', () => {
      const time = setup({ seconds: true })

      time.step('hour', -1)
      time.step('minute', -1)
      time.step('second', 5)

      expect(time.value.value).toBe('00:00:00')

      const meridiem = setup({ hourCycle: 'h12' })

      meridiem.step('hour', 1)
      meridiem.step('minute', 1)

      expect(meridiem.hour.value).toBe(12)
      expect(meridiem.period.value).toBe('am')
      expect(meridiem.value.value).toBe('00:00')
    })

    it('should move as many intervals as the count', () => {
      const time = setup({ minuteStep: 15, value: shallowRef('10:00') })

      time.step('minute', 5)
      expect(time.minute.value).toBe(15)

      time.step('minute', -2)
      expect(time.minute.value).toBe(45)

      time.step('hour', 3)
      expect(time.value.value).toBe('13:45')
    })

    it.each([[0], [0.5], [Number.NaN], [Number.POSITIVE_INFINITY]])('should ignore a step count of %s', count => {
      const time = setup({ hourCycle: 'h12', value: shallowRef('10:30') })

      time.step('hour', count)
      time.step('minute', count)
      time.step('period', count)

      expect(time.value.value).toBe('10:30')
    })

    it('should flip the period for any non-zero count', () => {
      const time = setup({ hourCycle: 'h12', value: shallowRef('10:30') })

      time.step('period', 2)
      expect(time.value.value).toBe('22:30')

      time.step('period', -1)
      expect(time.value.value).toBe('10:30')
    })

    it.each([[0], [-5], [Number.NaN], [Number.POSITIVE_INFINITY], [0.5]])('should read a step of %s as 1', minuteStep => {
      const time = setup({ minuteStep, value: shallowRef('10:00') })

      time.step('minute', 1)

      expect(time.minute.value).toBe(1)
    })

    it('should truncate a fractional step', () => {
      const time = setup({ minuteStep: 2.5, value: shallowRef('10:00') })

      time.step('minute', 1)

      expect(time.minute.value).toBe(2)
    })

    it('should hold the only grid point when the step exceeds the cycle', () => {
      const time = setup({ minuteStep: 90, value: shallowRef('10:30') })

      expect(time.value.value).toBe('10:00')

      time.step('minute', 1)
      time.step('minute', -1)
      time.commit('minute', 59)

      expect(time.value.value).toBe('10:00')
      expect(time.grid('minute')).toEqual({ min: 0, max: 0, step: 90 })
    })

    it('should keep a meridiem usable when no grid point falls inside it', () => {
      const time = setup({ hourCycle: 'h12', hourStep: 30 })

      time.step('hour', 1)
      time.commit('minute', 0)
      expect(time.value.value).toBe('00:00')

      time.step('period', 1)
      expect(time.value.value).toBe('12:00')
      expect(time.grid('hour')).toEqual({ min: 12, max: 12, step: 30 })

      time.step('hour', 1)
      expect(time.value.value).toBe('12:00')
    })

    it('should report the display range of each field', () => {
      const time = setup({ hourCycle: 'h12', hourStep: 5, value: shallowRef('05:00') })

      expect(time.grid('hour')).toEqual({ min: 5, max: 12, step: 5 })
      expect(time.grid('minute')).toEqual({ min: 0, max: 59, step: 1 })

      time.commit('period', 'pm')
      expect(time.grid('hour')).toEqual({ min: 3, max: 8, step: 5 })

      const plain = setup({ hourStep: 5 })
      expect(plain.grid('hour')).toEqual({ min: 0, max: 20, step: 5 })
    })
  })

  describe('commit', () => {
    it.each([[Number.NaN], [Number.POSITIVE_INFINITY], [Number.NEGATIVE_INFINITY]])('should ignore %s', next => {
      const time = setup({ value: shallowRef('10:30') })

      time.commit('hour', next)
      time.commit('minute', next)

      expect(time.value.value).toBe('10:30')
    })

    it('should hold an out-of-range number inside the field', () => {
      const time = setup()

      time.commit('hour', 99)
      time.commit('minute', -5)
      expect(time.value.value).toBe('23:00')

      time.commit('hour', -1)
      time.commit('minute', 75)
      expect(time.value.value).toBe('00:59')
    })

    it('should hold a 12-hour commit between 1 and 12', () => {
      const time = setup({ hourCycle: 'h12' })

      time.commit('minute', 0)
      time.commit('hour', 0)
      expect(time.value.value).toBe('01:00')

      time.commit('hour', 13)
      expect(time.value.value).toBe('00:00')
    })
  })

  describe('range', () => {
    it('should clamp a complete value into min and max', () => {
      const time = setup({ min: '09:00', max: '17:00' })

      time.commit('hour', 8)
      time.commit('minute', 30)
      expect(time.value.value).toBe('09:00')

      time.commit('hour', 18)
      time.commit('minute', 15)
      expect(time.value.value).toBe('17:00')
    })

    it('should clamp again when min changes', async () => {
      const min = shallowRef<string | null>(null)
      const time = setup({ min })

      time.commit('hour', 8)
      time.commit('minute', 0)
      expect(time.value.value).toBe('08:00')

      min.value = '09:30'
      await nextTick()
      expect(time.value.value).toBe('09:30')
    })

    it('should clamp an external write', async () => {
      const value = shallowRef<string | null>('12:00')
      setup({ value, max: '17:00' })

      value.value = '20:00'
      await nextTick()

      expect(value.value).toBe('17:00')
    })

    it('should clamp to the second when seconds are on', () => {
      const time = setup({
        seconds: true,
        min: '09:00:30',
        max: '17:00',
        value: shallowRef('09:00:10'),
      })

      expect(time.value.value).toBe('09:00:30')

      time.commit('hour', 17)
      expect(time.value.value).toBe('17:00:00')
    })

    it('should not clamp and should warn when min is after max', () => {
      using spy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const time = setup({ min: '17:00', max: '09:00', value: shallowRef('12:00') })

      expect(time.value.value).toBe('12:00')
      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledWith(expect.stringContaining('is after max'))
    })

    it('should ignore and warn about a bound that cannot be parsed', () => {
      using spy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const time = setup({ min: '9am', max: '17:00', value: shallowRef('08:00') })

      expect(time.value.value).toBe('08:00')
      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledWith(expect.stringContaining('createTimePicker: min'))

      time.commit('hour', 18)
      expect(time.value.value).toBe('17:00')
    })

    it('should stay silent for an empty bound', () => {
      using spy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      setup({ min: '', max: null, value: shallowRef('08:00') })

      expect(spy).not.toHaveBeenCalled()
    })
  })

  describe('guards', () => {
    it.each([['disabled'], ['readonly']] as const)('should never write the value while %s', async flag => {
      const value = shallowRef<string | null>('09:07')
      const min = shallowRef<string | null>('10:00')
      const blocked = shallowRef(true)
      const time = setup({ value, min, minuteStep: 15, [flag]: blocked })

      expect(value.value).toBe('09:07')
      expect(time.hour.value).toBe(9)
      expect(time.minute.value).toBe(7)

      value.value = '08:03'
      await nextTick()
      expect(value.value).toBe('08:03')
      expect(time.hour.value).toBe(8)
      expect(time.minute.value).toBe(3)

      min.value = '11:00'
      await nextTick()
      expect(value.value).toBe('08:03')

      blocked.value = false
      await nextTick()
      expect(value.value).toBe('11:00')
      expect(time.hour.value).toBe(11)
    })

    it.each([['disabled'], ['readonly']] as const)('should ignore commit, step, and clear while %s', flag => {
      const time = setup({ [flag]: true, value: shallowRef('04:00') })

      time.commit('hour', 5)
      time.step('minute', 1)
      time.clear()

      expect(time.value.value).toBe('04:00')
      expect(time.hour.value).toBe(4)
      expect(time.minute.value).toBe(0)
    })

    it('should clear back to null', () => {
      const time = setup({ hourCycle: 'h12', value: shallowRef('15:02') })

      time.clear()

      expect(time.value.value).toBeNull()
      expect(time.hour.value).toBeNull()
      expect(time.minute.value).toBeNull()
      expect(time.period.value).toBe('am')
    })
  })
})
