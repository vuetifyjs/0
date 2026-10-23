<script lang="ts">
  // Framework
  import { isElement, isNull, isString, Radio, Toggle, useLocale, useLogger } from '@vuetify/v0'

  // Composables
  import { parseTime, useClock } from '../../composables/useClock'

  // Utilities
  import { nextTick, shallowRef, toRef, useTemplateRef, watch } from 'vue'

  // Types
  import type { ClockFormat, ClockNumber, ClockPeriod, ClockView } from '../../composables/useClock'
  import type { RadioGroupExpose } from '@vuetify/v0'

  // Components
  import Md1Ripple from '../Md1Ripple/Md1Ripple.vue'

  /** The pickers page's two clocks: 12 hour with AM and PM, and 24 hour. */
  export type Md1TimePickerFormat = ClockFormat

  export interface Md1TimePickerProps {
    /**
     * `12` draws 12 and 1 to 11 with the AM and PM labels in the header; `24`
     * adds an inner ring for 00 and 13 to 23 (the page names the mode and does
     * not draw it, so the inner ring is an interpretation).
     */
    format?: Md1TimePickerFormat
    /** The landscape layout: the header becomes a 168 dp start column and the face drops to 224 dp. */
    landscape?: boolean
  }

  interface Geometry {
    /** Face diameter. */
    face: number
    /** Outer ring radius from the face centre. */
    radius: number
    /** Diameter of the filled target at the end of the hand. */
    target: number
  }

  /*
   * Measured from the pickers page artwork at 2 px per dp (spec/components/pickers.md
   * 4.4 and 4.5, `moderate`): a 296 dp face with the numbers on a 124 dp radius and a
   * 40 dp target; landscape 224 dp with a 36 dp target. The landscape radius is not
   * measured; it keeps the portrait 24 dp between the ring and the face edge.
   */
  const PORTRAIT: Geometry = { face: 296, radius: 124, target: 40 }
  const LANDSCAPE: Geometry = { face: 224, radius: 88, target: 36 }

  /** The 24 hour inner ring sits at 62% of the outer radius: Vuetify 1.5's `innerRadiusScale` (the spec draws no inner ring). */
  const INNER = 0.62

  /** The 6 dp dot the hand grows from. */
  const DOT = 3
</script>

