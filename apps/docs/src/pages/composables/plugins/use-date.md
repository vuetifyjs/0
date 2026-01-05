---
title: useDate Composable
meta:
- name: description
  content: A composable for date manipulation with adapter pattern, Temporal API support,
    and locale-aware formatting via Intl.DateTimeFormat.
- name: keywords
  content: useDate, date, datetime, temporal, date-io, formatting, composable
features:
  category: Plugin
  label: 'E: useDate'
  github: /composables/useDate/
---

# useDate

The `useDate` composable provides comprehensive date manipulation capabilities using the adapter pattern. The default adapter uses the Temporal API for modern, immutable date operations with locale-aware formatting via `Intl.DateTimeFormat`. Integrates with `useLocale` for automatic locale synchronization.

<DocsPageFeatures :frontmatter />

## Installation

First, install the date plugin in your application:

```ts
import { createApp } from 'vue'
import { createDatePlugin } from '@vuetify/v0'
import App from './App.vue'

const app = createApp(App)

app.use(
  createDatePlugin({
    locale: 'en-US',
  })
)

app.mount('#app')
```

## Usage

Once the plugin is installed, use the `useDate` composable in any component:

```vue UseDate
<script setup lang="ts">
import { useDate } from '@vuetify/v0'

const { adapter, locale } = useDate()

// Create dates from various inputs
const today = adapter.date()
const fromString = adapter.date('2024-06-15T10:30:00')
const fromTimestamp = adapter.date(Date.now())

// Format dates with presets
const formatted = adapter.format(today, 'fullDate')
const shortDate = adapter.format(today, 'shortDate')

// Format with custom patterns
const custom = adapter.formatByString(today, 'YYYY-MM-DD HH:mm')

// Date navigation
const nextMonth = adapter.getNextMonth(today)
const startOfWeek = adapter.startOfWeek(today, 0) // 0 = Sunday

// Date arithmetic
const inFiveDays = adapter.addDays(today, 5)
const twoMonthsAgo = adapter.addMonths(today, -2)

// Comparisons
const isAfter = adapter.isAfter(nextMonth, today)
const isSameMonth = adapter.isSameMonth(today, inFiveDays)
</script>

<template>
  <div>
    <p>Current locale: {{ locale }}</p>
    <p>Today: {{ formatted }}</p>
    <p>Short: {{ shortDate }}</p>
    <p>Custom: {{ custom }}</p>
  </div>
</template>
```

## API

| Composable | Description |
|---|---|
| [useLocale](/composables/plugins/use-locale) | Locale management (auto-syncs with useDate) |
| [createPlugin](/composables/foundation/create-plugin) | Plugin creation pattern |

### Plugin Options

- **Type**

  ```ts
  interface DatePluginOptions<T = Temporal.PlainDateTime> {
    adapter?: DateAdapter<T>
    locale?: string
    localeMap?: Record<string, string>
    namespace?: string
  }
  ```

- **Details**

  - `adapter`: Custom date adapter (default: `V0DateAdapter` using Temporal API)
  - `locale`: Default locale for formatting (default: 'en-US' or from `useLocale`)
  - `localeMap`: Mapping from short locale codes to Intl locale strings
  - `namespace`: Context namespace for dependency injection (default: 'v0:date')

### Date Context

The `useDate()` composable returns a context with the following properties:

```ts
interface DateContext<T = Temporal.PlainDateTime> {
  adapter: DateAdapter<T>
  locale: ComputedRef<string | undefined>
}
```

- `adapter`: The date adapter instance with all date manipulation methods
- `locale`: Reactive current locale (syncs with `useLocale` if available)

### DateAdapter Interface

