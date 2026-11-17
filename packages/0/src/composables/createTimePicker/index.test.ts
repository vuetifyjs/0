import { afterEach, describe, expect, it, vi } from 'vitest'

// Composables
import { createFormContext } from '#v0/composables/createForm'

import { createTimePicker } from './index'

// Utilities
import { isNull } from '#v0/utilities'
import { computed, createApp, customRef, effectScope, nextTick, shallowRef, watch } from 'vue'

// Types
import type { TimeHourCycle, TimePickerContext, TimePickerOptions } from './index'
import type { EffectScope, Ref } from 'vue'

const scopes: EffectScope[] = []

function setup (options?: TimePickerOptions): TimePickerContext {
  const scope = effectScope()
  scopes.push(scope)
  let time!: TimePickerContext
  scope.run(() => {
    time = createTimePicker(options)
  })
  return time
}

// A refused write is noticed one tick after the flush that follows it.
async function answer () {
  await nextTick()
  await nextTick()
}

// An owner that answers a write in its own later job, the way a parent
// re-render does. `reply` maps the written value to what the owner stores.
function lagging (start: string | null, reply: (next: string | null) => string | null = next => next) {
  let inner = start
  const writes: (string | null)[] = []
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
        void Promise.resolve().then(() => {
          const answered = reply(next)
          if (answered === inner) return
          inner = answered
          trigger()
        })
      },
    }
  })

  function put (next: string | null) {
    inner = next
    notify()
  }

  return { value, writes, put, held: () => inner }
}

function bump (next: string | null): string | null {
  return isNull(next) ? null : `${next.slice(0, 3)}${String(Number(next.slice(3)) + 1).padStart(2, '0')}`
}

async function rest (rounds = 4) {
  for (let index = 0; index < rounds; index++) await answer()
}

interface Pending {
  value: Ref<string | null>
  minuteStep: Ref<number>
  seconds: Ref<boolean>
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
  while (scopes.length > 0) scopes.pop()!.stop()
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
      const inner: string | null = '09:30'
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

      time.clear()
      time.commit('hour', 9)
      time.commit('minute', 30)

