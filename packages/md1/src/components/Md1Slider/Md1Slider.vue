<script lang="ts">
  // Framework
  import { Input, Slider, useLocale, useLogger, useRtl } from '@vuetify/v0'

  // Utilities
  import { shallowRef, toRef, watch } from 'vue'

  // Types
  import type { Md1IconName } from '../../icons'
  import type { SliderRootProps } from '@vuetify/v0'

  // Components
  import Md1Icon from '../Md1Icon/Md1Icon.vue'
  import Md1Ripple from '../Md1Ripple/Md1Ripple.vue'

  /**
   * MD1 withholds `readonly`, `orientation`, `inverted`,
   * `minStepsBetweenThumbs`, `crossover`, `form` and `ariaLabelledby` from
   * v0's slider props: MD1 sliders are single-thumb and horizontal (range and
   * vertical sliders are not in the spec, ruling 7), and the axis flips with
   * the writing direction rather than by prop. `name` stays so the slider can
   * submit with a form through v0's hidden input. `disabled` is redeclared as
   * a plain boolean: v0's `MaybeRefOrGetter<boolean>` compiles to a runtime
   * prop without `Boolean`, so a bare `disabled` attribute would arrive as an
   * empty string and leave the slider enabled.
   */
  export interface Md1SliderProps extends Pick<
    SliderRootProps,
    'min' | 'max' | 'step' | 'label' | 'name' | 'namespace'
  > {
    /** Out of the tab order and inert to keys and presses; an 8 dp thumb disconnected from the track. */
    disabled?: boolean
    /**
     * The discrete slider: the thumb snaps to `step`, a 26 x 32 dp value pin
     * replaces the thumb on focus and while dragging, and 2 dp tick marks
     * appear along the track while it is pressed.
     */
    discrete?: boolean
    /** A 24 dp intensity glyph 16 dp before the track, such as a quiet speaker. */
    iconStart?: Md1IconName
    /** A 24 dp intensity glyph 16 dp after the track, such as a loud speaker. */
    iconEnd?: Md1IconName
    /**
     * The continuous slider with an editable numeric value: a 24 dp numeric
     * field 16 dp after the track that follows the thumb live and sets the
     * exact value when typed into. Not a discrete form; pairing them warns in dev.
     */
    editable?: boolean
    /** Accessible name for the thumb and the numeric field. Falls back to `label`. */
    ariaLabel?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'Md1Slider' })

  const {
    min = 0,
    max = 100,
    step = 1,
    disabled = false,
    discrete = false,
    editable = false,
    iconStart,
    iconEnd,
    label,
    ariaLabel,
    name,
    namespace,
  } = defineProps<Md1SliderProps>()

  const model = defineModel<number>({ default: 0 })

  const locale = useLocale()
  const logger = useLogger()
  const rtl = useRtl()

  // Smallest on the left: the axis mirrors under RTL, so v0 inverts its percent math.
  const inverted = toRef(() => rtl.isRtl.value)
  const dir = toRef(() => inverted.value ? 'rtl' : 'ltr')

  const dragging = shallowRef(false)
  const zero = toRef(() => model.value <= min)
  const named = toRef(() => ariaLabel || label || (locale.ti('Md1.slider') ?? 'Slider'))

  // One tick per reachable value (min + n * step, which is what v0 snaps to), as
  // percents along the track. When step does not divide the range, the last tick
  // stops short of max, as the thumb does.
  const ticks = toRef(() => {
    const extent = max - min

    if (!discrete || step <= 0 || extent <= 0) return []

    const count = Math.floor(extent / step + 1e-9)

    return Array.from({ length: count + 1 }, (_, index) => (index * step / extent) * 100)
  })

  // The numeric field shows the model unless someone is typing into it.
  const typing = shallowRef(false)
  const draft = shallowRef('')
  const shown = toRef(() => typing.value ? draft.value : String(model.value))

  watch(typing, value => {
    if (value) draft.value = String(model.value)
  })

  if (__DEV__) {
    watch(() => discrete && editable, wrong => {
      if (wrong) logger.warn('[Md1Slider] discrete slider values are predetermined and not user-editable (sliders page); `editable` with `discrete` is not a spec form')
    }, { immediate: true })
  }

  function onStart () {
    dragging.value = true
  }

  function onEnd () {
    dragging.value = false
  }

  function onText (value: string, snap: (value: number) => number) {
    draft.value = value

    const number = Number(value)

    if (value.trim() === '' || !Number.isFinite(number)) return

    model.value = snap(number)
  }

  /** The inactive track runs from the thumb to the max end, whichever side that is. */
  function rest (percent: number) {
    return inverted.value
      ? { left: '0', right: `${100 - percent}%` }
      : { left: `${percent}%`, right: '0' }
  }