The adapter provides a comprehensive API compatible with [date-io](https://github.com/dmtrKovalenko/date-io):

```ts
interface DateAdapter<T> {
  locale?: string

  // Construction & Conversion
  date(value?: unknown): T | null
  toJsDate(value: T): Date
  parseISO(dateString: string): T
  toISO(date: T): string
  parse(value: string, format: string): T | null
  isValid(date: unknown): boolean
  isNull(value: T | null): boolean

  // Formatting
  format(date: T, formatString: string): string
  formatByString(date: T, formatString: string): string
  formatNumber(numberToFormat: string): string
  getFormatHelperText(format: string): string
  getMeridiemText(ampm: 'am' | 'pm'): string

  // Navigation
  startOfDay(date: T): T
  endOfDay(date: T): T
  startOfWeek(date: T, firstDayOfWeek?: number): T
  endOfWeek(date: T, firstDayOfWeek?: number): T
  startOfMonth(date: T): T
  endOfMonth(date: T): T
  startOfYear(date: T): T
  endOfYear(date: T): T

  // Arithmetic
  addSeconds(date: T, amount: number): T
  addMinutes(date: T, amount: number): T
  addHours(date: T, amount: number): T
  addDays(date: T, amount: number): T
  addWeeks(date: T, amount: number): T
  addMonths(date: T, amount: number): T
  addYears(date: T, amount: number): T

  // Comparison
  isAfter(date: T, comparing: T): boolean
  isAfterDay(date: T, comparing: T): boolean
  isAfterMonth(date: T, comparing: T): boolean
  isAfterYear(date: T, comparing: T): boolean
  isBefore(date: T, comparing: T): boolean
  isBeforeDay(date: T, comparing: T): boolean
  isBeforeMonth(date: T, comparing: T): boolean
  isBeforeYear(date: T, comparing: T): boolean
  isEqual(date: T, comparing: T): boolean
  isSameDay(date: T, comparing: T): boolean
  isSameHour(date: T, comparing: T): boolean
  isSameMonth(date: T, comparing: T): boolean
  isSameYear(date: T, comparing: T): boolean
  isWithinRange(date: T, range: [T, T]): boolean

  // Getters
  getYear(date: T): number
  getMonth(date: T): number  // 0-indexed
  getDate(date: T): number
  getHours(date: T): number
  getMinutes(date: T): number
  getSeconds(date: T): number
  getDiff(date: T, comparing: T | string, unit?: string): number
  getWeek(date: T, firstDayOfWeek?: number, minimalDays?: number): number
  getDaysInMonth(date: T): number

  // Setters (immutable - returns new instance)
  setYear(date: T, year: number): T
  setMonth(date: T, month: number): T  // 0-indexed
  setDate(date: T, day: number): T
  setHours(date: T, hours: number): T
  setMinutes(date: T, minutes: number): T
  setSeconds(date: T, seconds: number): T

  // Calendar Utilities
  getWeekdays(firstDayOfWeek?: number, format?: 'long' | 'short' | 'narrow'): string[]
  getWeekArray(date: T, firstDayOfWeek?: number): T[][]
  getMonthArray(date: T): T[]
  getYearRange(start: T, end: T): T[]
  getNextMonth(date: T): T
  getPreviousMonth(date: T): T

  // Utility
  mergeDateAndTime(date: T, time: T): T
  getCurrentLocaleCode(): string
  is12HourCycleInCurrentLocale(): boolean
}
```

### Format Presets

The `format()` method accepts these preset format strings:

| Preset | Example Output |
|--------|----------------|
| `fullDate` | Saturday, June 15, 2024 |
| `fullDateWithWeekday` | Saturday, June 15, 2024 |
| `normalDate` | Jun 15, 2024 |
| `shortDate` | 6/15/24 |
| `year` | 2024 |
| `month` | June |
| `monthShort` | Jun |
| `monthAndYear` | June 2024 |
| `monthAndDate` | June 15 |
| `weekday` | Saturday |
| `weekdayShort` | Sat |
| `dayOfMonth` | 15 |
| `hours12h` | 10 AM |
| `hours24h` | 10 |
| `minutes` | 30 |
| `seconds` | 45 |
| `fullTime` | 10:30:45 AM |
| `fullTime12h` | 10:30:45 AM |
| `fullTime24h` | 10:30:45 |
| `fullDateTime` | Saturday, June 15, 2024 at 10:30 AM |
| `keyboardDate` | 06/15/2024 |
| `keyboardDateTime` | 06/15/2024 10:30 AM |

### Format Tokens

The `formatByString()` method supports these tokens:

| Token | Output | Example |
|-------|--------|---------|
| `YYYY` | 4-digit year | 2024 |
| `YY` | 2-digit year | 24 |
| `MMMM` | Full month name | June |
| `MMM` | Short month name | Jun |
| `MM` | Month (zero-padded) | 06 |
| `M` | Month | 6 |
| `dddd` | Full weekday name | Saturday |
| `ddd` | Short weekday name | Sat |
| `DD` | Day (zero-padded) | 15 |
| `D` | Day | 15 |
| `HH` | 24-hour (zero-padded) | 10 |
| `H` | 24-hour | 10 |
| `hh` | 12-hour (zero-padded) | 10 |
| `h` | 12-hour | 10 |
| `mm` | Minutes (zero-padded) | 30 |
| `m` | Minutes | 30 |
| `ss` | Seconds (zero-padded) | 45 |
| `s` | Seconds | 45 |
| `A` | AM/PM | AM |
| `a` | am/pm | am |

### `createDateContext`

- **Type**
  ```ts
  function createDateContext<
    T extends Temporal.PlainDateTime = Temporal.PlainDateTime,
    E extends DateContext<T> = DateContext<T>
  > (options: DateContextOptions<T>): ContextTrinity<E>
  ```

- **Details**

  Creates a date context using the [trinity pattern](/composables/foundation/create-trinity). Returns a readonly tuple of `[useDateContext, provideDateContext, context]` for dependency injection.

- **Example**
  ```ts
  import { createDateContext } from '@vuetify/v0'

  const [useAppDate, provideAppDate, dateContext] = createDateContext({
    namespace: 'my-app:date',
    locale: 'de-DE',
  })

  // In root component
  provideAppDate()

  // In any descendant component
  const { adapter } = useAppDate()
  const formatted = adapter.format(adapter.date(), 'fullDate')
  ```

## Locale Integration

When `useLocale` is available, `useDate` automatically syncs with the selected locale:

```ts
import { createApp } from 'vue'
import { createLocalePlugin, createDatePlugin } from '@vuetify/v0'

const app = createApp(App)

// Install locale plugin first
app.use(createLocalePlugin({
  default: 'en',
  messages: {
    en: { /* ... */ },
    de: { /* ... */ },
  }
}))

// Date plugin will auto-sync with locale
app.use(createDatePlugin({
  localeMap: {
    en: 'en-US',  // Map short codes to Intl locales
    de: 'de-DE',
  }
}))
```

When switching locales via `useLocale`, the date adapter automatically updates its formatting locale.

## Custom Adapters

Create custom adapters for different date libraries (date-fns, luxon, dayjs):

```ts
import type { DateAdapter } from '@vuetify/v0'

class DateFnsAdapter implements DateAdapter<Date> {
  locale = 'en-US'

  date(value?: unknown): Date | null {
    if (value == null) return new Date()
    if (value instanceof Date) return value
    if (typeof value === 'string') return parseISO(value)
    if (typeof value === 'number') return new Date(value)
    return null
  }

  format(date: Date, formatString: string): string {
    // Use date-fns format function
    return dateFnsFormat(date, this.getDateFnsFormat(formatString))
  }

  // Implement remaining methods...
}

// Use with plugin
app.use(createDatePlugin({
  adapter: new DateFnsAdapter(),
}))
```

## Known Limitations

- **parse() format parameter**: The `parse()` method's format parameter is currently ignored. The Temporal API doesn't provide built-in format parsing. The method delegates to `date()` which handles ISO 8601 strings. For custom format parsing, use a library like date-fns or luxon with a custom adapter.

- **SSR Behavior**: When `adapter.date()` is called without arguments:
  - Browser: Returns current time via `Temporal.Now.plainDateTimeISO()`
  - Server: Returns epoch (1970-01-01T00:00:00) for deterministic rendering

  This is intentional to prevent hydration mismatches. For SSR apps needing current time, pass `Date.now()` explicitly and handle hydration via `<ClientOnly>` (Nuxt) or `v-if` + `onMounted` pattern.

- **Timezone-dependent formatting**: `Intl.DateTimeFormat` uses the system timezone. Server environments (often UTC) and client browsers (user's local timezone) may produce different formatted strings, causing hydration mismatches.

  **Solutions:**
  - Set `TZ=UTC` environment variable on your server to match a consistent baseline
  - Wrap formatted date output in `<ClientOnly>` (Nuxt) or render only after `onMounted`
  - For critical date displays, serialize dates as ISO strings and format client-side only
