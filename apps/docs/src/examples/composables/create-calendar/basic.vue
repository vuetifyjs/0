<script setup lang="ts">
  import { createCalendar } from '@vuetify/v0'

  const calendar = createCalendar({
    fixedWeeks: true,
  })

  function onClick (iso: string, disabled: boolean) {
    if (disabled) return

    calendar.focused.value = iso
  }

  function onKeydown (event: KeyboardEvent) {
    switch (event.key) {
      case 'ArrowLeft': {
        calendar.move('day', -1)
        break
      }
      case 'ArrowRight': {
        calendar.move('day', 1)
        break
      }
      case 'ArrowUp': {
        calendar.move('week', -1)
        break
      }
      case 'ArrowDown': {
        calendar.move('week', 1)
        break
      }
      case 'PageUp': {
        if (event.shiftKey) calendar.move('year', -1)
        else calendar.prev()
        break
      }
      case 'PageDown': {
        if (event.shiftKey) calendar.move('year', 1)
        else calendar.next()
        break
      }
      case 'Home': {
        calendar.first()
        break
      }
      case 'End': {
        calendar.last()
        break
      }
      default: {
        return
      }
    }
    event.preventDefault()
  }
</script>

<template>
  <div class="calendar">
    <header class="calendar-header">
      <button
        aria-label="Previous month"
        class="calendar-nav"
        type="button"
        @click="calendar.prev()"
      >
        ←
      </button>

      <span class="calendar-label">{{ calendar.label.value }}</span>

      <button
        aria-label="Next month"
        class="calendar-nav"
        type="button"
        @click="calendar.next()"
      >
        →
      </button>
    </header>

    <div class="calendar-weekdays">
      <span
        v-for="weekday in calendar.weekdays.value"
        :key="weekday.short"
        class="calendar-weekday"
      >
        {{ weekday.narrow }}
      </span>
    </div>

    <div
      class="calendar-grid"
      role="grid"
      @keydown="onKeydown"
    >
      <template v-for="(week, weekIndex) in calendar.months.value[0].weeks" :key="weekIndex">
        <button
          v-for="cell in week"
          :key="cell.iso"
          :aria-disabled="cell.disabled"
          :aria-label="cell.iso"
          class="calendar-cell"
          :class="{
            'calendar-cell--outside': cell.outside,
            'calendar-cell--today': cell.today,
            'calendar-cell--disabled': cell.disabled,
            'calendar-cell--focused': calendar.focused.value === cell.iso,
          }"
          role="gridcell"
          :tabindex="calendar.focused.value === cell.iso ? 0 : -1"
          type="button"
          @click="onClick(cell.iso, cell.disabled)"
        >
          {{ cell.day }}
        </button>
      </template>
    </div>

    <footer class="calendar-footer">
      <button
        class="calendar-today"
        type="button"
        @click="calendar.today()"
      >
        Today
      </button>
    </footer>
  </div>
</template>

<style scoped>
  .calendar {
    display: flex;
    flex-direction: column;
    gap: 8px;
    max-width: 280px;
    padding: 16px;
    background: var(--gn-surface);
    border: 1px solid var(--gn-divider);
    border-radius: 8px;
    font-family: system-ui, sans-serif;
  }

  .calendar-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .calendar-label {
    font-size: 1rem;
    font-weight: 600;
  }

  .calendar-nav {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border: 1px solid var(--gn-divider);
    border-radius: 6px;
    background: var(--gn-surface);
    cursor: pointer;
  }

  .calendar-nav:hover {
    background: var(--gn-surface-variant);
  }

  .calendar-weekdays {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 2px;
    text-align: center;
  }

  .calendar-weekday {
    padding: 4px 0;
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--gn-on-surface-variant);
  }

  .calendar-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 2px;
  }

  .calendar-cell {
    display: flex;
    align-items: center;
    justify-content: center;
    aspect-ratio: 1;
    padding: 0;
    border: none;
    border-radius: 6px;
    background: transparent;
    font-size: 0.875rem;
    cursor: pointer;
  }

  .calendar-cell:hover:not(.calendar-cell--disabled) {
    background: var(--gn-surface-variant);
  }

  .calendar-cell--outside {
    color: var(--gn-on-surface-variant);
    opacity: 0.5;
  }

  .calendar-cell--today {
    font-weight: 700;
    color: var(--gn-primary);
  }

  .calendar-cell--disabled {
    color: var(--gn-on-surface-variant);
    opacity: 0.3;
    cursor: not-allowed;
  }

  .calendar-cell--focused {
    outline: 2px solid var(--gn-primary);
    outline-offset: -2px;
  }

  .calendar-footer {
    display: flex;
    justify-content: center;
    padding-top: 8px;
    border-top: 1px solid var(--gn-divider);
  }

  .calendar-today {
    padding: 6px 12px;
    border: 1px solid var(--gn-divider);
    border-radius: 6px;
    background: var(--gn-surface);
    font-size: 0.875rem;
    cursor: pointer;
  }

  .calendar-today:hover {
    background: var(--gn-surface-variant);
  }
</style>