</script>

<template>
  <Slider.Root
    v-slot="{ fromValue, snap }"
    v-model="model"
    class="md1-slider"
    :data-discrete="discrete || undefined"
    :data-dragging="dragging || undefined"
    :data-editable="editable || undefined"
    :data-zero="zero || undefined"
    :dir
    :disabled
    :inverted
    :label
    :max
    :min
    :name
    :namespace
    :step
    @end="onEnd"
    @start="onStart"
  >
    <Md1Icon v-if="iconStart" class="md1-slider__icon" :name="iconStart" />

    <span class="md1-slider__control">
      <Slider.Track class="md1-slider__track" :namespace>
        <span aria-hidden="true" class="md1-slider__rest" :style="rest(fromValue(model))" />

        <Slider.Range class="md1-slider__range" :namespace />

        <span v-if="discrete" aria-hidden="true" class="md1-slider__ticks">
          <span
            v-for="tick in ticks"
            :key="tick"
            class="md1-slider__tick"
            :style="{ left: `${tick}%` }"
          />
        </span>
      </Slider.Track>

      <Slider.Thumb
        v-slot="{ value }"
        :aria-label="named"
        class="md1-slider__thumb"
        :namespace
      >
        <Md1Ripple center />

        <span v-if="discrete" aria-hidden="true" class="md1-slider__pin">{{ value }}</span>
      </Slider.Thumb>
    </span>

    <Md1Icon v-if="iconEnd" class="md1-slider__icon" :name="iconEnd" />

    <Input.Root
      v-if="editable"
      v-model:focused="typing"
      class="md1-slider__field"
      :disabled
      :label="named"
      :model-value="shown"
      @update:model-value="onText($event, snap)"
    >
      <Input.Control class="md1-slider__input" inputmode="decimal" />
    </Input.Root>
  </Slider.Root>
</template>

