export type {
  CalendarUnit,
  EmCalendarCell,
  EmCalendarContext,
  EmCalendarEvent,
  EmCalendarTone,
} from './context'

export { EM_CALENDAR_NAMESPACE, useEmCalendarContext } from './context'

export type { EmCalendarWeekday } from './date'

export type { EmCalendarGridProps } from './EmCalendarGrid.vue'

/** The month grid — weekday header plus 42 day cells, wired to the APG grid pattern. */
export { default as EmCalendarGrid } from './EmCalendarGrid.vue'

export type { EmCalendarHeaderProps } from './EmCalendarHeader.vue'
export { default as EmCalendarHeader } from './EmCalendarHeader.vue'

export type { EmCalendarMiniProps } from './EmCalendarMini.vue'

/** Compact month with tone dots — a nav widget, deliberately not a grid. */
export { default as EmCalendarMini } from './EmCalendarMini.vue'

export type { EmCalendarNextProps } from './EmCalendarNext.vue'
export { default as EmCalendarNext } from './EmCalendarNext.vue'

export type { EmCalendarPrevProps } from './EmCalendarPrev.vue'
export { default as EmCalendarPrev } from './EmCalendarPrev.vue'

export type { EmCalendarTitleProps } from './EmCalendarTitle.vue'
export { default as EmCalendarTitle } from './EmCalendarTitle.vue'

export type { EmCalendarTodayProps } from './EmCalendarToday.vue'
export { default as EmCalendarToday } from './EmCalendarToday.vue'

export type { EmCalendarProps } from './EmCalendar.vue'

// Context
import Root from './EmCalendar.vue'
import Grid from './EmCalendarGrid.vue'
import Header from './EmCalendarHeader.vue'
import Mini from './EmCalendarMini.vue'
import Next from './EmCalendarNext.vue'
import Prev from './EmCalendarPrev.vue'
import Title from './EmCalendarTitle.vue'
import Today from './EmCalendarToday.vue'

/**
 * Month calendar. Owns the visible-month cursor, day selection, and events;
 * provides the `emerald:calendar` context its children read.
 *
 * Sub-components are attached to the root, so one import reaches the whole
 * compound. The flat names (`EmCalendarGrid`) remain exported and valid.
 *
 * @example
 * ```vue
 * <script lang="ts" setup>
 *   import { EmCalendar } from '@paper/emerald'
 * </script>
 *
 * <template>
 *   <EmCalendar v-model="selected" v-model:month="month" :events>
 *     <EmCalendar.Header>
 *       <EmCalendar.Prev />
 *       <EmCalendar.Next />
 *       <EmCalendar.Title />
 *       <EmCalendar.Today />
 *     </EmCalendar.Header>
 *
 *     <EmCalendar.Grid />
 *   </EmCalendar>
 * </template>
 * ```
 */
export const EmCalendar = Object.assign(Root, {
  /** The month grid — weekday header plus 42 day cells, wired to the APG grid pattern. */
  Grid,
  /** Toolbar row above the grid; holds the nav and title controls. */
  Header,
  /** Compact month with tone dots — a nav widget, deliberately not a grid. */
  Mini,
  /** Advances the visible month. */
  Next,
  /** Rewinds the visible month. */
  Prev,
  /** Live label for the visible month, and the grid's accessible name. */
  Title,
  /** Jumps the cursor back to the current month. */
  Today,
})
