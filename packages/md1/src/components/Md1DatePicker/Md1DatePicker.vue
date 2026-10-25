<script lang="ts">
  // Framework
  import { Button, isString, useContext, useId, useLocale, useRovingFocus } from '@vuetify/v0'

  // Composables
  import { createDatePickerCore } from '../../composables/createDatePickerCore'

  // Utilities
  import { computed, nextTick, shallowRef, toRef, useTemplateRef, watch } from 'vue'

  // Types
  import type { DatePickerUnit } from '../../composables/createDatePickerCore'
  import type { ComponentPublicInstance, Ref } from 'vue'

  // Components
  import Md1Icon from '../Md1Icon/Md1Icon.vue'
  import Md1Ripple from '../Md1Ripple/Md1Ripple.vue'

  export interface Md1DatePickerProps {
    /**
     * The landscape layout: the header becomes a 168 dp column at the start
     * edge and the grid tightens to 46 x 32 dp cells (pickers page).
     */
    landscape?: boolean
    /** The weekday the grid starts on, 0 for Sunday. Defaults to the installed date plugin's locale, or Sunday. */
    firstDayOfWeek?: number
  }

  /**
   * The slice of the `md1:dialog` context a hosted picker reads. Typed
   * here, not imported, so the picker keeps no dependency on `Md1Dialog`.
   */
  interface Md1DatePickerHost {
    variant: Readonly<Ref<string>>
    isOpen: Readonly<Ref<boolean>>
    value: Readonly<Ref<unknown>>
    commit: (value: unknown) => void
  }

  /** Arrow keys in the grid: a day sideways, a week vertically (APG Date Picker Dialog). */
  const ARROWS: Record<string, [DatePickerUnit, number]> = {
    ArrowLeft: ['day', -1],
    ArrowRight: ['day', 1],
    ArrowUp: ['week', -1],
    ArrowDown: ['week', 1],
  }

  /** Horizontal travel, in px, that turns a press on the grid into a month swipe. */
  const SWIPE = 32

  /** The `YYYY-MM-DD` form the core works in. */
  function isIsoDate (value: unknown): value is string {
    return isString(value) && /^\d{4}-\d{2}-\d{2}$/.test(value)
  }

  function rtl (el: EventTarget | null): boolean {
    return el instanceof HTMLElement && getComputedStyle(el).direction === 'rtl'
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'Md1DatePicker' })

  const { landscape = false, firstDayOfWeek } = defineProps<Md1DatePickerProps>()

  const model = defineModel<string>()

  const locale = useLocale()

  const dialog = useContext<Md1DatePickerHost | null>('md1:dialog', null)

  // Inside a confirmation dialog the dialog holds the date until OK; the
  // picker reads and writes that, never its own model (dialogs page). When
  // the held value is not an ISO date (a field showing a long date), the
  // model is the consumer's ISO reading of it, so the picker opens there.
  const hosted = toRef(() => dialog?.variant.value === 'confirmation')

  const value = computed<string | undefined>({
    get: () => {
      if (!hosted.value) return model.value

      const held = dialog?.value.value

      if (isIsoDate(held)) return held

      return isIsoDate(model.value) ? model.value : undefined
    },
    set: next => {
      if (hosted.value) dialog?.commit(next)
      else model.value = next
    },
  })

  const picker = createDatePickerCore({ value, firstDayOfWeek: () => firstDayOfWeek })

  const id = useId()
  const ids = {
    date: `${id}-date`,
    month: `${id}-month`,
  }

  const view = toRef(() => picker.view.value)
  const focused = toRef(() => picker.focused.value)

  const days = new Map<string, HTMLElement>()
  const years = new Map<number, HTMLElement>()

  function bind<K> (map: Map<K, HTMLElement>, key: K, el: Element | ComponentPublicInstance | null) {
    if (el instanceof HTMLElement) map.set(key, el)
    else map.delete(key)
  }

  const cells = toRef(() => picker.weeks.value.flat().map(cell => ({
    id: cell.iso,
    disabled: cell.outside,
    el: () => days.get(cell.iso),
  })))

  // Day-to-day and week-to-week movement inside the month; the keydown
  // handler pages the month itself when a step would leave it.
  const grid = useRovingFocus(() => cells.value, {
    columns: 7,
    onFocus: iso => picker.focus(String(iso)),
  })

  const list = useRovingFocus(() => picker.years.value.map(entry => ({
    id: entry.year,
    el: () => years.get(entry.year),
  })), { orientation: 'vertical' })

  const yearList = useTemplateRef<HTMLElement>('yearList')

  // The slide direction of the month grid, set when the visible month changes.
  const direction = shallowRef<'next' | 'prev'>()

  watch(() => picker.anchor.value, (next, prev) => {
    direction.value = next > prev ? 'next' : 'prev'
  })

  // A dialog reopening starts on the calendar, not where it was left.
  watch(() => dialog?.isOpen.value, open => {
    if (open) picker.show('date')
  })

  const labels = toRef(() => ({
    year: locale.ti('Md1.chooseYear') ?? 'Choose year',
    years: locale.ti('Md1.year') ?? 'Year',
    prev: locale.ti('Md1.previousMonth') ?? 'Previous month',
    next: locale.ti('Md1.nextMonth') ?? 'Next month',
  }))

  function refocus () {
    nextTick(() => grid.focus(picker.focused.value))
  }

  function onSelect (iso: string) {
    picker.select(iso)
    grid.focusedId.value = iso
  }

  function onDayFocus (iso: string) {
    grid.focusedId.value = iso
    picker.focus(iso)
  }

  function onKeydown (event: KeyboardEvent) {
    if (event.key === 'PageUp' || event.key === 'PageDown') {
      event.preventDefault()
      picker.move(event.shiftKey ? 'year' : 'month', event.key === 'PageUp' ? -1 : 1)
      refocus()

      return
    }

    const arrow = ARROWS[event.key]

    if (!arrow) {
      grid.onKeydown(event)

      return
    }

    const [unit, amount] = arrow
    const step = unit === 'day' && rtl(event.currentTarget) ? -amount : amount
    const target = picker.peek(unit, step)

    // Inside the month the roving focus moves; across its edge the month pages first.
    if (target.startsWith(picker.anchor.value)) {
      grid.onKeydown(event)

      return
    }

    event.preventDefault()
    picker.focus(target)
    refocus()
  }

  let start: { x: number, y: number } | undefined

  function onPointerdown (event: PointerEvent) {
    start = { x: event.clientX, y: event.clientY }
  }

  // "Swipe left to right to navigate through the months" (pickers page): the
  // chevrons and PageUp / PageDown are the baseline, the swipe the enhancement.
  function onPointerup (event: PointerEvent) {
    if (!start) return

    const dx = event.clientX - start.x
    const dy = event.clientY - start.y

    start = undefined

    if (Math.abs(dx) < SWIPE || Math.abs(dx) < Math.abs(dy)) return

    const back = rtl(event.currentTarget) ? dx < 0 : dx > 0

    if (back) picker.prev()
    else picker.next()
  }

  function onPointercancel () {
    start = undefined
  }

  // The selected year sits in the middle of the list when it opens (pickers page, year view).
  function center () {
    const el = years.get(picker.year.value)
    const host = yearList.value

    if (!el || !host) return

    host.scrollTop = el.offsetTop - (host.clientHeight - el.offsetHeight) / 2
    list.focus(picker.year.value)
  }

  function onYear () {
    if (view.value === 'year') {
      picker.show('date')

      return
    }

    picker.show('year')
    nextTick(center)
  }

  function onPick (year: number) {
    picker.setYear(year)
    refocus()
  }

  function onYearKeydown (event: KeyboardEvent, year: number) {
    if (event.key !== 'Enter' && event.key !== ' ') return

    event.preventDefault()
    onPick(year)
  }
