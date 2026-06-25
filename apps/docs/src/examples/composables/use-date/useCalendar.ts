// Composables
import { useDate } from '@vuetify/v0'

// Utilities
import { computed, shallowRef } from 'vue'

export interface CalendarCell {
  date: unknown
  day: number
  today: boolean
  selected: boolean
  outside: boolean
}

export function useCalendar () {
  const { adapter, locale } = useDate()

  const now = adapter.date()!
  const current = shallowRef<unknown>(now)
  const selected = shallowRef<unknown>(now)

  const weekdays = computed(() => adapter.getWeekdays('narrow'))

  const weeks = computed<CalendarCell[][]>(() => {
    const grid = adapter.getWeekArray(current.value)
    const reference = adapter.date()

    return grid.map(week => week.map(date => ({
      date,
      day: adapter.getDate(date),
      today: reference ? adapter.isSameDay(date, reference) : false,
      selected: adapter.isSameDay(date, selected.value),
      outside: !adapter.isSameMonth(date, current.value),
    })))
  })

  const monthYear = computed(() => adapter.format(current.value, 'monthAndYear'))
  const selectedLabel = computed(() => adapter.format(selected.value, 'fullDate'))

  function prev () {
    current.value = adapter.getPreviousMonth(current.value)
  }

  function next () {
    current.value = adapter.getNextMonth(current.value)
  }

  function today () {
    current.value = adapter.date()!
    selected.value = current.value
  }

  function select (date: unknown) {
    selected.value = date
    if (!adapter.isSameMonth(date, current.value)) current.value = date
  }

  return {
    locale,
    weekdays,
    weeks,
    monthYear,
    selectedLabel,
    prev,
    next,
    today,
    select,
  }
}
