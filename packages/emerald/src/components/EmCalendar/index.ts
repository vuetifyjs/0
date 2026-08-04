export type {
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

/**
 * Month calendar. Owns the visible-month cursor, day selection, and events;
 * provides the `emerald:calendar` context its children read.
 *
 * @example
 * ```vue
 * <EmCalendar v-model="selected" v-model:month="month" :events>
 *   <EmCalendarHeader>
 *     <EmCalendarPrev />
 *     <EmCalendarNext />
 *     <EmCalendarTitle />
 *     <EmCalendarToday />
 *   </EmCalendarHeader>
 *
 *   <EmCalendarGrid />
 * </EmCalendar>
 * ```
 */
export { default as EmCalendar } from './EmCalendar.vue'
