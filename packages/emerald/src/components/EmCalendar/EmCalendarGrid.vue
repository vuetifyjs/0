<script lang="ts">
  // Context
  import { EM_CALENDAR_NAMESPACE, useEmCalendarContext } from './context'

  // Utilities
  import { nextTick, shallowRef, toRef, useTemplateRef } from 'vue'

  // Types
  import type { EmCalendarCell } from './context'

  export interface EmCalendarGridProps {
    namespace?: string
    /** Chips shown per cell before the "+N more" row takes over. */
    overflow?: number
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmCalendarGrid' })

  const {
    namespace = EM_CALENDAR_NAMESPACE,
    overflow = 2,
  } = defineProps<EmCalendarGridProps>()

  const context = useEmCalendarContext(namespace)

  const root = useTemplateRef<HTMLElement>('root')
  /** Day the keyboard last walked to; null until the user drives the grid. */
  const active = shallowRef<string | null>(null)

  const weeks = toRef(() => Array.from(
    { length: 6 },
    (_, index) => context.cells.value.slice(index * 7, index * 7 + 7),
  ))

  // Exactly one cell holds tabindex 0 — the walked day while it stays visible,
  // then the selected day, today, and finally the first day of the month.
  const tab = toRef(() => {
    const cells = context.cells.value
    const walked = cells.find(cell => cell.iso === active.value && cell.inMonth)

    if (walked) return walked.iso

    const selected = cells.find(cell => cell.inMonth && context.selected(cell.iso))

    if (selected) return selected.iso

    const today = cells.find(cell => cell.inMonth && cell.today)

    return (today ?? cells.find(cell => cell.inMonth))?.iso
  })

  function name (cell: EmCalendarCell) {
    const count = context.events(cell.iso).length
    const full = context.date.full(cell.date)

    if (count === 0) return full

    return `${full}, ${count} event${count === 1 ? '' : 's'}`
  }

  function focus (iso: string) {
    root.value?.querySelector<HTMLElement>(`[data-iso="${iso}"]`)?.focus()
  }

  /**
   * Walks to `target`, pulling the cursor along when it lands outside the
   * visible month. The cell is re-keyed by that re-render, so focus is re-taken
   * once the new matrix is in the DOM.
   */
  function go (target: Date) {
    const cursor = context.cursor.value
    const delta = (target.getFullYear() - cursor.getFullYear()) * 12 + (target.getMonth() - cursor.getMonth())
    const iso = context.date.iso(target)

    active.value = iso

    if (delta === 0) {
      focus(iso)
      return
    }

    context.step(delta)

    nextTick(() => focus(iso))
  }

  function onSelect (cell: EmCalendarCell) {
    if (!cell.inMonth || context.disabled.value) return

    active.value = cell.iso

    context.select(cell.iso)
  }

  function onKeydown (event: KeyboardEvent, cell: EmCalendarCell) {
    if (context.disabled.value) return

    const { date } = context
    let target: Date | undefined

    switch (event.key) {
      case 'ArrowLeft': {
        target = date.days(cell.date, -1)
        break
      }
      case 'ArrowRight': {
        target = date.days(cell.date, 1)
        break
      }
      case 'ArrowUp': {
        target = date.days(cell.date, -7)
        break
      }
      case 'ArrowDown': {
        target = date.days(cell.date, 7)
        break
      }
      case 'Home':
      case 'End': {
        const cells = context.cells.value
        const index = cells.findIndex(entry => entry.iso === cell.iso)

        if (index === -1) return

        target = cells[Math.floor(index / 7) * 7 + (event.key === 'Home' ? 0 : 6)].date
        break
      }
      case 'PageUp': {
        target = date.months(cell.date, -1)
        break
      }
      case 'PageDown': {
        target = date.months(cell.date, 1)
        break
      }
      default: { return
      }
    }

    event.preventDefault()

    go(target)
  }
</script>

<template>
  <div
    ref="root"
    :aria-labelledby="context.title"
    class="emerald-calendar__grid"
    role="grid"
  >
    <!-- `abbr` is inert outside a <th>, so the full weekday name rides aria-label. -->
    <div class="emerald-calendar__weekdays" role="row">
      <span
        v-for="weekday in context.weekdays.value"
        :key="weekday.long"
        :aria-label="weekday.long"
        role="columnheader"
      >{{ weekday.short }}</span>
    </div>

    <div
      v-for="(week, index) in weeks"
      :key="index"
      class="emerald-calendar__week"
      role="row"
    >
      <button
        v-for="cell in week"
        :key="cell.iso"
        :aria-current="cell.today ? 'date' : undefined"
        :aria-disabled="!cell.inMonth || context.disabled.value || undefined"
        :aria-label="name(cell)"
        :aria-selected="context.selected(cell.iso)"
        class="emerald-calendar__cell"
        :data-iso="cell.iso"
        :data-out="!cell.inMonth || undefined"
        :data-selected="context.selected(cell.iso) || undefined"
        role="gridcell"
        :tabindex="tab === cell.iso ? 0 : -1"
        type="button"
        @click="onSelect(cell)"
        @keydown="onKeydown($event, cell)"
      >
        <span class="emerald-calendar__date" :data-today="cell.today || undefined">{{ cell.day }}</span>

        <!-- Chips are inert spans: a button cannot host interactive children,
             and the cell's aria-label already carries the event count. -->
        <span aria-hidden="true" class="emerald-calendar__events">
          <span
            v-for="event in context.events(cell.iso).slice(0, overflow)"
            :key="event.title"
            class="emerald-calendar__event"
            :data-allday="event.allDay || undefined"
            :data-tone="event.tone ?? 'neutral'"
          >
            <span class="emerald-calendar__event-title">{{ event.title }}</span>

            <span
              v-if="event.time && !event.allDay"
              class="emerald-calendar__event-time"
            >{{ event.time }}</span>
          </span>

          <span
            v-if="context.events(cell.iso).length > overflow"
            class="emerald-calendar__more"
          >+{{ context.events(cell.iso).length - overflow }} more</span>
        </span>
      </button>
    </div>
  </div>
</template>

<style>
  .emerald-calendar__grid {
    display: flex;
    flex-direction: column;
  }

  /* minmax(0, 1fr): plain 1fr floors at min-content, and the nowrap event chips
     would push the columns past the card and out of step with the day header. */
  .emerald-calendar__weekdays,
  .emerald-calendar__week {
    display: grid;
    grid-template-columns: repeat(7, minmax(0, 1fr));
  }

  .emerald-calendar__weekdays {
    padding: var(--emerald-spacing-xs, 8px) 0;
    border-bottom: var(--emerald-stroke-s, 1px) solid var(--emerald-neutral-300, #ccd6e7);
  }

  .emerald-calendar__weekdays span {
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    text-align: center;
  }

  .emerald-calendar__week {
    min-height: 104px;
  }

  .emerald-calendar__cell {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    overflow: hidden;
    min-width: 0;
    padding: 6px;
    border: 0;
    border-right: var(--emerald-stroke-s, 1px) solid var(--emerald-neutral-200, #f6f8fa);
    border-bottom: var(--emerald-stroke-s, 1px) solid var(--emerald-neutral-200, #f6f8fa);
    background: transparent;
    color: inherit;
    font: inherit;
    text-align: start;
    cursor: pointer;
  }

  .emerald-calendar__cell:hover {
    background: var(--emerald-neutral-200, #f6f8fa);
  }

  .emerald-calendar__cell[data-selected] {
    background: var(--emerald-primary-100, #e7fff2);
  }

  .emerald-calendar__cell[data-out] {
    color: var(--emerald-on-surface-variant, #757e85);
    opacity: 0.5;
    cursor: default;
  }

  .emerald-calendar__cell:focus-visible {
    outline: var(--emerald-stroke-m, 2px) solid var(--emerald-primary-600, #1fae60);
    outline-offset: -2px;
  }

  .emerald-calendar__date {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex: none;
    min-width: 22px;
    height: 22px;
    border-radius: var(--emerald-radius-s, 6px);
    font-size: var(--emerald-text-b3-size, 12px);
    font-weight: 600;
  }

  .emerald-calendar__date[data-today] {
    background: var(--emerald-primary-700, #027d4c);
    color: var(--emerald-on-primary, #fefefe);
  }

  .emerald-calendar__events {
    display: flex;
    flex-direction: column;
    gap: 3px;
    width: 100%;
    min-width: 0;
    margin-top: 4px;
  }

  /* Chips are ruled on the leading edge rather than filled end to end, and the
     time trails the title instead of leading it. */
  .emerald-calendar__event {
    display: flex;
    align-items: baseline;
    gap: 4px;
    overflow: hidden;
    min-width: 0;
    padding: 1px 4px;
    border-left: 3px solid var(--emerald-neutral-600, #939dac);
    border-radius: 0 3px 3px 0;
    background: var(--emerald-neutral-200, #f6f8fa);
    font-size: 10px;
  }

  .emerald-calendar__event[data-tone='primary'] { border-left-color: var(--emerald-primary-600, #1fae60); }
  .emerald-calendar__event[data-tone='secondary'] { border-left-color: var(--emerald-secondary-600, #00b4dc); }
  .emerald-calendar__event[data-tone='info'] { border-left-color: var(--emerald-info-500, #3a70e2); }
  .emerald-calendar__event[data-tone='alert'] { border-left-color: var(--emerald-alert-600, #d9af00); }
  .emerald-calendar__event[data-tone='danger'] { border-left-color: var(--emerald-danger-500, #e5484d); }

  .emerald-calendar__event[data-allday] { background: var(--emerald-neutral-300, #ccd6e7); }
  .emerald-calendar__event[data-allday][data-tone='primary'] { background: var(--emerald-primary-100, #e7fff2); }
  .emerald-calendar__event[data-allday][data-tone='secondary'] { background: var(--emerald-secondary-100, #dbf8ff); }
  .emerald-calendar__event[data-allday][data-tone='info'] { background: var(--emerald-info-100, #e4f2ff); }
  .emerald-calendar__event[data-allday][data-tone='alert'] { background: var(--emerald-alert-100, #fff7e1); }
  .emerald-calendar__event[data-allday][data-tone='danger'] { background: var(--emerald-danger-100, #ffe9ea); }

  .emerald-calendar__event-title {
    overflow: hidden;
    flex: 1;
    min-width: 0;
    font-weight: 600;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .emerald-calendar__event-time {
    flex: none;
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: 9px;
  }

  .emerald-calendar__more {
    padding: 1px 4px;
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: 10px;
  }

  @media (max-width: 640px) {
    .emerald-calendar__week {
      min-height: 76px;
    }

    .emerald-calendar__event {
      padding: 1px 2px;
      font-size: 9px;
    }

    .emerald-calendar__event-time {
      display: none;
    }
  }
</style>
