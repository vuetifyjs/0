<script setup lang="ts">
  import { Md1DataTable, Md1Switch } from '@paper/md1'
  import { useLocale } from '@vuetify/v0'
  import { computed, shallowRef, toRef } from 'vue'

  const locale = useLocale()

  const clock = shallowRef(false)

  const tag = toRef(() => String(locale.selectedId.value ?? 'en'))

  // A fixed "now", so every row reads the same on every visit: Wednesday, January 14, 2015, 10:00 AM.
  const now = new Date(2015, 0, 14, 10, 0)

  function at (year: number, month: number, day: number, hour = 0, minute = 0) {
    return new Date(year, month - 1, day, hour, minute)
  }

  function part (date: Date, options: Intl.DateTimeFormatOptions) {
    return new Intl.DateTimeFormat(tag.value, options).format(date)
  }

  function upper (text: string) {
    return text.charAt(0).toLocaleUpperCase(tag.value) + text.slice(1)
  }

  // Time: uppercase AM or PM without periods on the 12-hour clock, no marker on the 24-hour clock.
  function time (date: Date, marker = true) {
    const parts = new Intl.DateTimeFormat(tag.value, { hour: 'numeric', minute: '2-digit', hour12: !clock.value }).formatToParts(date)

    return parts
      .filter(item => marker || item.type !== 'dayPeriod')
      .map(item => item.type === 'dayPeriod' ? item.value.toUpperCase().replaceAll('.', '') : item.value)
      .join('')
      .trim()
      .replace(/^0(?=\d)/, '')
  }

  // A rounded time drops ":00"; on the 24-hour clock the bare hour would be ambiguous, so it stays.
  function rounded (date: Date) {
    return clock.value ? time(date) : time(date).replace(':00', '')
  }

  function period (date: Date) {
    return date.getHours() < 12 ? 'am' : 'pm'
  }

  // Month, day and year: the year only outside the current one.
  function day (date: Date, month: 'long' | 'short' = 'long') {
    return date.getFullYear() === now.getFullYear()
      ? part(date, { month, day: 'numeric' })
      : part(date, { month, day: 'numeric', year: 'numeric' })
  }

  // A time range: an en dash with no spaces, and a single AM or PM when both ends share it.
  function times (start: Date, end: Date) {
    const shared = clock.value || period(start) === period(end)

    return `${time(start, !shared)}–${time(end)}`
  }

  // A date range: the year on both ends unless they share it; spaces around the dash once months are spelled out on both sides.
  function days (start: Date, end: Date) {
    if (start.getFullYear() !== end.getFullYear()) return `${day(start, 'short')}–${day(end, 'short')}`

    if (start.getMonth() === end.getMonth()) {
      const range = `${part(start, { month: 'long' })} ${start.getDate()}–${end.getDate()}`

      return start.getFullYear() === now.getFullYear() ? range : `${range}, ${start.getFullYear()}`
    }

    return `${day(start, 'short')} – ${day(end, 'short')}`
  }

  // Approximate time rounds down to the largest unit that has passed.
  function approximate (date: Date) {
    const seconds = (date.getTime() - now.getTime()) / 1000
    const units: [Intl.RelativeTimeFormatUnit, number][] = [['day', 86_400], ['hour', 3600], ['minute', 60]]
    const [unit, size] = units.find(([, length]) => Math.abs(seconds) >= length) ?? ['minute', 60]
    const value = Math.trunc(seconds / size)

    return upper(new Intl.RelativeTimeFormat(tag.value, { numeric: 'auto' }).format(value, unit))
  }

  function absolute (date: Date) {
    const today = new Intl.RelativeTimeFormat(tag.value, { numeric: 'auto' }).format(0, 'day')

    return `${upper(today)}, ${time(date)}`
  }

  function weekday (date: Date) {
    return `${part(date, { weekday: 'short' })}, ${day(date, 'short')}, ${time(date)}`
  }

  // Duration as H:MM:SS, dropping the hours when there are none.
  function duration (total: number) {
    const hours = Math.floor(total / 3600)
    const minutes = Math.floor((total % 3600) / 60)
    const seconds = String(total % 60).padStart(2, '0')

    return hours ? `${hours}:${String(minutes).padStart(2, '0')}:${seconds}` : `${minutes}:${seconds}`
  }

  const rows = computed(() => [
    { element: 'Time', example: time(at(2015, 1, 14, 14)) },
    { element: 'Date in the current year', example: day(at(2015, 1, 14)) },
    { element: 'Date in another year', example: day(at(2012, 1, 14)) },
    { element: 'Approximate time, future', example: approximate(at(2015, 1, 14, 10, 5)) },
    { element: 'Approximate time, past', example: approximate(at(2015, 1, 11, 9)) },
    { element: 'Absolute time', example: absolute(now) },
    { element: 'Time range', example: times(at(2015, 1, 14, 8), at(2015, 1, 14, 12, 30)) },
    { element: 'Time range, same period', example: times(at(2015, 1, 14, 8), at(2015, 1, 14, 10, 30)) },
    { element: 'Date range, current year', example: days(at(2015, 1, 6), at(2015, 2, 2)) },
    { element: 'Date range, one month', example: days(at(2014, 1, 4), at(2014, 1, 6)) },
    { element: 'Date range, two years', example: days(at(2013, 12, 6), at(2014, 1, 2)) },
    { element: 'Weekday', example: weekday(at(2015, 1, 12, 8)) },
    { element: 'Day and time, abbreviated', example: `${part(at(2015, 1, 18), { weekday: 'short' })}, ${time(at(2015, 1, 18, 14))}` },
    { element: 'Rounded time', example: rounded(at(2015, 1, 14, 8)) },
    { element: 'Duration', example: `${duration(30)}, ${duration(3665)}` },
  ])
</script>

<template>
  <!-- data-grid opts the table out of the docs prose table style; the card paints itself. -->
  <div class="md1-docs-formats" data-grid>
    <Md1Switch v-model="clock" label="24-hour clock" />

    <Md1DataTable class="md1-docs-formats-table">
      <Md1DataTable.Header title="Now: Jan 14, 2015, 10:00 AM" />

      <Md1DataTable.Table>
        <Md1DataTable.Head>
          <Md1DataTable.Column id="element">Element</Md1DataTable.Column>

          <Md1DataTable.Column id="example">Example</Md1DataTable.Column>
        </Md1DataTable.Head>

        <Md1DataTable.Body v-slot="{ rank }">
          <Md1DataTable.Row
            v-for="row in rank(rows)"
            :id="row.element"
            :key="row.element"
            :value="row"
          >
            <Md1DataTable.Cell>{{ row.element }}</Md1DataTable.Cell>

            <Md1DataTable.Cell>{{ row.example }}</Md1DataTable.Cell>
          </Md1DataTable.Row>
        </Md1DataTable.Body>
      </Md1DataTable.Table>
    </Md1DataTable>
  </div>
</template>

<style>
  .md1-docs-formats {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--md1-spacing-2, 16px);
    width: 100%;
    max-width: 560px;
  }

  .md1-docs-formats-table {
    width: 100%;
  }
</style>