<script setup lang="ts">
  defineOptions({ name: 'Md1TimePicker' })

  const { format = '12', landscape = false } = defineProps<Md1TimePickerProps>()

  /** `HH:mm` on a 24 hour clock, whatever `format` displays. */
  const model = defineModel<string>()

  const locale = useLocale()
  const logger = useLogger()

  const clock = useClock({ value: () => model.value, format: () => format })

  const numbers = useTemplateRef<RadioGroupExpose>('numbers')

  const geometry = toRef(() => landscape ? LANDSCAPE : PORTRAIT)
  const center = toRef(() => geometry.value.face / 2)
  const inner = toRef(() => geometry.value.radius * INNER)

  // The hand ends on the ring the value sits on: the inner ring only for 00 and 13 to 23.
  const length = toRef(() => clock.ring.value === 'inner' ? inner.value : geometry.value.radius)

  // A minute between the fives has no printed number; the target carries a dot instead.
  const printed = toRef(() => clock.numbers.value.find(number => number.value === clock.selected.value)?.labelled ?? true)

  // The hand turns the short way round: 55 to 00 is one step clockwise, not a lap back.
  const turn = shallowRef(clock.angle.value)

  watch(clock.angle, (next, previous) => {
    turn.value += ((next - previous + 540) % 360) - 180
  })

  const dragging = shallowRef(false)

  const hoursLabel = toRef(() => locale.ti('Md1.hours') ?? 'Hours')
  const minutesLabel = toRef(() => locale.ti('Md1.minutes') ?? 'Minutes')
  const viewLabel = toRef(() => locale.ti('Md1.time') ?? 'Time')
  const periodLabel = toRef(() => locale.ti('Md1.period') ?? 'AM or PM')
  const amLabel = toRef(() => locale.ti('Md1.am') ?? 'AM')
  const pmLabel = toRef(() => locale.ti('Md1.pm') ?? 'PM')
  const ringLabel = toRef(() => clock.view.value === 'hour' ? hoursLabel.value : minutesLabel.value)

  if (__DEV__) {
    watch(() => model.value, value => {
      if (isString(value) && value !== '' && !parseTime(value)) {
        logger.warn(`[Md1TimePicker] "${value}" is not a 24 hour HH:mm time; the face keeps its last value`)
      }
    }, { immediate: true })
  }

  /** Where a ring value sits on the face, as offsets from its top-left corner. */
  function place (number: ClockNumber) {
    const radius = number.ring === 'inner' ? inner.value : geometry.value.radius
    const radians = number.angle * Math.PI / 180

    return {
      left: `${center.value + radius * Math.sin(radians)}px`,
      top: `${center.value - radius * Math.cos(radians)}px`,
    }
  }

  function write () {
    model.value = clock.value.value
  }

  function select (value: number) {
    if (clock.view.value === 'hour') clock.selectHour(value)
    else clock.selectMinute(value)

    write()
  }

  function onView (value: unknown) {
    if (value === 'hour' || value === 'minute') clock.view.value = value as ClockView
  }

  function onPeriod (value: unknown) {
    if (value !== 'am' && value !== 'pm') return

    clock.selectPeriod(value as ClockPeriod)
    write()
  }

  function onNumber (value: unknown) {
    if (Number.isInteger(value)) select(value as number)
  }

  /**
   * Selecting an hour moves to the minutes (pickers page, the time transition
   * video). The switch waits a tick so the radio's own select, and the model
   * round trip it starts, land on the hour ring before the minute ring replaces it.
   */
  async function advance (focus: boolean) {
    if (clock.view.value !== 'hour') return

    await nextTick()
    clock.advance()

    if (!focus) return

    await nextTick()
    numbers.value?.focus()
  }

  function radio (event: Event): boolean {
    return isElement(event.target) && !isNull(event.target.closest('.md1-time-picker__number'))
  }

  // Bound on the face, so they run after Radio.Root's own handlers once the event bubbles.
  // Enter commits the hour the arrows landed on and hands the keyboard to the minute ring.
  function onKeydown (event: KeyboardEvent) {
    if (event.key === 'Enter' && radio(event)) advance(true)
  }

  // Assistive technology activates a radio with a click that no pointer press preceded.
  function onClick (event: MouseEvent) {
    if (event.detail === 0 && radio(event)) advance(true)
  }

  function pick (event: PointerEvent) {
    const el = event.currentTarget as HTMLElement
    const rect = el.getBoundingClientRect()
    const x = event.clientX - rect.left - rect.width / 2
    const y = event.clientY - rect.top - rect.height / 2
    const scale = rect.width / geometry.value.face
    const distance = Math.hypot(x, y) / scale
    const angle = Math.atan2(x, -y) * 180 / Math.PI
    const deep = format === '24' && clock.view.value === 'hour' && distance < (geometry.value.radius + inner.value) / 2

    select(clock.pick(angle, deep))
  }

  function onPointerdown (event: PointerEvent) {
    if (event.button !== 0) return

    event.preventDefault()
    ;(event.currentTarget as HTMLElement).setPointerCapture(event.pointerId)
    dragging.value = true
    pick(event)
  }

  function onPointermove (event: PointerEvent) {
    if (dragging.value) pick(event)
  }

  function onPointerup (event: PointerEvent) {
    if (!dragging.value) return

    dragging.value = false
    pick(event)
    advance(false)
  }

  function onPointercancel () {
    dragging.value = false
  }
</script>

