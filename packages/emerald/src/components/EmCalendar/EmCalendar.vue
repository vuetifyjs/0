<script lang="ts">
  // Framework
  import { createSingle, isString } from '@vuetify/v0'

  // Context
  import { EM_CALENDAR_NAMESPACE, provideEmCalendarContext } from './context'
  import { useEmCalendarDate } from './date'

  // Utilities
  import { computed, toRef, useId, watch } from 'vue'

  // Types
  import type { EmCalendarCell, EmCalendarContext, EmCalendarEvent } from './context'

  export interface EmCalendarProps {
    id?: string
    namespace?: string
    events?: EmCalendarEvent[]
    /** 0 = Sunday. Defaults to the date adapter's value when a date plugin is installed. */
    firstDayOfWeek?: number
    disabled?: boolean
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmCalendar' })

  const {
    id,
    namespace = EM_CALENDAR_NAMESPACE,
    events = [],
    firstDayOfWeek,
    disabled = false,
  } = defineProps<EmCalendarProps>()

  /** Selected day, ISO `YYYY-MM-DD` — a string, so a re-created `Date` never breaks identity. */
  const selected = defineModel<string>()
  /** Visible-month cursor. */
  const month = defineModel<Date>('month')

  const date = useEmCalendarDate()
  const now = date.now()
  const title = useId()

  const first = toRef(() => firstDayOfWeek ?? date.first())
  const cursor = computed(() => date.month(month.value ?? now))
  const label = toRef(() => date.label(cursor.value))
  const weekdays = toRef(() => date.weekdays(first.value))

  const calendar = computed(() => {
    const start = date.days(cursor.value, -((cursor.value.getDay() - first.value + 7) % 7))
    const anchor = cursor.value.getMonth()
    const today = date.iso(now)

    return Array.from({ length: 42 }, (_, index): EmCalendarCell => {
      const value = date.days(start, index)
      const iso = date.iso(value)

      return {
        date: value,
        iso,
        day: value.getDate(),
        inMonth: value.getMonth() === anchor,
        today: iso === today,
      }
    })
  })

  const schedule = computed(() => {
    const map = new Map<string, EmCalendarEvent[]>()

    for (const event of events) {
      const key = isString(event.date) ? event.date.slice(0, 10) : date.iso(event.date)
      const bucket = map.get(key)

      if (bucket) bucket.push(event)
      else map.set(key, [event])
    }

    return map
  })

  // Days enroll on first touch rather than 42 at a time — the matrix re-slices
  // every month, and stale tickets would outnumber live ones within a year.
  const day = createSingle({ mandatory: 'force' })

  function enroll (iso: string) {
    if (!day.has(iso)) day.register({ id: iso, value: iso })
  }

  const initial = selected.value ?? date.iso(now)

  enroll(initial)
  day.select(initial)

  function select (iso: string) {
    if (disabled) return

    enroll(iso)
    day.select(iso)
    selected.value = iso
  }

  function step (amount: number) {
    if (disabled) return

    month.value = date.months(cursor.value, amount)
  }

  function prev () {
    step(-1)
  }

  function next () {
    step(1)
  }

  function today () {
    if (disabled) return

    month.value = date.month(now)
    select(date.iso(now))
  }

  watch(selected, iso => {
    if (!iso || day.selected(iso)) return

    enroll(iso)
    day.select(iso)
  })

  const context: EmCalendarContext = {
    cursor,
    cells: calendar,
    weekdays,
    label,
    disabled: toRef(() => disabled),
    title,
    date,
    events: iso => schedule.value.get(iso) ?? [],
    selected: iso => day.selected(iso),
    select,
    prev,
    next,
    today,
    step,
  }

  provideEmCalendarContext(namespace, context)

  defineExpose({ day })
</script>

<template>
  <div
    :id
    class="emerald-calendar"
    :data-disabled="disabled || undefined"
  >
    <slot />
  </div>
</template>

<style>
  .emerald-calendar {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background: var(--emerald-background, #fefefe);
    border: var(--emerald-stroke-s, 1px) solid var(--emerald-neutral-300, #ccd6e7);
    border-radius: var(--emerald-radius-xl, 12px);
    box-shadow: var(--emerald-shadow-s, 0 0 2px 0 rgba(51, 51, 51, 0.08));
    color: var(--emerald-on-surface, #2b2d2e);
    font-family: var(--emerald-font-sans, Manrope, system-ui, sans-serif);
  }

  .emerald-calendar[data-disabled] {
    opacity: 0.6;
  }

  /* Shared by EmCalendarPrev and EmCalendarNext — housed on the always-present
     root so either arrow paints when used on its own. */
  .emerald-calendar__nav {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex: none;
    width: 28px;
    height: 28px;
    border: var(--emerald-stroke-s, 1px) solid var(--emerald-neutral-300, #ccd6e7);
    border-radius: var(--emerald-radius-m, 8px);
    background: var(--emerald-background, #fefefe);
    color: var(--emerald-on-surface, #2b2d2e);
    font-size: 1rem;
    line-height: 1;
    cursor: pointer;
  }

  .emerald-calendar__nav:hover:not(:disabled) {
    background: var(--emerald-neutral-200, #f6f8fa);
  }

  .emerald-calendar__nav:disabled {
    color: var(--emerald-neutral-400, #aeb6be);
    cursor: not-allowed;
  }

  .emerald-calendar__nav:focus-visible {
    outline: var(--emerald-stroke-m, 2px) solid var(--emerald-primary-600, #1fae60);
    outline-offset: 1px;
  }
</style>
