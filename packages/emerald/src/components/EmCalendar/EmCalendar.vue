<script lang="ts">
  // Framework
  import { isString } from '@vuetify/v0'

  // Composables
  import { createCalendar } from './calendar'
  // Context
  import { EM_CALENDAR_NAMESPACE, provideEmCalendarContext } from './context'
  import { useEmCalendarDate } from './date'

  // Utilities
  import { computed, toRef, useId, watch } from 'vue'

  // Types
  import type { CalendarUnit } from './calendar'
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
  const title = useId()

  /**
   * The core speaks `YYYY-MM`; the model stays a `Date` for compatibility, so
   * the anchor is bridged in both directions — the getter feeds the core, the
   * watch writes navigation back out.
   */
  const calendar = createCalendar({
    month: () => date.iso(month.value ?? date.now()).slice(0, 7),
    firstDayOfWeek: () => firstDayOfWeek ?? date.first(),
    disabled: () => disabled,
    // Emerald holds a constant card height, so the matrix never reflows.
    fixedWeeks: true,
  })

  watch(calendar.anchor, value => {
    month.value = date.parse(value)
  })

  const cursor = toRef(() => date.parse(calendar.anchor.value))

  const matrix = computed(() => calendar.months.value[0].weeks.flat())

  // The core's cells carry geometry only; the DS shape adds the `Date` its
  // sub-components format from, and reads the spill as `inMonth`.
  const cells = computed(() => matrix.value.map(
    (cell): EmCalendarCell => ({
      date: date.parse(cell.iso),
      iso: cell.iso,
      day: cell.day,
      inMonth: !cell.outside,
      today: cell.today,
    }),
  ))

  // APG entry order is last-focused, then selected, then today — so a visible
  // selection owns the first tab stop. Mount-time only: once the user pages or
  // walks, the roving cursor rightly outranks the selection.
  const initial = matrix.value.find(
    cell => cell.iso === selected.value && !cell.outside && !cell.disabled,
  )

  if (initial) calendar.focused.value = initial.iso

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

  /**
   * Selection is a plain guarded write, not a registry: days are an unbounded
   * collection, so ticketing them only ever accumulated. Nothing is selected
   * until the model or the user says so, and the paint is one comparison — so
   * clearing the model clears the highlight.
   */
  function select (iso: string) {
    if (disabled) return

    const cell = matrix.value.find(entry => entry.iso === iso)

    if (cell?.disabled) return

    selected.value = iso
  }

  function step (amount: number) {
    if (disabled) return

    calendar.step(amount)
  }

  function prev () {
    step(-1)
  }

  function next () {
    step(1)
  }

  function today () {
    if (disabled) return

    calendar.today()

    select(date.iso(date.now()))
  }

  function move (unit: CalendarUnit, amount: number) {
    if (disabled) return

    calendar.move(unit, amount)
  }

  const context: EmCalendarContext = {
    cursor,
    cells,
    weekdays: calendar.weekdays,
    label: calendar.label,
    disabled: toRef(() => disabled),
    title,
    date,
    events: iso => schedule.value.get(iso) ?? [],
    selected: iso => selected.value === iso,
    select,
    prev,
    next,
    today,
    step,
    focused: calendar.focused,
    move,
  }

  provideEmCalendarContext(namespace, context)

  defineExpose({ calendar })
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
