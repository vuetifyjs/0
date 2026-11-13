import { afterEach, describe, expect, it } from 'vitest'

import { createTimePicker } from './index'

// Utilities
import { effectScope, shallowRef } from 'vue'

// Types
import type { TimePickerContext, TimePickerOptions } from './index'
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

afterEach(() => {
  scope?.stop()
  scope = undefined
})

describe('createTimePicker', () => {
  describe('24-hour value', () => {
    it('should round-trip a 24-hour time', () => {
      const time = setup()

      time.setHour(15)
      time.setMinute(45)

      expect(time.value.value).toBe('15:45')
      expect(time.hour.value).toBe(15)
      expect(time.minute.value).toBe(45)
      expect(time.period.value).toBeNull()
      expect(time.second.value).toBeNull()
    })

    it('should stay null until hour and minute are both set', () => {
      const time = setup()

      time.setHour(9)
      expect(time.value.value).toBeNull()

      time.setMinute(5)
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

    it('should clear the value when the canonical string is invalid', () => {
      const time = setup({ value: shallowRef('25:00') })

      expect(time.value.value).toBeNull()
      expect(time.hour.value).toBeNull()
    })
  })

  describe('12-hour cycle', () => {
    it('should shift the stored hour when the period changes', () => {
      const time = setup({ hourCycle: 'h12' })

      time.setHour(3)
      time.setMinute(0)

      expect(time.period.value).toBe('am')
      expect(time.hour.value).toBe(3)
      expect(time.value.value).toBe('03:00')

      time.setPeriod('pm')

      expect(time.period.value).toBe('pm')
      expect(time.hour.value).toBe(3)
      expect(time.value.value).toBe('15:00')
    })

    it('should map 12 am to midnight and 12 pm to noon', () => {
      const midnight = setup({ hourCycle: 'h12' })
      midnight.setPeriod('am')
      midnight.setHour(12)
      midnight.setMinute(0)
      expect(midnight.value.value).toBe('00:00')

      const noon = setup({ hourCycle: 'h12' })
      noon.setPeriod('pm')
      noon.setHour(12)
      noon.setMinute(0)
      expect(noon.value.value).toBe('12:00')
    })

    it('should remember a period set before the hour', () => {
      const time = setup({ hourCycle: 'h12' })

      time.setPeriod('pm')
      expect(time.value.value).toBeNull()
      expect(time.period.value).toBe('pm')

      time.setHour(3)
      time.setMinute(15)

      expect(time.value.value).toBe('15:15')
    })

    it('should ignore setPeriod while the cycle is h23', () => {
      const time = setup()

      time.setHour(3)
      time.setMinute(0)
      time.setPeriod('pm')

      expect(time.value.value).toBe('03:00')
      expect(time.period.value).toBeNull()
    })
  })

  describe('seconds', () => {
    it('should omit seconds until the option is on', () => {
      const time = setup()

      time.setHour(1)
      time.setMinute(2)
      time.setSecond(3)

      expect(time.value.value).toBe('01:02')
      expect(time.second.value).toBeNull()
    })

    it('should require a second before publishing HH:mm:ss', () => {
      const seconds = shallowRef(false)
      const time = setup({ seconds })

      time.setHour(1)
      time.setMinute(2)
      expect(time.value.value).toBe('01:02')

      seconds.value = true
      expect(time.value.value).toBeNull()

      time.setSecond(3)
      expect(time.value.value).toBe('01:02:03')

      seconds.value = false
      expect(time.value.value).toBe('01:02')
      expect(time.second.value).toBeNull()
    })
  })

  describe('step and range', () => {
    it('should snap minutes to the step', () => {
      const time = setup({ minuteStep: 15 })

      time.setHour(10)
      time.setMinute(7)
      expect(time.value.value).toBe('10:00')

      time.setMinute(8)
      expect(time.value.value).toBe('10:15')

      time.setMinute(23)
      expect(time.value.value).toBe('10:30')
    })

    it('should clamp a complete value into min and max', () => {
      const time = setup({ min: '09:00', max: '17:00' })

      time.setHour(8)
      time.setMinute(30)
      expect(time.value.value).toBe('09:00')

      time.setHour(18)
      time.setMinute(15)
      expect(time.value.value).toBe('17:00')
    })

    it('should clamp again when min changes', () => {
      const min = shallowRef<string | null>(null)
      const time = setup({ min })

      time.setHour(8)
      time.setMinute(0)
      expect(time.value.value).toBe('08:00')

      min.value = '09:30'
      expect(time.value.value).toBe('09:30')
    })

    it('should wrap the hour and the minute', () => {
      const time = setup()

      time.setHour(23)
      time.setMinute(59)
      time.stepHour(1)
      expect(time.hour.value).toBe(0)

      time.stepMinute(1)
      expect(time.minute.value).toBe(0)
      expect(time.value.value).toBe('00:00')
    })

    it('should land on the origin when stepping from empty', () => {
      const time = setup({ hourCycle: 'h12' })

      time.stepHour(1)
      time.stepMinute(1)

      expect(time.hour.value).toBe(12)
      expect(time.minute.value).toBe(0)
      expect(time.period.value).toBe('am')
      expect(time.value.value).toBe('00:00')
    })
  })

  describe('guards', () => {
    it('should ignore mutations while disabled', () => {
      const time = setup({ disabled: true, value: shallowRef('04:00') })

      time.setHour(5)
      time.clear()

      expect(time.value.value).toBe('04:00')
    })

    it('should ignore mutations while readonly', () => {
      const time = setup({ readonly: true })

      time.setHour(5)
      time.setMinute(5)

      expect(time.value.value).toBeNull()
    })

    it('should clear back to null', () => {
      const time = setup()

      time.setHour(1)
      time.setMinute(2)
      time.clear()

      expect(time.value.value).toBeNull()
      expect(time.hour.value).toBeNull()
      expect(time.minute.value).toBeNull()
    })

    it('should format a time without reading window', () => {
      const time = setup()

      time.setHour(1)
      time.setMinute(2)

      expect(time.value.value).toBe('01:02')
      expect(time.value.value).not.toContain('window')
    })
  })
})