</script>

<template>
  <div
    :aria-labelledby="ids.date"
    class="md1-date-picker"
    :data-landscape="landscape || undefined"
    :data-view="view"
    role="group"
  >
    <div class="md1-date-picker__header">
      <!-- Renderless so the year can carry aria-pressed: Button.Root's own attrs would overwrite it. -->
      <Button.Root v-slot="{ attrs }" :aria-label="`${labels.year} ${picker.yearLabel.value}`" renderless>
        <button
          v-bind="attrs"
          :aria-pressed="view === 'year'"
          class="md1-date-picker__year"
          @click="onYear"
        >
          <Md1Ripple />

          <span class="md1-date-picker__text">{{ picker.yearLabel.value }}</span>
        </button>
      </Button.Root>

      <div :id="ids.date" class="md1-date-picker__date">{{ picker.heading.value }}</div>
    </div>

    <div class="md1-date-picker__body">
      <template v-if="view === 'date'">
        <div class="md1-date-picker__nav">
          <Button.Root
            :aria-label="labels.prev"
            class="md1-date-picker__step"
            @click="picker.prev()"
          >
            <Md1Ripple />

            <Md1Icon name="chevron-left" />
          </Button.Root>

          <div :id="ids.month" aria-live="polite" class="md1-date-picker__month">{{ picker.label.value }}</div>

          <Button.Root
            :aria-label="labels.next"
            class="md1-date-picker__step"
            @click="picker.next()"
          >
            <Md1Ripple />

            <Md1Icon name="chevron-right" />
          </Button.Root>
        </div>

        <table
          :aria-labelledby="ids.month"
          class="md1-date-picker__grid"
          role="grid"
          @keydown="onKeydown"
          @pointercancel="onPointercancel"
          @pointerdown="onPointerdown"
          @pointerup="onPointerup"
        >
          <thead>
            <tr>
              <th
                v-for="(weekday, index) in picker.weekdays.value"
                :key="index"
                :abbr="weekday.long"
                :aria-label="weekday.long"
                class="md1-date-picker__weekday"
                scope="col"
              >
                {{ weekday.narrow }}
              </th>
            </tr>
          </thead>

          <tbody :key="picker.anchor.value" class="md1-date-picker__weeks" :data-direction="direction">
            <tr v-for="(week, row) in picker.weeks.value" :key="row">
              <td
                v-for="cell in week"
                :key="cell.iso"
                :aria-selected="cell.outside ? undefined : picker.isSelected(cell.iso)"
                class="md1-date-picker__cell"
                role="gridcell"
              >
                <Button.Root
                  v-if="!cell.outside"
                  v-slot="{ attrs }"
                  :aria-label="picker.name(cell.iso)"
                  renderless
                >
                  <button
                    :ref="el => bind(days, cell.iso, el)"
                    v-bind="attrs"
                    :aria-current="cell.today ? 'date' : undefined"
                    :autofocus="hosted && cell.iso === focused"
                    class="md1-date-picker__day"
                    :data-selected="picker.isSelected(cell.iso) || undefined"
                    :data-today="cell.today || undefined"
                    :tabindex="cell.iso === focused ? 0 : -1"
                    @click="onSelect(cell.iso)"
                    @focus="onDayFocus(cell.iso)"
                  >
                    <Md1Ripple />

                    <span class="md1-date-picker__text">{{ cell.day }}</span>
                  </button>
                </Button.Root>
              </td>
            </tr>
          </tbody>
        </table>
      </template>

      <ul
        v-else
        ref="yearList"
        :aria-label="labels.years"
        class="md1-date-picker__years"
        role="listbox"
        @keydown="list.onKeydown"
      >
        <li
          v-for="entry in picker.years.value"
          :key="entry.year"
          :ref="el => bind(years, entry.year, el)"
          :aria-selected="entry.year === picker.year.value"
          class="md1-date-picker__option"
          :data-selected="entry.year === picker.year.value || undefined"
          role="option"
          :tabindex="list.isTabbable(entry.year) ? 0 : -1"
          @click="onPick(entry.year)"
          @focus="list.focusedId.value = entry.year"
          @keydown="onYearKeydown($event, entry.year)"
        >
          <Md1Ripple />

          <span class="md1-date-picker__text">{{ entry.label }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<!--
  Unscoped, like every Material Design 1 stylesheet. Portrait: 328 dp wide (never wider
  than its container, so a 320 dp screen or a narrow dialog narrows the day columns), the 96 dp
  header over a 48 dp navigation row, a 40 dp weekday row and six 40 dp week
  rows (424 dp; the confirmation dialog's 60 dp action area makes the page's
  484). Landscape: a 168 dp header column beside a 344 dp body of 32 dp rows.
-->
<style>
  .md1-date-picker {
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    width: 328px;
    max-width: 100%;
    overflow: hidden;
    background: var(--md1-surface, #FFFFFF);
    border-radius: var(--md1-radius, 2px);
    color: var(--md1-text-primary, rgba(0, 0, 0, 0.87));
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
  }

  .md1-date-picker[data-landscape] {
    flex-direction: row;
    width: 512px;
    max-width: none;
  }

  /* The header band in the primary colour (Grey 700 on the dark theme): the year above the date, 24 dp from the start edge. */
  .md1-date-picker__header {
    display: flex;
    flex: none;
    flex-direction: column;
    align-items: flex-start;
    box-sizing: border-box;
    height: 96px;
    padding: var(--md1-spacing-2, 16px) var(--md1-spacing-3, 24px);
    background: var(--md1-primary, #3F51B5);
    color: var(--md1-on-primary, #FFFFFF);
  }

  [data-theme='md1-dark'] .md1-date-picker__header {
    background: var(--md1-grey-700, #616161);
  }

  .md1-date-picker[data-landscape] .md1-date-picker__header {
    width: 168px;
    height: auto;
  }

  /*
   * The header year: Body 2 size at the inactive 70% while the calendar shows,
   * 100% in the year view. The 24 px line keeps a 48 dp hit area above and below
   * without growing the band.
   */
  .md1-date-picker__year {
    position: relative;
    display: inline-flex;
    align-items: center;
    height: 24px;
    margin: 0;
    padding: 0;
    border: 0;
    border-radius: var(--md1-radius, 2px);
    background: transparent;
    color: inherit;
    font-family: inherit;
    font-size: var(--md1-type-body-2-size, 14px);
    font-weight: var(--md1-type-body-2-weight, 500);
    letter-spacing: var(--md1-type-body-2-tracking, 0.01em);
    line-height: 24px;
    opacity: 0.7;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    transition: opacity var(--md1-duration-standard, 300ms) var(--md1-easing-standard, cubic-bezier(0.4, 0, 0.2, 1));
  }

  .md1-date-picker__year::after {
    content: '';
    position: absolute;
    inset: calc((24px - var(--md1-touch-target, 48px)) / 2) 0;
  }

  /* The selected date: Display 1 (34 sp, 40 dp leading) at 100%, 70% while the year view is up. */
  .md1-date-picker__date {
    margin: 0;
    font-size: var(--md1-type-display-1-size, 34px);
    font-weight: var(--md1-type-display-1-weight, 400);
    letter-spacing: var(--md1-type-display-1-tracking, 0);
    line-height: var(--md1-type-display-1-leading, 40px);
    white-space: nowrap;
    transition: opacity var(--md1-duration-standard, 300ms) var(--md1-easing-standard, cubic-bezier(0.4, 0, 0.2, 1));
  }

  /* Landscape: the date wraps to two lines ("Thu," over "Apr 13") at the 40 dp pitch. */
  .md1-date-picker[data-landscape] .md1-date-picker__date {
    white-space: normal;
  }

  .md1-date-picker[data-view='year'] .md1-date-picker__year {
    opacity: 1;
  }

  .md1-date-picker[data-view='year'] .md1-date-picker__date {
    opacity: 0.7;
  }

  .md1-date-picker__year:focus-visible {
    outline: 2px solid transparent;
    background-color: var(--md1-focus, rgba(0, 0, 0, 0.12));
  }

  /* The body keeps one height in both views so the sheet never reflows when the year list replaces the grid. */
  .md1-date-picker__body {
    display: flex;
    flex: none;
    flex-direction: column;
    box-sizing: border-box;
    height: 328px;
  }

  .md1-date-picker[data-landscape] .md1-date-picker__body {
    width: 344px;
    height: 272px;
  }

  /* The 48 dp navigation row: chevrons 16 dp from the edges at 54% (100% on dark), the month in Body 2. */
  .md1-date-picker__nav {
    display: flex;
    flex: none;
    align-items: center;
    justify-content: space-between;
    height: 48px;
    padding: 0 4px;
  }

  .md1-date-picker__step {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: var(--md1-touch-target, 48px);
    height: var(--md1-touch-target, 48px);
    margin: 0;
    padding: 0;
    border: 0;
    border-radius: 50%;
    background: transparent;
    color: var(--md1-icon-active, rgba(0, 0, 0, 0.54));
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }

  .md1-date-picker__step:focus-visible {
    outline: 2px solid transparent;
    background-color: var(--md1-focus, rgba(0, 0, 0, 0.12));
  }

  .md1-date-picker__step .md1-icon {
    position: relative;
  }

  .md1-date-picker__month {
    flex: 1;
    min-width: 0;
    font-size: var(--md1-type-body-2-size, 14px);
    font-weight: var(--md1-type-body-2-weight, 500);
    letter-spacing: var(--md1-type-body-2-tracking, 0.01em);
    line-height: var(--md1-type-body-2-leading, 24px);
    text-align: center;
  }

  /* Seven 44 dp columns inside 10 dp side margins; the grid takes no vertical pan so a horizontal swipe reaches it. */
  .md1-date-picker__grid {
    box-sizing: border-box;
    width: calc(100% - 20px);
    margin: 0 10px;
    border-collapse: collapse;
    border-spacing: 0;
    table-layout: fixed;
    touch-action: pan-y;
    user-select: none;
  }

  .md1-date-picker[data-landscape] .md1-date-picker__grid {
    width: calc(100% - 22px);
    margin: 0 11px;
  }

  /* The weekday initials: 12 sp at the hint ink (38%, 50% on dark) in a 40 dp row. */
  .md1-date-picker__weekday {
    height: 40px;
    padding: 0;
    border: 0;
    background: transparent;
    color: var(--md1-text-hint, rgba(0, 0, 0, 0.38));
    font-size: var(--md1-type-caption-size, 12px);
    font-weight: var(--md1-type-caption-weight, 400);
    line-height: 1;
    text-align: center;
  }

  .md1-date-picker[data-landscape] .md1-date-picker__weekday {
    height: 32px;
  }

  .md1-date-picker__cell {
    height: 40px;
    padding: 0;
    border: 0;
    background: transparent;
    text-align: center;
  }

  .md1-date-picker[data-landscape] .md1-date-picker__cell {
    height: 32px;
  }

  /* A day: 12 sp in a 40 dp circle (32 dp landscape), the selection's shape; a column narrower than the circle shrinks it. */
  .md1-date-picker__day {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    max-width: 100%;
    aspect-ratio: 1;
    margin: 0;
    padding: 0;
    border: 0;
    border-radius: 50%;
    background: transparent;
    color: inherit;
    font-family: inherit;
    font-size: var(--md1-type-caption-size, 12px);
    font-weight: var(--md1-font-weight-regular, 400);
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    transition:
      background-color var(--md1-duration-standard, 300ms) var(--md1-easing-standard, cubic-bezier(0.4, 0, 0.2, 1)),
      color var(--md1-duration-standard, 300ms) var(--md1-easing-standard, cubic-bezier(0.4, 0, 0.2, 1));
  }

  .md1-date-picker[data-landscape] .md1-date-picker__day {
    width: 32px;
  }

  /* The current day: "a different color and type weight". */
  .md1-date-picker__day[data-today] {
    color: var(--md1-primary, #3F51B5);
    font-weight: var(--md1-font-weight-bold, 700);
  }

  /* The selected day: "a filled circle" in the primary colour with white ink. */
  .md1-date-picker__day[data-selected] {
    background: var(--md1-primary, #3F51B5);
    color: var(--md1-on-primary, #FFFFFF);
  }

  /* Dark theme: selection ink is the accent's 200 swatch with dark text (pickers and selection-controls pages). */
  [data-theme='md1-dark'] .md1-date-picker__day[data-today] {
    color: var(--md1-accent-control, #F48FB1);
  }

  [data-theme='md1-dark'] .md1-date-picker__day[data-selected] {
    background: var(--md1-accent-control, #F48FB1);
    color: var(--md1-black, #000000);
  }

  /*
   * The page states no hover or focus for a day: a day is Vuetify 1.5's flat
   * button, a 12% overlay of its own ink on hover (_buttons.styl:62-68), and
   * keyboard focus takes the buttons page's 12%.
   */
  @media (hover: hover) {
    .md1-date-picker__day:not([data-selected]):hover {
      background-color: color-mix(in srgb, currentcolor 12%, transparent);
    }
  }

  .md1-date-picker__day:focus-visible {
    outline: 2px solid transparent;
  }

  .md1-date-picker__day:not([data-selected]):focus-visible {
    background-color: var(--md1-focus, rgba(0, 0, 0, 0.12));
  }

  .md1-date-picker__day[data-selected]:focus-visible {
    background-color: color-mix(in srgb, var(--md1-black, #000000) 12%, var(--md1-primary, #3F51B5));
  }

  [data-theme='md1-dark'] .md1-date-picker__day[data-selected]:focus-visible {
    background-color: color-mix(in srgb, var(--md1-black, #000000) 12%, var(--md1-accent-control, #F48FB1));
  }

  /* Positioned so the text paints above the ripple's ink layer. */
  .md1-date-picker__text {
    position: relative;
  }

  /* The month grid slides in the direction of travel while the header stays (the page's navigation video). */
  .md1-date-picker__weeks[data-direction='next'] {
    animation: md1-date-picker-next var(--md1-duration-standard, 300ms) var(--md1-easing-decelerate, cubic-bezier(0, 0, 0.2, 1));
  }

  .md1-date-picker__weeks[data-direction='prev'] {
    animation: md1-date-picker-prev var(--md1-duration-standard, 300ms) var(--md1-easing-decelerate, cubic-bezier(0, 0, 0.2, 1));
  }

  [dir='rtl'] .md1-date-picker__weeks[data-direction='next'] {
    animation-name: md1-date-picker-prev;
  }

  [dir='rtl'] .md1-date-picker__weeks[data-direction='prev'] {
    animation-name: md1-date-picker-next;
  }

  @keyframes md1-date-picker-next {
    from {
      opacity: 0;
      transform: translateX(32px);
    }
  }

  @keyframes md1-date-picker-prev {
    from {
      opacity: 0;
      transform: translateX(-32px);
    }
  }

  body[data-reduced-motion='reduce'] .md1-date-picker__weeks {
    animation: none;
  }

  @media (prefers-reduced-motion: reduce) {
    body:not([data-reduced-motion='no-preference']) .md1-date-picker__weeks {
      animation: none;
    }
  }

  /* The year view: a scrolling list of 44 dp rows in Subheading, the selected year in Headline size and the primary colour. */
  .md1-date-picker__years {
    position: relative;
    flex: 1;
    min-height: 0;
    margin: 0;
    padding: 0;
    overflow-y: auto;
    list-style: none;
    overscroll-behavior: contain;
  }

  .md1-date-picker__option {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 44px;
    font-size: var(--md1-type-subheading-size, 16px);
    font-weight: var(--md1-type-subheading-weight, 400);
    letter-spacing: var(--md1-type-subheading-tracking, 0.01em);
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }

  .md1-date-picker__option[data-selected] {
    height: 56px;
    color: var(--md1-primary, #3F51B5);
    font-size: var(--md1-type-headline-size, 24px);
    font-weight: var(--md1-font-weight-medium, 500);
  }

  [data-theme='md1-dark'] .md1-date-picker__option[data-selected] {
    color: var(--md1-accent-control, #F48FB1);
  }

  /* A year on hover: black 12% in both themes, Vuetify 1.5's year list (_date-picker-years.styl:22-23; the page states none). */
  @media (hover: hover) {
    .md1-date-picker__option:hover {
      background-color: color-mix(in srgb, var(--md1-black, #000000) 12%, transparent);
    }
  }

  .md1-date-picker__option:focus-visible {
    outline: 2px solid transparent;
    background-color: var(--md1-focus, rgba(0, 0, 0, 0.12));
  }
</style>