<template>
  <div
    class="md1-time-picker"
    :data-landscape="landscape || undefined"
    :data-period="clock.period.value"
    :data-view="clock.view.value"
  >
    <div class="md1-time-picker__header">
      <div class="md1-time-picker__time">
        <Toggle.Group
          class="md1-time-picker__view"
          :label="viewLabel"
          mandatory
          :model-value="clock.view.value"
          @update:model-value="onView"
        >
          <Toggle.Root
            :aria-label="`${hoursLabel} ${clock.hours.value}`"
            class="md1-time-picker__hours"
            value="hour"
          >
            <Md1Ripple />

            <span class="md1-time-picker__digits">{{ clock.hours.value }}</span>
          </Toggle.Root>

          <span aria-hidden="true" class="md1-time-picker__separator">:</span>

          <Toggle.Root
            :aria-label="`${minutesLabel} ${clock.minutes.value}`"
            class="md1-time-picker__minutes"
            value="minute"
          >
            <Md1Ripple />

            <span class="md1-time-picker__digits">{{ clock.minutes.value }}</span>
          </Toggle.Root>
        </Toggle.Group>

        <Radio.Group
          v-if="format === '12'"
          class="md1-time-picker__period"
          :label="periodLabel"
          mandatory="force"
          :model-value="clock.period.value"
          @update:model-value="onPeriod"
        >
          <Radio.Root class="md1-time-picker__meridiem" value="am">
            <Md1Ripple />

            <span class="md1-time-picker__text">{{ amLabel }}</span>
          </Radio.Root>

          <Radio.Root class="md1-time-picker__meridiem" value="pm">
            <Md1Ripple />

            <span class="md1-time-picker__text">{{ pmLabel }}</span>
          </Radio.Root>
        </Radio.Group>
      </div>
    </div>

    <div class="md1-time-picker__body">
      <Radio.Group
        :key="`${clock.view.value}-${clock.format.value}`"
        ref="numbers"
        class="md1-time-picker__clock"
        :data-dragging="dragging || undefined"
        :label="ringLabel"
        mandatory="force"
        :model-value="clock.selected.value"
        @click="onClick"
        @keydown="onKeydown"
        @lostpointercapture="onPointercancel"
        @pointercancel="onPointercancel"
        @pointerdown="onPointerdown"
        @pointermove="onPointermove"
        @pointerup="onPointerup"
        @update:model-value="onNumber"
      >
        <!-- Runtime geometry, not a glyph (SPEC.md, Deviations): the face, the hand and its target. -->
        <svg
          aria-hidden="true"
          class="md1-time-picker__face"
          :viewBox="`0 0 ${geometry.face} ${geometry.face}`"
        >
          <circle
            class="md1-time-picker__dial"
            :cx="center"
            :cy="center"
            :r="center"
          />

          <g class="md1-time-picker__hand" :style="{ transform: `rotate(${turn}deg)` }">
            <line
              class="md1-time-picker__line"
              :x1="center"
              :x2="center"
              :y1="center"
              :y2="center - length"
            />

            <circle
              class="md1-time-picker__dot"
              :cx="center"
              :cy="center"
              :r="DOT"
            />

            <circle
              class="md1-time-picker__target"
              :cx="center"
              :cy="center - length"
              :r="geometry.target / 2"
            />

            <circle
              v-if="!printed"
              class="md1-time-picker__pip"
              :cx="center"
              :cy="center - length"
              :r="DOT / 1.5"
            />
          </g>
        </svg>

        <Radio.Root
          v-for="number in clock.numbers.value"
          :key="number.value"
          class="md1-time-picker__number"
          :data-labelled="number.labelled || undefined"
          :data-ring="number.ring"
          :label="number.label"
          :style="place(number)"
          :value="number.value"
        >
          <Md1Ripple />

          <span v-if="number.labelled" class="md1-time-picker__text">{{ number.label }}</span>
        </Radio.Root>
      </Radio.Group>
    </div>
  </div>
</template>