      expect(writes).toEqual(['09:31', '09:30', null, '09:30'])
    })

    it.each([
      ['the option first', true],
      ['the value first', false],
    ])('should take a null written in the same tick seconds turn on, with %s', async (_, first) => {
      const value = shallowRef<string | null>('10:20')
      const seconds = shallowRef(false)
      const time = setup({ value, seconds })

      if (first) seconds.value = true
      value.value = null
      if (!first) seconds.value = true
      await nextTick()

      expect(value.value).toBeNull()
      expect(time.hour.value).toBeNull()
    })

    it('should write one valid value when an edit follows an option change in the same tick', async () => {
      const value = shallowRef<string | null>('10:20')
      const seconds = shallowRef(false)
      const minuteStep = shallowRef(1)
      const time = setup({ value, seconds, minuteStep })
      const seen: (string | null)[] = []
      watch(value, next => seen.push(next), { flush: 'sync' })

      seconds.value = true
      time.commit('minute', 25)
      await nextTick()

      expect(seen).toEqual(['10:25:00'])

      minuteStep.value = 15
      time.commit('hour', 11)
      await nextTick()

      expect(seen).toEqual(['10:25:00', '11:30:00'])
    })

    it('should write one valid value when a step follows an option change in the same tick', async () => {
      const value = shallowRef<string | null>('10:20')
      const seconds = shallowRef(false)
      const time = setup({ value, seconds })
      const seen: (string | null)[] = []
      watch(value, next => seen.push(next), { flush: 'sync' })

      seconds.value = true
      time.step('minute', 1)
      await nextTick()

      expect(seen).toEqual(['10:21:00'])
    })

    it('should publish a pending change when an edit in the same tick turns out to do nothing', () => {
      const value = shallowRef<string | null>('14:28')
      const hourStep = shallowRef(1)
      const time = setup({ value, hourStep })

      hourStep.value = 5
      time.commit('period', 'pm')

      expect(value.value).toBe('15:28')
      expect(time.display.value).toBe('15:28')
    })

    it('should write one valid value when an edit follows an incoming value in the same tick', async () => {
      const value = shallowRef<string | null>('10:00')
      const time = setup({ value, minuteStep: 15 })
      const seen: (string | null)[] = []
      watch(value, next => seen.push(next), { flush: 'sync' })

      value.value = '12:07'
      time.commit('hour', 11)
      await nextTick()

      expect(seen).toEqual(['12:07', '11:00'])
    })

    it('should normalize incoming values that snap to the time already shown', async () => {
      const value = shallowRef<string | null>('10:00')
      setup({ value, minuteStep: 15 })

      for (const [raw, wanted] of [['10:07', '10:00'], ['10:05', '10:00'], ['11:05', '11:00'], ['12:05', '12:00']]) {
        value.value = raw!
        await answer()
        expect(value.value).toBe(wanted)
      }
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

  describe('a model that refuses a write', () => {
    it('should take over a value the model rewrites', () => {
      const store = shallowRef<string | null>('09:00')
      const value = computed<string | null>({
        get: () => store.value,
        set: next => {
          store.value = !isNull(next) && next > '12:00' ? '12:00' : next
        },
      })
      const time = setup({ value })

      time.commit('hour', 15)

      expect(store.value).toBe('12:00')
      expect(time.hour.value).toBe(12)
      expect(time.display.value).toBe('12:00')
    })

    it('should go back to the model when a write is dropped', async () => {
      const store = shallowRef<string | null>('12:00')
      const writes: (string | null)[] = []
      const value = computed<string | null>({
        get: () => store.value,
        set: next => {
          writes.push(next)
          if (isNull(next) || next <= '12:00') store.value = next
        },
      })
      const time = setup({ value })

      time.step('hour', 1)
      await answer()

      expect(store.value).toBe('12:00')
      expect(time.hour.value).toBe(12)
      expect(time.display.value).toBe('12:00')
      expect(writes).toEqual(['13:00'])

      time.step('hour', -1)
      await answer()

      expect(store.value).toBe('11:00')
      expect(time.hour.value).toBe(11)
      expect(writes).toEqual(['13:00', '11:00'])
    })

    it('should show a value the model keeps as given and write nothing more', async () => {
      const writes: (string | null)[] = []
      const minuteStep = shallowRef(15)
      const value = customRef<string | null>(track => ({
        get () {
          track()
          return '09:07'
        },
        set (next) {
          writes.push(next)
        },
      }))
      const time = setup({ value, minuteStep })

      expect(time.minute.value).toBe(0)

      await answer()
      await answer()

      expect(writes).toEqual(['09:00'])
      expect(time.minute.value).toBe(7)
      expect(time.display.value).toBe('09:07')

      minuteStep.value = 1
      await answer()

      expect(writes).toEqual(['09:00'])
      expect(time.display.value).toBe('09:07')

      minuteStep.value = 15
      await answer()

      expect(writes).toEqual(['09:00', '09:00'])
      expect(time.display.value).toBe('09:07')
    })

    it('should write once more, and no further, when the model replaces a write', async () => {
      const store = shallowRef<string | null>('10:00')
      const writes: (string | null)[] = []
      const value = computed<string | null>({
        get: () => store.value,
        set: next => {
          writes.push(next)
          store.value = !isNull(next) && next > '12:08' ? '12:08' : next
        },
      })
      const time = setup({ value, minuteStep: 15 })

      time.commit('hour', 15)
      await answer()
      await answer()

      expect(writes).toEqual(['15:00', '12:15'])
      expect(store.value).toBe('12:08')
      expect(time.display.value).toBe('12:08')
    })

    it('should stop after two writes when the model alters every write', async () => {
      const store = shallowRef<string | null>('09:00')
      const writes: (string | null)[] = []
      const value = computed<string | null>({
        get: () => store.value,
        set: next => {
          writes.push(next)
          store.value = isNull(next) ? null : `${next.slice(0, 3)}${String(Number(next.slice(3)) + 1).padStart(2, '0')}`
        },
      })
      const time = setup({ value, minuteStep: 2 })

      time.commit('minute', 10)
      await answer()
      await answer()
      await answer()

      expect(writes).toEqual(['09:10', '09:12'])
      expect(store.value).toBe('09:13')
      expect(time.display.value).toBe('09:13')

      time.commit('minute', 20)
      await answer()
      await answer()

      expect(writes).toEqual(['09:10', '09:12', '09:20', '09:22'])
      expect(time.display.value).toBe('09:23')
    })

    it('should not offer the model a value it has just altered', async () => {
      const store = shallowRef<string | null>('09:00')
      const writes: (string | null)[] = []
      const value = computed<string | null>({
        get: () => store.value,
        set: next => {
          writes.push(next)
          store.value = isNull(next) ? null : `${next.slice(0, 3)}${String(Number(next.slice(3)) + 1).padStart(2, '0')}`
        },
      })
      const time = setup({ value, minuteStep: 5 })

      time.commit('minute', 5)
      await answer()
      await answer()

      expect(writes).toEqual(['09:05'])
      expect(store.value).toBe('09:06')
      expect(time.display.value).toBe('09:06')
    })

    it('should not warn again when it takes back a value it already warned about', async () => {
      using spy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const value = customRef<string | null>(track => ({
        get () {
          track()
          return 'nope'
        },
        set () {},
      }))
      const time = setup({ value })

      await answer()
      await answer()

      expect(time.display.value).toBeNull()
      expect(spy).toHaveBeenCalledTimes(1)
    })

    it.each([
      ['before the check is queued', 0],
      ['with the check already queued', 1],
    ])('should leave the fields alone when its scope stops %s', async (_, ticks) => {
      const value = customRef<string | null>(track => ({
        get () {
          track()
          return '09:07'
        },
        set () {},
      }))
      const time = setup({ value, minuteStep: 15 })

      for (let index = 0; index < ticks; index++) await nextTick()
      scopes.at(-1)!.stop()
      await rest()

      expect(time.minute.value).toBe(0)
    })
  })

  describe('an owner that answers later', () => {
    it('should stop after two writes when the owner alters every write', async () => {
      const owner = lagging('09:00', bump)
      const time = setup({ value: owner.value, minuteStep: 2 })

      time.commit('minute', 10)
      await rest(8)

      expect(owner.writes).toEqual(['09:10', '09:12'])
      expect(time.display.value).toBe('09:13')
    })

    it('should normalize a value the owner sets after an exchange used its writes', async () => {
      const owner = lagging('09:00', bump)
      const time = setup({ value: owner.value, minuteStep: 2 })

      time.commit('minute', 10)
      await rest()
      owner.put('10:05')
      await rest()

      expect(owner.writes).toEqual(['09:10', '09:12', '10:06', '10:08'])
      expect(time.display.value).toBe('10:09')
    })

    it('should normalize each value an accepting owner sets after an edit', async () => {
      const owner = lagging('09:00')
      const time = setup({ value: owner.value, minuteStep: 15 })

      time.commit('minute', 30)
      await rest()

      for (const hour of ['10', '11', '12']) {
        owner.put(`${hour}:07`)
        await rest()
        expect(owner.held()).toBe(`${hour}:00`)
      }

      expect(time.display.value).toBe('12:00')
    })

    it('should keep a half-entered time when the owner accepts the null a tick later', async () => {
      const owner = lagging('11:30')
      const time = setup({ value: owner.value })

      time.commit('minute', null)
      await rest()

      expect(owner.held()).toBeNull()
      expect(time.hour.value).toBe(11)
      expect(time.minute.value).toBeNull()
    })

    it.each([
      ['a microtask', () => Promise.resolve()],
      ['a tick', () => nextTick()],
      ['a macrotask', () => new Promise<void>(resolve => setTimeout(resolve, 0))],
    ])('should keep a half-entered time when a second edit comes %s after the first', async (_, gap) => {
      const owner = lagging('09:30:10')
      const time = setup({ value: owner.value, seconds: true })

      time.step('hour', 1)
      await gap()
      time.commit('hour', null)
      await gap()
      time.step('minute', -1)
      await rest()

      expect(owner.held()).toBeNull()
      expect(time.hour.value).toBeNull()
      expect(time.minute.value).toBe(29)
      expect(time.second.value).toBe(10)

      time.step('hour', 1)
      await rest()

      expect(owner.held()).toBe('00:29:10')
    })

    it('should let a step reach a value again after the model moved away from it', async () => {
      const owner = lagging('10:00')
      const time = setup({ value: owner.value })

      time.step('minute', 1)
      time.step('minute', 1)
      await rest()
      expect(owner.held()).toBe('10:02')

      time.step('minute', -1)
      time.step('minute', -1)
      await rest()
      expect(owner.held()).toBe('10:00')
    })
  })

  describe('a value taken as given', () => {
    function stubborn (held: string) {
      const writes: (string | null)[] = []
      const value = customRef<string | null>(track => ({
        get () {
          track()
          return held
        },
        set (next) {
          writes.push(next)
        },
      }))
      return { value, writes }
    }

    it('should write once for an edit the model refuses and return to its value', async () => {
      const { value, writes } = stubborn('09:07')
      const time = setup({ value, minuteStep: 15 })

      await rest()
      expect(writes).toEqual(['09:00'])

      time.commit('minute', 30)
      await rest()

      expect(writes).toEqual(['09:00', '09:30'])
      expect(time.display.value).toBe('09:07')
    })

    it.each([
      ['04:50', -1, '04:45'],
      ['12:08', 1, '12:15'],
    ])('should step %s by %i from what the field shows', async (held, count, wanted) => {
      const { value, writes } = stubborn(held)
      const time = setup({ value, minuteStep: 15 })

      await rest()
      writes.length = 0

      time.step('minute', count)

      expect(writes).toEqual([wanted])
    })

    it('should normalize the other fields when one is edited', async () => {
      const { value, writes } = stubborn('09:07')
      const time = setup({ value, minuteStep: 15 })

      await rest()
      writes.length = 0

      time.step('hour', 1)

      expect(writes).toEqual(['10:00'])
    })

    it('should write nothing for a call that changes nothing', async () => {
      const { value, writes } = stubborn('09:07')
      const time = setup({ value, minuteStep: 15 })

      await rest()
      writes.length = 0

      time.step('hour', 0)
      time.step('minute', Number.NaN)
      time.commit('minute', Number.NaN)
      time.commit('second', 5)
      time.step('second', 1)
      time.commit('period', 'pm')
      time.step('period', 1)
      await rest()

      expect(writes).toEqual([])
      expect(time.display.value).toBe('09:07')
    })

    it('should step from the shown minute after the owner insisted on an incoming value', async () => {
      let held: string | null = '09:00'
      const writes: (string | null)[] = []
      let notify!: () => void
      const value = customRef<string | null>((track, trigger) => {
        notify = trigger
        return {
          get () {
            track()
            return held
          },
          set (next) {
            writes.push(next)
          },
        }
      })
      const time = setup({ value, minuteStep: 15 })

      await rest()
      held = '09:07'
      notify()
      await rest()

      expect(writes).toEqual(['09:00'])
      expect(time.display.value).toBe('09:07')

      writes.length = 0
      time.step('minute', -1)

      expect(writes).toEqual(['09:00'])
    })

    it.each([
      ['seconds', false],
      ['disabled', false],
      ['minuteStep', 15],
    ] as const)('should write nothing when %s changes and changes back in one tick', async (name, start) => {
      const { value, writes } = stubborn('09:07')
      const option = shallowRef<boolean | number>(start)
      const time = setup({ value, minuteStep: 15, [name]: option })

      await rest()
      writes.length = 0

      option.value = name === 'minuteStep' ? 1 : true
      option.value = start
      await rest()

      expect(writes).toEqual([])
      expect(time.display.value).toBe('09:07')
    })

    it('should write again when an option really changes', async () => {
      const { value, writes } = stubborn('09:07')
      const disabled = shallowRef(false)
      setup({ value, minuteStep: 15, disabled })

      await rest()
      writes.length = 0

      disabled.value = true
      await rest()
      disabled.value = false
      await rest()

      expect(writes).toEqual(['09:00'])
    })

    it('should write nothing when an empty field is cleared over a model the fields cannot show', async () => {
      using spy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const { value, writes } = stubborn('bogus')
      const time = setup({ value, seconds: true })

      await rest()
      writes.length = 0

      time.commit('hour', null)
      time.commit('minute', null)
      time.commit('second', null)
      await rest()

      expect(writes).toEqual([])
      expect(spy).toHaveBeenCalledTimes(1)
    })

    it('should write nothing when the period committed is the one shown', async () => {
      const { value, writes } = stubborn('09:07')
      const time = setup({ value, minuteStep: 15, hourCycle: 'h12' })

      await rest()
      writes.length = 0

      time.commit('period', 'am')
      await rest()

      expect(writes).toEqual([])
      expect(time.display.value).toBe('09:07')
    })
  })

  describe('a write that throws', () => {
    function fragile (start: string | null) {
      const state = { held: start, fail: false, writes: [] as (string | null)[] }
      const value = customRef<string | null>((track, trigger) => ({
        get () {
          track()
          return state.held
        },
        set (next) {
          if (state.fail) throw new Error('refused')
          state.writes.push(next)
          state.held = next
          trigger()
        },
      }))
      return { value, state }
    }

    it('should write the same value again once the model stops throwing', () => {
      const { value, state } = fragile('09:00')
      const time = setup({ value })

      state.fail = true
      expect(() => time.commit('minute', 30)).toThrow('refused')
      expect(time.display.value).toBe('09:00')

      state.fail = false
      time.commit('minute', 30)

      expect(state.writes).toEqual(['09:30'])
      expect(state.held).toBe('09:30')
    })

    it('should keep the fields entered before a call whose write throws', () => {
      const { value, state } = fragile(null)
      const time = setup({ value, hourCycle: 'h12' })

      time.commit('period', 'pm')
      time.commit('hour', 9)

      state.fail = true
      expect(() => time.commit('minute', 30)).toThrow('refused')

      expect(time.hour.value).toBe(9)
      expect(time.period.value).toBe('pm')
      expect(time.minute.value).toBeNull()

      expect(() => time.clear()).not.toThrow()
      expect(time.hour.value).toBeNull()
    })

    it.each([
      ['an incoming value', '10:00', '10:00', (o: Pending) => {
        o.value.value = '10:07'
      }],
      ['a step change', '09:07', '09:00', (o: Pending) => {
        o.minuteStep.value = 15
      }],
      ['seconds turning on', '09:30', '09:30:00', (o: Pending) => {
        o.seconds.value = true
      }],
    ] as const)('should still apply %s when an edit in the same tick throws', async (name, start, wanted, change) => {
      const { value, state } = fragile(start)
      const minuteStep = shallowRef(name === 'a step change' ? 1 : 15)
      const seconds = shallowRef(false)
      const time = setup({ value, minuteStep, seconds })

      change({ value, minuteStep, seconds })
      state.fail = true
      expect(() => time.step('hour', 1)).toThrow('refused')
      state.fail = false
      await rest()

      expect(state.held).toBe(wanted)
      expect(time.display.value).toBe(wanted)
    })

    it('should keep every field when the write of a clear throws', () => {
      const { value, state } = fragile('15:30:20')
      const time = setup({ value, seconds: true, hourCycle: 'h12' })

      state.fail = true
      expect(() => time.clear()).toThrow('refused')

      expect(time.hour.value).toBe(3)
      expect(time.minute.value).toBe(30)
      expect(time.second.value).toBe(20)
      expect(time.period.value).toBe('pm')
      expect(time.display.value).toBe('15:30:20')
    })

    it('should put the second back when its write throws', () => {
      const { value, state } = fragile('09:30:20')
      const time = setup({ value, seconds: true })

      state.fail = true
      expect(() => time.step('second', 1)).toThrow('refused')
      expect(time.second.value).toBe(20)

      expect(() => time.commit('second', null)).toThrow('refused')
      expect(time.second.value).toBe(20)
    })

    it('should write a normalized reply that equals a value whose write threw meanwhile', async () => {
      let held: string | null = '10:15'
      let fail = false
      let release!: () => void
      const writes: (string | null)[] = []

      // The owner withholds its answer to the first write, then answers it
      // with a value off the grid. Later writes are taken at once.
      const value = customRef<string | null>((track, trigger) => ({
        get () {
          track()
          return held
        },
        set (next) {
          if (fail) throw new Error('refused')
          writes.push(next)

          if (writes.length === 1) {
            release = () => {
              held = '10:07'
              trigger()
            }
            return
          }

          held = next
          trigger()
        },
      }))
      const time = setup({ value, minuteStep: 15 })

      time.step('minute', 1)
      expect(writes).toEqual(['10:30'])

      fail = true
      expect(() => time.commit('minute', 0)).toThrow('refused')
      fail = false

      release()
      await rest()

      expect(writes).toEqual(['10:30', '10:00'])
      expect(held).toBe('10:00')
      expect(time.display.value).toBe('10:00')
    })

    it('should not offer a value again after an edit that began a new exchange threw', async () => {
      let held: string | null = '10:15'
      let fail = false
      let release!: () => void
      const writes: (string | null)[] = []

      // The owner withholds its answer to the first write, then answers it
      // with a value that normalizes back to what was written.
      const value = customRef<string | null>((track, trigger) => ({
        get () {
          track()
          return held
        },
        set (next) {
          if (fail) throw new Error('refused')
          writes.push(next)

          if (writes.length === 1) {
            release = () => {
              held = '10:31'
              trigger()
            }
            return
          }

          held = next
          trigger()
        },
      }))
      const time = setup({ value, minuteStep: 15 })

      time.step('minute', 1)
      expect(writes).toEqual(['10:30'])

      fail = true
      expect(() => time.commit('minute', 0)).toThrow('refused')
      fail = false

      release()
      await rest()

      expect(writes).toEqual(['10:30'])
      expect(held).toBe('10:31')
      expect(time.display.value).toBe('10:31')
    })

    it('should give an incoming value its whole exchange after an edit threw', async () => {
      const store = shallowRef<string | null>('09:00')
      const state = { fail: false, writes: [] as (string | null)[] }
      const value = computed<string | null>({
        get: () => store.value,
        set: next => {
          if (state.fail) throw new Error('refused')
          state.writes.push(next)
          store.value = bump(next)
        },
      })
      const time = setup({ value, minuteStep: 2 })

      await rest()
      state.writes.length = 0

      state.fail = true
      expect(() => time.commit('minute', 30)).toThrow('refused')
      state.fail = false

      store.value = '10:05'
      await rest()

      expect(state.writes).toEqual(['10:06', '10:08'])
      expect(time.display.value).toBe('10:09')
    })

    it('should offer a value again in a later exchange after its write threw', async () => {
      const { value, state } = fragile('09:00')
      const minuteStep = shallowRef(1)
      const time = setup({ value, minuteStep })

      state.fail = true
      expect(() => time.commit('minute', 30)).toThrow('refused')
      state.fail = false

      expect(time.display.value).toBe('09:00')

      value.value = '09:31'
      state.writes.length = 0
      minuteStep.value = 30
      await rest()

      expect(state.writes).toEqual(['09:30'])
      expect(state.held).toBe('09:30')
    })

    it('should still normalize an incoming value after a second write threw', async () => {
      const store = shallowRef<string | null>('09:00')
      const writes: (string | null)[] = []
      let fail = false
      const value = computed<string | null>({
        get: () => store.value,
        set: next => {
          if (fail) throw new Error('refused')
          writes.push(next)
          store.value = bump(next)
        },
      })
      // The second write happens in a flush, so the error surfaces through
      // the app's handler instead of the caller.
      const caught: unknown[] = []
      const app = createApp({
        setup () {
          createTimePicker({ value, minuteStep: 2 }).commit('minute', 10)
          fail = true
          return () => null
        },
      })
      app.config.errorHandler = error => caught.push(error)
      app.mount(document.createElement('div'))

      await rest()
      fail = false

      store.value = '10:05'
      await rest()
      app.unmount()

      expect(caught).toHaveLength(1)
      expect(writes).toEqual(['09:10', '10:06', '10:08'])
    })
  })

  describe('display', () => {
    it('should follow the fields while they are complete', () => {
      const time = setup({ value: shallowRef('09:30') })

      expect(time.display.value).toBe('09:30')

      time.commit('minute', null)
      expect(time.display.value).toBeNull()
    })

    it('should show a blocked value as given', () => {
      const time = setup({ value: shallowRef('09:07:45'), minuteStep: 15, readonly: true })

      expect(time.value.value).toBe('09:07:45')
      expect(time.display.value).toBe('09:07')
    })

    it('should be null for a model the fields cannot show', () => {
      using spy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const time = setup({ value: shallowRef('nope'), readonly: true })

      expect(time.value.value).toBe('nope')
      expect(time.display.value).toBeNull()
      expect(spy).toHaveBeenCalledTimes(1)
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

    it('should reset the remembered period when the value is set to null', async () => {
      const value = shallowRef<string | null>('15:00')
      const time = setup({ hourCycle: 'h12', value })

      value.value = null
      await nextTick()

      expect(time.period.value).toBe('am')
    })

    it('should reset the remembered period when the value cannot be parsed', async () => {
      using spy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const value = shallowRef<string | null>('15:00')
      const time = setup({ hourCycle: 'h12', value })

      value.value = 'abc'
      await nextTick()

      expect(value.value).toBeNull()
      expect(time.period.value).toBe('am')
      expect(spy).toHaveBeenCalledTimes(1)
    })

    it.each([['h12'], ['h23']] as const)('should snap a fractional %s hour without rounding it first', hourCycle => {
      const time = setup({ hourCycle, hourStep: 2 })

      time.commit('minute', 0)
      time.commit('hour', 2.5)

      expect(time.value.value).toBe('02:00')
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

    it('should give an edit the same result in the tick a value arrives as a tick later', async () => {
      const value = shallowRef<string | null>('10:00')
      const time = setup({ value, min: '05:00', max: '14:46' })

      value.value = '19:41'
      time.commit('minute', 6)
      expect(value.value).toBe('14:06')

      value.value = '19:41'
      await nextTick()
      time.commit('minute', 6)
      expect(value.value).toBe('14:06')
    })

    it('should snap an incoming value before stepping it in the same tick', () => {
      const value = shallowRef<string | null>(null)
      const time = setup({ value, minuteStep: 15 })

      value.value = '10:07'
      time.step('minute', 1)
      expect(value.value).toBe('10:15')

      value.value = '10:53'
      time.step('minute', -1)
      expect(value.value).toBe('10:30')
    })

    it('should step an off-grid value in an empty range from where it sits', () => {
      const value = shallowRef<string | null>('10:08')
      const time = setup({ value, minuteStep: 15, min: '10:05', max: '10:10' })

      expect(value.value).toBe('10:08')

      time.step('minute', 1)
      expect(value.value).toBe('10:10')

      time.step('minute', -1)
      expect(value.value).toBe('10:05')
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

    it('should resnap when the hour step changes', async () => {
      const hourStep = shallowRef(1)
      const time = setup({ hourStep, value: shallowRef('13:00') })

      hourStep.value = 6
      await nextTick()

      expect(time.value.value).toBe('12:00')
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

    it('should clamp again when max changes', async () => {
      const max = shallowRef<string | null>(null)
      const time = setup({ max, value: shallowRef('18:00') })

      max.value = '17:00'
      await nextTick()

      expect(time.value.value).toBe('17:00')
    })

    it('should read an undefined bound or step as unset', () => {
      const time = setup({
        min: () => undefined,
        max: () => undefined,
        hourStep: () => undefined,
        minuteStep: () => undefined,
        secondStep: () => undefined,
        seconds: true,
        value: shallowRef('10:00:00'),
      })

      time.step('hour', 1)
      time.step('minute', 1)
      time.step('second', 1)

      expect(time.value.value).toBe('11:01:01')
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

  describe('bounds and the grid', () => {
    it.each([
      [{ minuteStep: 15, min: '10:07' }, '09:00', '10:15'],
      [{ minuteStep: 15, max: '17:10' }, '23:59', '17:00'],
      [{ minuteStep: 15, max: '17:10' }, '17:10', '17:00'],
      [{ minuteStep: 15, min: '17:10' }, '17:10', '17:15'],
      [{ hourStep: 7, min: '16:57' }, '00:00', '21:00'],
      [{ hourStep: 5, min: '13:10' }, '08:00', '15:00'],
      [{ hourCycle: 'h12', hourStep: 5, max: '14:59' }, '23:00', '10:59'],
      [{ seconds: true, minuteStep: 15, secondStep: 20, min: '09:59:50' }, '08:00:00', '10:00:00'],
      [{ seconds: true, minuteStep: 15, secondStep: 20, max: '10:14:10' }, '12:00:00', '10:00:40'],
      [{ max: '17:00' }, '17:30', '17:00'],
    ] as const)('should move %j from %s to the nearest on-grid time in range', async (options, raw, wanted) => {
      const value = shallowRef<string | null>(raw)
      const disabled = shallowRef(false)
      setup({ ...options, value, disabled })

      expect(value.value).toBe(wanted)

      disabled.value = true
      await nextTick()
      disabled.value = false
      await nextTick()
      expect(value.value).toBe(wanted)

      const again = shallowRef<string | null>(wanted)
      setup({ ...options, value: again })
      expect(again.value).toBe(wanted)
    })

    it('should leave no dead key next to a bound that is off the grid', () => {
      const time = setup({ hourStep: 7, min: '16:57', value: shallowRef('00:00') })

      expect(time.value.value).toBe('21:00')

      time.step('minute', 1)
      expect(time.value.value).toBe('21:01')

      time.step('minute', -2)
      expect(time.value.value).toBe('21:59')

      time.step('hour', 1)
      expect(time.value.value).toBe('21:00')
    })

    it('should stop a 12-hour step at an on-grid upper bound', () => {
      const time = setup({ hourCycle: 'h12', max: '17:00', value: shallowRef('17:00') })

      time.step('hour', 1)

      expect(time.value.value).toBe('17:00')
    })

    it.each([
      [{ minuteStep: 15, min: '10:00', max: '10:15' }],
      [{ minuteStep: 15, min: '10:40', max: '11:05' }],
      [{ hourStep: 7, min: '16:57' }],
      [{ hourCycle: 'h12', hourStep: 5, minuteStep: 30, min: '09:10', max: '15:10' }],
      [{ seconds: true, minuteStep: 30, secondStep: 30, min: '23:29:40', max: '23:30:40' }],
    ] as const)('should always leave a step that changes the value: %j', options => {
      const time = setup({ ...options, value: shallowRef('00:00:00') })
      const parts = ['hour', 'minute', 'second'] as const
      const seen = new Set<string | null>()

      for (let index = 0; index < 8; index++) {
        const before = time.value.value
        seen.add(before)

        const moved = parts.some(part => [1, -1].some(count => {
          time.step(part, count)
          if (time.value.value !== before) return true
          return false
        }))

        expect(moved).toBe(true)
      }

      expect(seen.size).toBeGreaterThan(1)
    })

    it.each([
      [{ seconds: true, secondStep: 20, min: '09:10:50' }, '08:00:00', '09:11:00'],
      [{ minuteStep: 15, min: '10:07', max: '10:15' }, '09:00', '10:15'],
      [{ min: '10:00', max: '10:00' }, '12:00', '10:00'],
      [{ min: '09:00:30' }, '09:00', '09:00'],
      [{ hourCycle: 'h12', hourStep: 7 }, '11:00', '07:00'],
    ] as const)('should normalize %j from %s to %s', (options, raw, wanted) => {
      const value = shallowRef<string | null>(raw)
      setup({ ...options, value })

      expect(value.value).toBe(wanted)
    })

    it.each([
      [{ minuteStep: 15, min: '23:50' }, '10:00', '23:50'],
      [{ minuteStep: 15, min: '23:50' }, '23:55', '23:55'],
      [{ seconds: true, secondStep: 20, min: '10:00:05', max: '10:00:15' }, '10:00:00', '10:00:05'],
      [{ minuteStep: 15, min: '10:07', max: '10:10' }, '12:00', '10:10'],
    ] as const)('should clamp without snapping in the empty range %j: %s to %s', (options, raw, wanted) => {
      const value = shallowRef<string | null>(raw)
      setup({ ...options, value })

      expect(value.value).toBe(wanted)
    })

    it('should only clamp when the range holds no on-grid time', async () => {
      const value = shallowRef<string | null>('09:00')
      const disabled = shallowRef(false)
      const time = setup({ value, disabled, minuteStep: 15, min: '10:07', max: '10:10' })

      expect(value.value).toBe('10:07')

      time.step('minute', 1)
      expect(value.value).toBe('10:10')

      time.step('minute', 1)
      time.step('hour', 1)
      expect(value.value).toBe('10:10')

      value.value = '10:08'
      await nextTick()
      expect(value.value).toBe('10:08')

      disabled.value = true
      await nextTick()
      disabled.value = false
      await nextTick()
      expect(value.value).toBe('10:08')
    })

    it('should snap and clamp the hour of a period commit as a numeric commit would', () => {
      const options = { hourCycle: 'h12', hourStep: 20, min: '01:12', max: '16:44' } as const
      const value = shallowRef<string | null>('01:12')
      const time = setup({ ...options, value })

      expect(value.value).toBe('01:12')

      time.commit('period', 'pm')
      expect(value.value).toBe('16:44')

      const numeric = shallowRef<string | null>('13:12')
      setup({ ...options, value: numeric, disabled: shallowRef(false) }).commit('hour', 1)
      expect(numeric.value).toBe('16:44')
    })

    it('should do nothing when the period committed is the current one', () => {
      const time = setup({
        hourCycle: 'h12',
        hourStep: 5,
        min: '13:10',
        max: '13:20',
        value: shallowRef('13:10'),
      })

      time.commit('period', 'pm')

      expect(time.value.value).toBe('13:10')
    })
  })

  describe('second field', () => {
    it('should move the second on its own step', () => {
      const time = setup({ seconds: true, secondStep: 20, minuteStep: 15, value: shallowRef('10:00:00') })

      time.step('second', 1)
      expect(time.value.value).toBe('10:00:20')

      time.step('second', -2)
      expect(time.value.value).toBe('10:00:40')

      time.commit('second', 58)
      expect(time.value.value).toBe('10:00:40')
      expect(time.grid('second')).toEqual({ min: 0, max: 40, step: 20 })
    })

    it('should clear only the second', () => {
      const time = setup({ seconds: true, value: shallowRef('10:15:20') })

      time.commit('second', null)

      expect(time.value.value).toBeNull()
      expect(time.minute.value).toBe(15)
      expect(time.second.value).toBeNull()
    })

    it('should resnap when the second step changes', async () => {
      const secondStep = shallowRef(1)
      const time = setup({ seconds: true, secondStep, value: shallowRef('10:00:37') })

      secondStep.value = 15
      await nextTick()

      expect(time.value.value).toBe('10:00:30')
    })

    it('should start at zero when seconds turn on after the incoming seconds were dropped', async () => {
      const seconds = shallowRef(false)
      const value = shallowRef<string | null>('09:30:45')
      setup({ seconds, value })

      expect(value.value).toBe('09:30')

      seconds.value = true
      await nextTick()

      expect(value.value).toBe('09:30:00')
    })

    it('should not keep a second committed while seconds were off', async () => {
      const seconds = shallowRef(false)
      const time = setup({ seconds, value: shallowRef('09:30') })

      time.commit('second', 7)
      seconds.value = true
      await nextTick()

      expect(time.value.value).toBe('09:30:00')
    })

    it('should not keep a second stepped while seconds were off', async () => {
      const seconds = shallowRef(false)
      const time = setup({ seconds, value: shallowRef('09:30') })

      time.step('second', 1)
      time.step('second', 1)
      seconds.value = true
      await nextTick()

      expect(time.value.value).toBe('09:30:00')
    })

    it('should write nothing when a second is committed or stepped while seconds are off', () => {
      const value = shallowRef<string | null>('09:30')
      const time = setup({ value })
      const seen: (string | null)[] = []
      watch(value, next => seen.push(next), { flush: 'sync' })

      time.commit('second', 7)
      time.step('second', 1)

      expect(time.second.value).toBeNull()
      expect(seen).toEqual([])
    })

    it('should leave the second empty when stepped while off on a partial time', async () => {
      const seconds = shallowRef(false)
      const time = setup({ seconds })

      time.commit('hour', 9)
      time.step('second', 1)
      seconds.value = true
      await nextTick()

      expect(time.second.value).toBeNull()
    })

    it('should leave a cleared second empty after seconds were turned on at runtime', async () => {
      const seconds = shallowRef(false)
      const minuteStep = shallowRef(1)
      const time = setup({ seconds, minuteStep, value: shallowRef('09:30') })

      seconds.value = true
      await nextTick()
      time.commit('second', null)
      minuteStep.value = 5
      await nextTick()

      expect(time.value.value).toBeNull()
    })

    it('should leave a cleared second empty when another option changes', async () => {
      const minuteStep = shallowRef(1)
      const time = setup({ seconds: true, minuteStep, value: shallowRef('09:30:15') })

      time.commit('second', null)
      minuteStep.value = 5
      await nextTick()

      expect(time.second.value).toBeNull()
      expect(time.value.value).toBeNull()
    })

    it.each([['disabled'], ['readonly']] as const)('should keep incoming seconds while %s and seconds turn on', async flag => {
      const value = shallowRef<string | null>('09:30:45')
      const seconds = shallowRef(false)
      const blocked = shallowRef(true)
      const time = setup({ value, seconds, [flag]: blocked })

      seconds.value = true
      await nextTick()

      expect(time.second.value).toBe(45)
      expect(value.value).toBe('09:30:45')

      blocked.value = false
      await nextTick()

      expect(value.value).toBe('09:30:45')
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
  describe('input', () => {
    it('should fail required until every enabled field is set', async () => {
      const time = setup({ required: true })

      expect(time.input.isValid.value).toBeNull()
      expect(await time.input.validate()).toBe(false)
      expect(time.input.errors.value).toHaveLength(1)

      time.commit('hour', 9)
      expect(await time.input.validate()).toBe(false)

      time.commit('minute', 30)
      expect(await time.input.validate()).toBe(true)
      expect(time.input.errors.value).toEqual([])
      expect(time.input.state.value).toBe('valid')
    })

    it('should validate the normalized model value', async () => {
      const seen: unknown[] = []
      const time = setup({
        value: shallowRef<string | null>('09:07'),
        minuteStep: 15,
        rules: [value => {
          seen.push(value)
          return value === '09:00' || 'Not nine'
        }],
      })

      expect(await time.input.validate()).toBe(true)

      time.step('minute', 1)
      expect(await time.input.validate()).toBe(false)
      expect(seen).toEqual(['09:00', '09:15'])
      expect(time.input.errors.value).toEqual(['Not nine'])
    })

    it('should force invalid through error and merge errorMessages', async () => {
      const error = shallowRef(false)
      const errorMessages = shallowRef<string[]>([])
      const time = setup({ value: shallowRef<string | null>('09:00'), error, errorMessages })

      expect(await time.input.validate()).toBe(true)
      expect(time.input.isValid.value).toBe(true)

      error.value = true
      expect(time.input.isValid.value).toBe(false)

      error.value = false
      errorMessages.value = ['Taken']
      expect(time.input.isValid.value).toBe(false)
      expect(time.input.errors.value).toEqual(['Taken'])
    })

    it('should stay pristine when the initial value is normalized', async () => {
      const value = shallowRef<string | null>('09:07')
      const time = setup({ value, minuteStep: 15 })

      expect(value.value).toBe('09:00')
      expect(time.input.isPristine.value).toBe(true)
      expect(time.input.isDirty.value).toBe(true)

      time.step('minute', 1)
      expect(time.input.isPristine.value).toBe(false)

      time.step('minute', -1)
      expect(time.input.isPristine.value).toBe(true)

      value.value = '10:07'
      await rest()
      expect(value.value).toBe('10:00')
      expect(time.input.isPristine.value).toBe(false)
    })

    it('should stay pristine when an owner that answers late takes the normalized value', async () => {
      const { value, held } = lagging('09:07')
      const time = setup({ value, minuteStep: 15 })

      await rest()

      expect(held()).toBe('09:00')
      expect(time.input.isPristine.value).toBe(true)
    })

    it.each([['disabled'], ['readonly']] as const)('should stay pristine when a %s picker is released and normalizes', async flag => {
      const blocked = shallowRef(true)
      const value = shallowRef<string | null>('09:07')
      const time = setup({ value, minuteStep: 15, [flag]: blocked })

      blocked.value = false
      await rest()

      expect(value.value).toBe('09:00')
      expect(time.input.isPristine.value).toBe(true)
    })

    it('should reset to the initial value and clear the validation state', async () => {
      const value = shallowRef<string | null>('09:07')
      const time = setup({ value, minuteStep: 15, rules: [next => next === '09:00' || 'Moved'] })

      time.step('hour', 1)
      time.input.isTouched.value = true
      expect(await time.input.validate()).toBe(false)

      time.input.reset()
      await rest()

      expect(value.value).toBe('09:00')
      expect(time.display.value).toBe('09:00')
      expect(time.input.isPristine.value).toBe(true)
      expect(time.input.isTouched.value).toBe(false)
      expect(time.input.isValid.value).toBeNull()
      expect(time.input.errors.value).toEqual([])
    })

    it('should drop a partly entered time on reset', () => {
      const time = setup({ hourCycle: 'h12' })

      time.commit('period', 'pm')
      time.commit('hour', 9)
      expect(time.value.value).toBeNull()

      time.input.reset()

      expect(time.hour.value).toBeNull()
      expect(time.period.value).toBe('am')
      expect(time.value.value).toBeNull()
    })

    it('should give an edit after reset the reset value to start from', () => {
      const value = shallowRef<string | null>('09:00')
      const time = setup({ value })

      time.step('hour', 3)
      time.input.reset()
      time.step('minute', 1)

      expect(value.value).toBe('09:01')
    })

    it.each([['disabled'], ['readonly']] as const)('should not write the model when a %s picker validates or resets', async flag => {
      const value = shallowRef<string | null>('09:07')
      const seen: unknown[] = []
      const writes: (string | null)[] = []
      const time = setup({
        value,
        minuteStep: 15,
        [flag]: true,
        rules: [next => {
          seen.push(next)
          return 'Never'
        }],
      })

      value.value = '10:07'
      await rest()
      watch(value, next => writes.push(next), { flush: 'sync' })

      time.input.isTouched.value = true
      expect(await time.input.validate()).toBe(false)

      time.input.reset()
      await rest()

      expect(seen).toEqual(['10:07'])
      expect(writes).toEqual([])
      expect(value.value).toBe('10:07')
      expect(time.display.value).toBe('10:07')
      expect(time.input.isValid.value).toBeNull()
      expect(time.input.isTouched.value).toBe(false)
      expect(time.input[flag === 'disabled' ? 'isDisabled' : 'isReadonly'].value).toBe(true)
    })

    it('should drop a partly entered time when a picker blocked afterwards resets', () => {
      const disabled = shallowRef(false)
      const time = setup({ disabled })

      time.commit('hour', 9)
      disabled.value = true
      time.input.reset()

      expect(time.hour.value).toBeNull()
      expect(time.value.value).toBeNull()
    })

    it('should report a time completed from entered fields as changed', async () => {
      const seconds = shallowRef(true)
      const value = shallowRef<string | null>(null)
      const time = setup({ value, seconds })

      time.commit('hour', 9)
      time.commit('minute', 30)
      expect(value.value).toBeNull()
      expect(time.input.isPristine.value).toBe(true)

      seconds.value = false
      await rest()

      expect(value.value).toBe('09:30')
      expect(time.input.isPristine.value).toBe(false)
    })

    it('should stay pristine when a call that changes nothing publishes an option change', async () => {
      const minuteStep = shallowRef(5)
      const value = shallowRef<string | null>('09:05')
      const time = setup({ value, minuteStep, hourCycle: 'h12' })

      minuteStep.value = 15
      time.commit('period', 'am')
      await rest()

      expect(value.value).toBe('09:00')
      expect(time.input.isPristine.value).toBe(true)
    })

    it('should stay pristine when an option normalizes a value the owner put back after refusing an edit', async () => {
      const minuteStep = shallowRef(5)
      // The owner keeps the hour at nine.
      const pinned = lagging('09:05', next => (next?.startsWith('09') ? next : '09:05'))
      const time = setup({ value: pinned.value, minuteStep })
      await rest()

      time.step('hour', 1)
      await rest()
      expect(pinned.held()).toBe('09:05')
      expect(time.display.value).toBe('09:05')

      minuteStep.value = 15
      await rest()

      expect(pinned.held()).toBe('09:00')
      expect(time.input.isPristine.value).toBe(true)
    })

    it('should stay pristine after a commit to the value a field already holds', async () => {
      const value = shallowRef<string | null>('00:05')
      const minuteStep = shallowRef(5)
      const time = setup({ value, minuteStep })

      time.commit('hour', 0)
      minuteStep.value = 15
      await rest()

      expect(value.value).toBe('00:00')
      expect(time.input.isPristine.value).toBe(true)
    })

    it('should stay pristine through a later normalization when the write of an edit threw', async () => {
      let held: string | null = '09:05'
      let fail = false
      const value = customRef<string | null>((track, trigger) => ({
        get () {
          track()
          return held
        },
        set (next) {
          if (fail) throw new Error('refused')
          held = next
          trigger()
        },
      }))
      const minuteStep = shallowRef(5)
      const time = setup({ value, minuteStep })

      fail = true
      expect(() => time.step('hour', 1)).toThrow('refused')
      fail = false

      minuteStep.value = 15
      await rest()

      expect(held).toBe('09:00')
      expect(time.input.isPristine.value).toBe(true)
    })

    function manual (start: string | null) {
      const state = { held: start, asked: undefined as string | null | undefined }
      let notify!: () => void
      const value = customRef<string | null>((track, trigger) => {
        notify = trigger
        return {
          get () {
            track()
            return state.held
          },
          set (next) {
            state.asked = next
          },
        }
      })

      function put (next: string | null | undefined) {
        state.held = next ?? null
        notify()
      }

      return { value, state, put }
    }

    it('should count an edit and a value from outside as supplied, and its own normalizing as not', async () => {
      const value = shallowRef<string | null>('09:07')
      const minuteStep = shallowRef(15)
      const blocked = shallowRef(false)
      const time = setup({ value, minuteStep, disabled: blocked })

      expect(value.value).toBe('09:00')
      expect(time.supplied.value).toBe(0)

      time.step('minute', 1)
      expect(time.supplied.value).toBe(1)

      minuteStep.value = 30
      await rest()
      expect(value.value).toBe('09:30')
      expect(time.supplied.value).toBe(1)

      value.value = '11:20'
      await rest()
      expect(value.value).toBe('11:30')
      expect(time.supplied.value).toBe(2)

      blocked.value = true
      await rest()
      value.value = '12:10'
      await rest()
      expect(time.supplied.value).toBe(3)

      blocked.value = false
      await rest()
      expect(value.value).toBe('12:00')
      expect(time.supplied.value).toBe(3)

      value.value = '12:10'
      await rest()
      expect(value.value).toBe('12:00')
      expect(time.supplied.value).toBe(3)
    })

    it('should count a value from outside once its normalized form is in the model', async () => {
      const { value, state, put } = manual('09:00')
      const time = setup({ value, minuteStep: 15 })

      put('10:07')
      expect(time.supplied.value).toBe(0)

      await nextTick()
      expect(state.asked).toBe('10:00')
      expect(time.supplied.value).toBe(0)

      put(state.asked)
      expect(time.supplied.value).toBe(1)

      await rest()
      expect(time.supplied.value).toBe(1)
    })

    it('should count a value from outside once when the owner refuses its normalized form', async () => {
      const { value, state, put } = manual('09:00')
      const time = setup({ value, minuteStep: 15 })

      put('10:07')
      await rest()

      expect(state.asked).toBe('10:00')
      expect(time.display.value).toBe('10:07')
      expect(time.supplied.value).toBe(1)
    })

    it('should not count an edit the owner refuses', async () => {
      const { value, state } = manual('09:00')
      const time = setup({ value })

      time.step('hour', 1)
      await rest()

      expect(state.asked).toBe('10:00')
      expect(time.display.value).toBe('09:00')
      expect(time.supplied.value).toBe(0)
    })

    it('should count an edit when an option changes before its owner answers', async () => {
      const { value, held } = lagging('09:00')
      const minuteStep = shallowRef(1)
      const time = setup({ value, minuteStep })
      await rest()

      time.step('hour', 1)
      minuteStep.value = 15
      await rest()

      expect(held()).toBe('10:00')
      expect(time.supplied.value).toBe(1)
    })

    it('should register with a parent form and leave it when the scope stops', async () => {
      const [, provideForm, form] = createFormContext()
      const app = createApp({ render: () => null })
      provideForm(form, app)

      const scope = effectScope()
      const time = app.runWithContext(() => scope.run(() => createTimePicker({ required: true })))!

      expect(form.size).toBe(1)
      expect(await form.submit()).toBe(false)
      expect(time.input.isValid.value).toBe(false)

      time.commit('hour', 9)
      time.commit('minute', 30)
      expect(await form.submit()).toBe(true)

      form.reset()
      expect(time.input.isValid.value).toBeNull()
      expect(time.value.value).toBe('09:30')

      scope.stop()
      expect(form.size).toBe(0)
    })
  })
})