<!-- Unscoped: Slider.Root is multi-root when `name` is set; a scoped data-v would miss the group element. -->
<style>
  .md1-slider {
    display: flex;
    align-items: center;
    gap: var(--md1-spacing-2, 16px);
    min-width: 0;
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
  }

  /* Intensity icons: 24 dp, 16 dp from the track (the gap above), active icon ink. */
  .md1-slider__icon {
    color: var(--md1-icon-active, rgba(0, 0, 0, 0.54));
  }

  .md1-slider[data-disabled] .md1-slider__icon {
    color: var(--md1-button-disabled-text, rgba(0, 0, 0, 0.26));
  }

  /* The track fills the space between its neighbours; the 48 dp band is its touch target. */
  .md1-slider__control {
    position: relative;
    flex: 1 1 auto;
    min-width: 0;
    height: var(--md1-touch-target, 48px);
  }

  .md1-slider__track {
    position: absolute;
    inset: 0;
    cursor: pointer;
  }

  .md1-slider[data-disabled] .md1-slider__track {
    cursor: default;
  }

  /* The 2 dp line: the active portion is v0's Range, the inactive portion runs from the thumb to the end. */
  .md1-slider__range,
  .md1-slider__rest {
    position: absolute;
    top: 50%;
    height: 2px;
    margin-top: -1px;
    transition:
      background-color var(--md1-duration-standard, 300ms) var(--md1-easing-standard, cubic-bezier(0.4, 0, 0.2, 1)),
      margin var(--md1-duration-standard, 300ms) var(--md1-easing-standard, cubic-bezier(0.4, 0, 0.2, 1));
  }

  .md1-slider__range {
    background: var(--md1-accent-control, #FF4081);
  }

  /* Inactive: 26% black (30% white), rising to 38% while focused or pressed. */
  .md1-slider__rest {
    background: var(--md1-button-disabled-text, rgba(0, 0, 0, 0.26));
  }

  .md1-slider[data-dragging] .md1-slider__rest,
  .md1-slider:not([data-disabled]):has(.md1-slider__thumb:focus-visible) .md1-slider__rest {
    background: var(--md1-text-disabled, rgba(0, 0, 0, 0.38));
  }

  /* At 0% the thumb is a hollow ring; the line stops at its edge rather than showing through it. */
  .md1-slider[data-zero] .md1-slider__rest {
    margin-inline-start: 6px;
  }

  .md1-slider[data-zero][data-dragging] .md1-slider__rest {
    margin-inline-start: 9px;
  }

  /* Tick marks: 2 x 2 dp at every discrete value, full black (white) ink, shown while pressed. */
  .md1-slider__ticks {
    position: absolute;
    inset: 0;
    opacity: 0;
    pointer-events: none;
    transition: opacity var(--md1-duration-standard, 300ms) var(--md1-easing-standard, cubic-bezier(0.4, 0, 0.2, 1));
  }

  .md1-slider[data-dragging] .md1-slider__ticks {
    opacity: 1;
  }

  .md1-slider__tick {
    position: absolute;
    top: 50%;
    width: 2px;
    height: 2px;
    margin: -1px 0 0 -1px;
    background: rgb(var(--md1-text-primary-channels, 0 0 0));
  }

  /*
   * The thumb is the 32 dp halo footprint centred on the value; the visible
   * 12 dp dot is its ::after, painted above the ripple ink.
   */
  .md1-slider__thumb {
    position: absolute;
    top: 50%;
    z-index: 1;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    outline: none;
    transform: translate(-50%, -50%);
    cursor: grab;
    -webkit-tap-highlight-color: transparent;
    transition: background-color var(--md1-duration-standard, 300ms) var(--md1-easing-standard, cubic-bezier(0.4, 0, 0.2, 1));
  }

  .md1-slider[data-dragging] .md1-slider__thumb {
    cursor: grabbing;
  }

  .md1-slider__thumb::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    box-sizing: border-box;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: var(--md1-accent-control, #FF4081);
    transform: translate(-50%, -50%);
    transition:
      width var(--md1-duration-standard, 300ms) var(--md1-easing-standard, cubic-bezier(0.4, 0, 0.2, 1)),
      height var(--md1-duration-standard, 300ms) var(--md1-easing-standard, cubic-bezier(0.4, 0, 0.2, 1)),
      transform var(--md1-duration-standard, 300ms) var(--md1-easing-standard, cubic-bezier(0.4, 0, 0.2, 1));
  }

  /* Pressed: the dot grows to 18 dp. */
  .md1-slider[data-dragging] .md1-slider__thumb::after {
    width: 18px;
    height: 18px;
  }

  /* Zero: a hollow 2 dp ring in the inactive ink, 38% while focused or pressed. */
  .md1-slider[data-zero] .md1-slider__thumb::after {
    border: 2px solid var(--md1-button-disabled-text, rgba(0, 0, 0, 0.26));
    background: transparent;
  }

  .md1-slider[data-zero][data-dragging] .md1-slider__thumb::after,
  .md1-slider[data-zero] .md1-slider__thumb:focus-visible::after {
    border-color: var(--md1-text-disabled, rgba(0, 0, 0, 0.38));
  }

  /*
   * The discrete slider draws no ring at its minimum: the sheets show a filled
   * 12 dp dot in the primary text ink (87% black, white on dark), sitting on
   * the start of the line.
   */
  .md1-slider[data-discrete][data-zero]:not([data-disabled]) .md1-slider__thumb::after {
    border: 0;
    background: var(--md1-text-primary, rgba(0, 0, 0, 0.87));
  }

  .md1-slider[data-discrete][data-zero]:not([data-disabled]) .md1-slider__rest {
    margin-inline-start: 0;
  }

  /*
   * Focus: the 32 dp halo, 16% of the accent, or the 12% focus overlay at zero.
   * The outline is transparent so a host's focus ring does not paint beside
   * the halo, and solid so forced colours mode, which drops backgrounds, still draws one.
   */
  .md1-slider__thumb:focus-visible {
    outline: 2px solid transparent;
    background: color-mix(in srgb, var(--md1-accent-control, #FF4081) 16%, transparent);
  }

  .md1-slider[data-zero] .md1-slider__thumb:focus-visible {
    background: var(--md1-focus, rgba(0, 0, 0, 0.12));
  }

  /*
   * The value pin: a 26 dp circle drawn to a point 8 dp above the track's
   * centreline, 26 x 32 dp in all. A square with three round corners turned
   * 45 degrees; the label sits unrotated on top.
   */
  .md1-slider__pin {
    position: absolute;
    bottom: calc(50% + 13.4px);
    left: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 26px;
    height: 26px;
    margin-left: -13px;
    color: var(--md1-on-accent, #FFFFFF);
    font-size: 10px;
    font-weight: var(--md1-font-weight-regular, 400);
    line-height: 1;
    white-space: nowrap;
    pointer-events: none;
    transform: scale(0);
    transform-origin: 50% calc(100% + 5.4px);
    transition: transform var(--md1-duration-standard, 300ms) var(--md1-easing-standard, cubic-bezier(0.4, 0, 0.2, 1));
  }

  .md1-slider__pin::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: -1;
    border-radius: 50% 50% 50% 0;
    background: var(--md1-accent-control, #FF4081);
    transform: rotate(-45deg);
  }

  .md1-slider[data-zero] .md1-slider__pin::before {
    background: var(--md1-button-disabled-text, rgba(0, 0, 0, 0.26));
  }

  /* Discrete: the pin replaces the thumb while focused or pressed; no halo. */
  .md1-slider[data-discrete][data-dragging] .md1-slider__pin,
  .md1-slider[data-discrete]:not([data-disabled]) .md1-slider__thumb:focus-visible .md1-slider__pin {
    transform: scale(1);
  }

  .md1-slider[data-discrete][data-dragging] .md1-slider__thumb::after,
  .md1-slider[data-discrete]:not([data-disabled]) .md1-slider__thumb:focus-visible::after {
    transform: translate(-50%, -50%) scale(0);
  }

  .md1-slider[data-discrete] .md1-slider__thumb:focus-visible {
    background: transparent;
  }

  /*
   * Disabled: everything in the disabled ink, an 8 dp dot disconnected from
   * the track by 2 dp gaps (the line stops where the 12 dp thumb would end).
   */
  .md1-slider[data-disabled] .md1-slider__thumb {
    cursor: default;
  }

  /* A disabled thumb can still take focus from script; it draws no halo and no pin (sheets: "same, no pin"). */
  .md1-slider[data-disabled] .md1-slider__thumb:focus-visible {
    background: transparent;
  }

  .md1-slider[data-disabled] .md1-slider__thumb::after {
    width: 8px;
    height: 8px;
    border: 0;
    background: var(--md1-button-disabled-text, rgba(0, 0, 0, 0.26));
  }

  .md1-slider[data-disabled] .md1-slider__range,
  .md1-slider[data-disabled] .md1-slider__rest {
    background: var(--md1-button-disabled-text, rgba(0, 0, 0, 0.26));
  }

  .md1-slider[data-disabled] .md1-slider__rest {
    margin-inline-start: 6px;
  }

  .md1-slider[data-disabled][dir='ltr'] .md1-slider__range {
    clip-path: inset(0 6px 0 0);
  }

  .md1-slider[data-disabled][dir='rtl'] .md1-slider__range {
    clip-path: inset(0 0 0 6px);
  }

  /* The editable value: a 24 dp underlined field, right-aligned, accent line while focused or pressed. */
  .md1-slider__field {
    flex: 0 0 auto;
    border-bottom: 1px solid rgb(from var(--md1-hover, rgba(0, 0, 0, 0.06)) r g b / calc(alpha * 7));
    transition:
      border-color var(--md1-duration-standard, 300ms) var(--md1-easing-standard, cubic-bezier(0.4, 0, 0.2, 1)),
      box-shadow var(--md1-duration-standard, 300ms) var(--md1-easing-standard, cubic-bezier(0.4, 0, 0.2, 1));
  }

  .md1-slider__field[data-focused],
  .md1-slider[data-dragging] .md1-slider__field {
    border-bottom-color: var(--md1-accent, #FF4081);
    box-shadow: 0 1px 0 var(--md1-accent, #FF4081);
  }

  .md1-slider__input {
    box-sizing: border-box;
    width: max(24px, 3ch);
    margin: 0;
    padding: 4px 0;
    border: 0;
    outline: none;
    background: transparent;
    color: var(--md1-text-primary, rgba(0, 0, 0, 0.87));
    font: inherit;
    font-size: var(--md1-type-body-1-size, 14px);
    line-height: var(--md1-type-body-1-leading, 20px);
    font-variant-numeric: tabular-nums;
    text-align: end;
    caret-color: var(--md1-accent, #FF4081);
  }

  .md1-slider[data-disabled] .md1-slider__field {
    border-bottom-style: dotted;
  }

  .md1-slider[data-disabled] .md1-slider__input {
    color: var(--md1-button-disabled-text, rgba(0, 0, 0, 0.26));
  }
</style>