<!-- Unscoped, like every Material Design 1 stylesheet: Radio.Root renders more than one root node. -->
<style>
  /*
   * Portrait (pickers page, measured): 328 dp wide, a 96 dp header band, the
   * 296 dp face 32 dp under it and 16 dp from the sides. The face ends 8 dp
   * above the dialog's 52 dp action area, which Md1Dialog supplies.
   */
  .md1-time-picker {
    display: inline-flex;
    flex-direction: column;
    box-sizing: border-box;
    width: 328px;
    overflow: hidden;
    border-radius: var(--md1-radius, 2px);
    background: var(--md1-surface, #FFFFFF);
    color: var(--md1-text-primary, rgba(0, 0, 0, 0.87));
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    vertical-align: top;
  }

  /* Landscape: a 168 dp header column beside a 344 dp body, 512 dp in all. */
  .md1-time-picker[data-landscape] {
    flex-direction: row;
    width: 512px;
  }

  .md1-time-picker__header {
    display: flex;
    flex: none;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    height: 96px;
    padding: 0 var(--md1-spacing-3, 24px);
    background: var(--md1-primary, #3F51B5);
    color: var(--md1-on-primary, #FFFFFF);
  }

  .md1-time-picker[data-landscape] .md1-time-picker__header {
    width: 168px;
    height: auto;
    padding: 0 var(--md1-spacing-2, 16px);
  }

  /* The digits, then the AM and PM stack 8 dp after them; landscape stacks the period under the time, centred. */
  .md1-time-picker__time {
    display: flex;
    align-items: center;
  }

  .md1-time-picker[data-landscape] .md1-time-picker__time {
    flex-direction: column;
  }

  .md1-time-picker__view {
    display: flex;
    align-items: center;
  }

  /*
   * The time digits: about 60 sp portrait and 48 sp landscape (measured); no
   * named MD1 style matches, so the sizes are literals with the Regular weight.
   */
  .md1-time-picker__hours,
  .md1-time-picker__minutes,
  .md1-time-picker__separator {
    font-size: 60px;
    font-weight: var(--md1-font-weight-regular, 400);
    line-height: 1;
  }

  .md1-time-picker[data-landscape] .md1-time-picker__hours,
  .md1-time-picker[data-landscape] .md1-time-picker__minutes,
  .md1-time-picker[data-landscape] .md1-time-picker__separator {
    font-size: 48px;
  }

  .md1-time-picker__hours,
  .md1-time-picker__minutes,
  .md1-time-picker__meridiem {
    position: relative;
    margin: 0;
    padding: 0 2px;
    border: 0;
    border-radius: var(--md1-radius, 2px);
    background: transparent;
    color: inherit;
    font-family: inherit;
    cursor: pointer;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
    transition: opacity var(--md1-duration-standard, 300ms) var(--md1-easing-standard, cubic-bezier(0.4, 0, 0.2, 1));
  }

  /* The inactive segment, the colon and the unselected period read at 70% white (measured); the active one at 100%. */
  .md1-time-picker__hours,
  .md1-time-picker__minutes,
  .md1-time-picker__separator,
  .md1-time-picker__meridiem {
    opacity: 0.7;
  }

  .md1-time-picker__hours[data-state='on'],
  .md1-time-picker__minutes[data-state='on'],
  .md1-time-picker__meridiem[data-state='checked'] {
    opacity: 1;
  }

  /*
   * The pickers page states no hover: lead decision 3's 6% currentColor overlay,
   * which reads as white 6% on the primary band. Declared before focus so the
   * 12% focus overlay wins on a hovered, focused button.
   */
  @media (hover: hover) {
    .md1-time-picker__hours:hover,
    .md1-time-picker__minutes:hover,
    .md1-time-picker__meridiem:hover {
      background-color: color-mix(in srgb, currentcolor 6%, transparent);
    }
  }

  .md1-time-picker__hours:focus-visible,
  .md1-time-picker__minutes:focus-visible,
  .md1-time-picker__meridiem:focus-visible {
    outline: 2px solid transparent;
    background-color: color-mix(in srgb, currentcolor 12%, transparent);
  }

  /* AM and PM: about 14 sp in capitals, stacked (measured). */
  .md1-time-picker__period {
    display: flex;
    flex-direction: column;
    margin-inline-start: var(--md1-spacing-1, 8px);
  }

  .md1-time-picker[data-landscape] .md1-time-picker__period {
    align-items: center;
    margin: var(--md1-spacing-1, 8px) 0 0;
  }

  .md1-time-picker__meridiem {
    padding: 2px 4px;
    font-size: var(--md1-type-body-2-size, 14px);
    font-weight: var(--md1-type-body-2-weight, 500);
    line-height: var(--md1-type-body-2-leading, 24px);
    text-transform: uppercase;
  }

  /* Positioned so the label paints above the ink layer. */
  .md1-time-picker__digits,
  .md1-time-picker__text {
    position: relative;
  }

  .md1-time-picker__body {
    padding: 32px var(--md1-spacing-2, 16px) var(--md1-spacing-1, 8px);
  }

  /* Landscape: the 224 dp face centred in the 344 dp body, 20 dp from the top. */
  .md1-time-picker[data-landscape] .md1-time-picker__body {
    padding: 20px 60px var(--md1-spacing-1, 8px);
  }

  /* The face owns every pointer press, so a drag can sweep the hand round the ring. */
  .md1-time-picker__clock {
    position: relative;
    width: 296px;
    height: 296px;
    margin: 0 auto;
    touch-action: none;
    user-select: none;
    cursor: pointer;
  }

  .md1-time-picker[data-landscape] .md1-time-picker__clock {
    width: 224px;
    height: 224px;
  }

  .md1-time-picker__face {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    overflow: visible;
  }

  /* Grey 200 on the light theme, Grey 700 on the dark one (measured). */
  .md1-time-picker__dial {
    fill: var(--md1-grey-200, #EEEEEE);
  }

  /* The hand: 2 dp in the primary colour from a 6 dp dot to the filled target; it sweeps to each new value. */
  .md1-time-picker__hand {
    transform-box: view-box;
    transform-origin: center;
    transition: transform var(--md1-duration-standard, 300ms) var(--md1-easing-standard, cubic-bezier(0.4, 0, 0.2, 1));
  }

  .md1-time-picker__clock[data-dragging] .md1-time-picker__hand {
    transition: none;
  }

  .md1-time-picker__line {
    stroke: var(--md1-primary, #3F51B5);
    stroke-width: 2px;
  }

  .md1-time-picker__dot,
  .md1-time-picker__target {
    fill: var(--md1-primary, #3F51B5);
  }

  .md1-time-picker__pip {
    fill: var(--md1-on-primary, #FFFFFF);
  }

  /*
   * One radio per ring value, centred on its place. The face takes the pointer
   * (pointer-events none here), so a press anywhere on the ring picks the
   * nearest value; the radios carry the keyboard and the accessible names.
   */
  .md1-time-picker__number {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    width: 40px;
    height: 40px;
    margin: 0;
    padding: 0;
    border: 0;
    border-radius: 50%;
    background: transparent;
    color: var(--md1-text-primary, rgba(0, 0, 0, 0.87));
    font-family: inherit;
    font-size: var(--md1-type-subheading-size, 16px);
    font-weight: var(--md1-type-subheading-weight, 400);
    letter-spacing: var(--md1-type-subheading-tracking, 0.01em);
    line-height: 1;
    transform: translate(-50%, -50%);
    pointer-events: none;
  }

  .md1-time-picker[data-landscape] .md1-time-picker__number {
    width: 36px;
    height: 36px;
  }

  /* The 24 hour inner ring (an interpretation): Body 1 size in the secondary ink, under the outer hours. */
  .md1-time-picker__number[data-ring='inner'] {
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
    font-size: var(--md1-type-body-1-size, 14px);
  }

  /* The selected value reads white on the filled target. */
  .md1-time-picker__number[data-state='checked'] {
    color: var(--md1-on-primary, #FFFFFF);
  }

  /* Keyboard focus: the 12% focus overlay as a halo round the target. */
  .md1-time-picker__number:focus-visible {
    outline: 2px solid transparent;
    box-shadow: 0 0 0 8px var(--md1-focus, rgba(0, 0, 0, 0.12));
  }

  /*
   * The dark theme (pickers page, measured): a Grey 700 header band and face
   * on the Grey 800 sheet, and the selection ink in the accent's 200 swatch
   * (--md1-accent-control) with dark numbers on it.
   */
  [data-theme='md1-dark'] .md1-time-picker__header {
    background: var(--md1-grey-700, #616161);
  }

  [data-theme='md1-dark'] .md1-time-picker__dial {
    fill: var(--md1-grey-700, #616161);
  }

  [data-theme='md1-dark'] .md1-time-picker__line {
    stroke: var(--md1-accent-control, #F48FB1);
  }

  [data-theme='md1-dark'] .md1-time-picker__dot,
  [data-theme='md1-dark'] .md1-time-picker__target {
    fill: var(--md1-accent-control, #F48FB1);
  }

  [data-theme='md1-dark'] .md1-time-picker__pip {
    fill: color-mix(in srgb, var(--md1-black, #000000) 87%, transparent);
  }

  [data-theme='md1-dark'] .md1-time-picker__number[data-state='checked'] {
    color: color-mix(in srgb, var(--md1-black, #000000) 87%, transparent);
  }

  /* Reduced motion: the hand jumps. The plugin's body attribute wins over the OS query. */
  body[data-reduced-motion='reduce'] .md1-time-picker__hand {
    transition: none;
  }

  @media (prefers-reduced-motion: reduce) {
    body:not([data-reduced-motion='no-preference']) .md1-time-picker__hand {
      transition: none;
    }
  }
</style>
