<script lang="ts">
  // Context
  import { EM_CALENDAR_NAMESPACE, useEmCalendarContext } from './context'

  // Types
  import type { EmCalendarCell } from './context'

  export interface EmCalendarMiniProps {
    namespace?: string
    /** Tone dots shown under a day before the rest are dropped. */
    dots?: number
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmCalendarMini' })

  const {
    namespace = EM_CALENDAR_NAMESPACE,
    dots = 3,
  } = defineProps<EmCalendarMiniProps>()

  const context = useEmCalendarContext(namespace)

  function onSelect (cell: EmCalendarCell) {
    context.select(cell.iso)
  }
</script>

<template>
  <!-- A navigation-density widget, not the APG surface: role="group" with plain
       day buttons in tab order, so it never competes with the grid's roving focus. -->
  <div
    :aria-label="context.label.value"
    class="emerald-calendar__mini"
    role="group"
  >
    <div class="emerald-calendar__mini-grid">
      <span
        v-for="weekday in context.weekdays.value"
        :key="weekday.long"
        aria-hidden="true"
        class="emerald-calendar__mini-weekday"
      >{{ weekday.short.slice(0, 2) }}</span>

      <button
        v-for="cell in context.cells.value"
        :key="cell.iso"
        :aria-current="cell.today ? 'date' : undefined"
        :aria-label="context.date.full(cell.date)"
        :aria-pressed="context.selected(cell.iso)"
        class="emerald-calendar__mini-day"
        :data-selected="context.selected(cell.iso) || undefined"
        :data-today="cell.today || undefined"
        :disabled="!cell.inMonth || context.disabled.value"
        type="button"
        @click="onSelect(cell)"
      >
        {{ cell.day }}

        <span aria-hidden="true" class="emerald-calendar__mini-dots">
          <span
            v-for="event in context.events(cell.iso).slice(0, dots)"
            :key="event.title"
            class="emerald-calendar__mini-dot"
            :data-tone="event.tone ?? 'neutral'"
          />
        </span>
      </button>
    </div>
  </div>
</template>

<style>
  .emerald-calendar__mini {
    padding: var(--emerald-spacing-m, 16px);
  }

  .emerald-calendar__mini-grid {
    display: grid;
    grid-template-columns: repeat(7, minmax(0, 1fr));
    gap: 2px;
  }

  .emerald-calendar__mini-weekday {
    padding: 2px 0;
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: 10px;
    font-weight: 600;
    text-align: center;
  }

  .emerald-calendar__mini-day {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 28px;
    border: none;
    border-radius: var(--emerald-radius-m, 8px);
    background: transparent;
    color: var(--emerald-on-surface, #2b2d2e);
    font-family: inherit;
    font-size: var(--emerald-text-b3-size, 12px);
    cursor: pointer;
  }

  .emerald-calendar__mini-day:disabled {
    color: var(--emerald-on-surface-variant, #757e85);
    opacity: 0.5;
    cursor: default;
  }

  .emerald-calendar__mini-day:hover:not(:disabled) {
    background: var(--emerald-neutral-200, #f6f8fa);
  }

  .emerald-calendar__mini-day:focus-visible {
    outline: var(--emerald-stroke-m, 2px) solid var(--emerald-primary-600, #1fae60);
    outline-offset: 1px;
  }

  .emerald-calendar__mini-day[data-today] {
    font-weight: 700;
  }

  .emerald-calendar__mini-day[data-selected] {
    background: var(--emerald-primary-700, #027d4c);
    color: var(--emerald-on-primary, #fefefe);
  }

  .emerald-calendar__mini-dots {
    display: flex;
    gap: 2px;
    height: 4px;
    margin-top: 1px;
  }

  .emerald-calendar__mini-dot {
    flex: none;
    width: 4px;
    height: 4px;
    border-radius: var(--emerald-radius-full, 999px);
    background: var(--emerald-neutral-600, #939dac);
  }

  .emerald-calendar__mini-dot[data-tone='primary'] { background: var(--emerald-primary-600, #1fae60); }
  .emerald-calendar__mini-dot[data-tone='secondary'] { background: var(--emerald-secondary-600, #00b4dc); }
  .emerald-calendar__mini-dot[data-tone='info'] { background: var(--emerald-info-500, #3a70e2); }
  .emerald-calendar__mini-dot[data-tone='alert'] { background: var(--emerald-alert-600, #d9af00); }
  .emerald-calendar__mini-dot[data-tone='danger'] { background: var(--emerald-danger-500, #e5484d); }

  /* On the selected day the tone dots would vanish into the fill. */
  .emerald-calendar__mini-day[data-selected] .emerald-calendar__mini-dot {
    background: var(--emerald-on-primary, #fefefe);
  }
</style>
