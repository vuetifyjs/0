<script lang="ts">
  // Framework
  import { Input, Slider, useLocale, useLogger, useRtl } from '@vuetify/v0'

  // Utilities
  import { shallowRef, toRef, watch } from 'vue'

  // Types
  import type { QuIconName } from '../../icons'
  import type { SliderRootProps } from '@vuetify/v0'

  // Components
  import QuIcon from '../QuIcon/QuIcon.vue'
  import QuRipple from '../QuRipple/QuRipple.vue'

  /**
   * Quantum withholds `readonly`, `orientation`, `inverted`,
   * `minStepsBetweenThumbs`, `crossover`, `form` and `ariaLabelledby` from
   * v0's slider props: MD1 sliders are single-thumb and horizontal (range and
   * vertical sliders are not in the spec, ruling 7), and the axis flips with
   * the writing direction rather than by prop. `name` stays so the slider can
   * submit with a form through v0's hidden input. `disabled` is redeclared as
   * a plain boolean: v0's `MaybeRefOrGetter<boolean>` compiles to a runtime
   * prop without `Boolean`, so a bare `disabled` attribute would arrive as an
   * empty string and leave the slider enabled.
   */
  export interface QuSliderProps extends Pick<
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
    iconStart?: QuIconName
    /** A 24 dp intensity glyph 16 dp after the track, such as a loud speaker. */
    iconEnd?: QuIconName
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
  defineOptions({ name: 'QuSlider' })

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
  } = defineProps<QuSliderProps>()

  const model = defineModel<number>({ default: 0 })

  const locale = useLocale()
  const logger = useLogger()
  const rtl = useRtl()

  // Smallest on the left: the axis mirrors under RTL, so v0 inverts its percent math.
  const inverted = toRef(() => rtl.isRtl.value)
  const dir = toRef(() => inverted.value ? 'rtl' : 'ltr')

  const dragging = shallowRef(false)
  const zero = toRef(() => model.value <= min)
  const named = toRef(() => ariaLabel || label || (locale.ti('Quantum.slider') ?? 'Slider'))

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
      if (wrong) logger.warn('[QuSlider] discrete slider values are predetermined and not user-editable (sliders page); `editable` with `discrete` is not a spec form')
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
    class="quantum-slider"
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
    <QuIcon v-if="iconStart" class="quantum-slider__icon" :name="iconStart" />

    <span class="quantum-slider__control">
      <Slider.Track class="quantum-slider__track" :namespace>
        <span aria-hidden="true" class="quantum-slider__rest" :style="rest(fromValue(model))" />

        <Slider.Range class="quantum-slider__range" :namespace />

        <span v-if="discrete" aria-hidden="true" class="quantum-slider__ticks">
          <span
            v-for="tick in ticks"
            :key="tick"
            class="quantum-slider__tick"
            :style="{ left: `${tick}%` }"
          />
        </span>
      </Slider.Track>

      <Slider.Thumb
        v-slot="{ value }"
        :aria-label="named"
        class="quantum-slider__thumb"
        :namespace
      >
        <QuRipple center />

        <span v-if="discrete" aria-hidden="true" class="quantum-slider__pin">{{ value }}</span>
      </Slider.Thumb>
    </span>

    <QuIcon v-if="iconEnd" class="quantum-slider__icon" :name="iconEnd" />

    <Input.Root
      v-if="editable"
      v-model:focused="typing"
      class="quantum-slider__field"
      :disabled
      :label="named"
      :model-value="shown"
      @update:model-value="onText($event, snap)"
    >
      <Input.Control class="quantum-slider__input" inputmode="decimal" />
    </Input.Root>
  </Slider.Root>
</template>

<!-- Unscoped: Slider.Root is multi-root when `name` is set; a scoped data-v would miss the group element. -->
<style>
  .quantum-slider {
    display: flex;
    align-items: center;
    gap: var(--quantum-spacing-2, 16px);
    min-width: 0;
    font-family: var(--quantum-font-family, Roboto, Noto, sans-serif);
  }

  /* Intensity icons: 24 dp, 16 dp from the track (the gap above), active icon ink. */
  .quantum-slider__icon {
    color: var(--quantum-icon-active, rgba(0, 0, 0, 0.54));
  }

  .quantum-slider[data-disabled] .quantum-slider__icon {
    color: var(--quantum-button-disabled-text, rgba(0, 0, 0, 0.26));
  }

  /* The track fills the space between its neighbours; the 48 dp band is its touch target. */
  .quantum-slider__control {
    position: relative;
    flex: 1 1 auto;
    min-width: 0;
    height: var(--quantum-touch-target, 48px);
  }

  .quantum-slider__track {
    position: absolute;
    inset: 0;
    cursor: pointer;
  }

  .quantum-slider[data-disabled] .quantum-slider__track {
    cursor: default;
  }

  /* The 2 dp line: the active portion is v0's Range, the inactive portion runs from the thumb to the end. */
  .quantum-slider__range,
  .quantum-slider__rest {
    position: absolute;
    top: 50%;
    height: 2px;
    margin-top: -1px;
    transition:
      background-color var(--quantum-duration-standard, 300ms) var(--quantum-easing-standard, cubic-bezier(0.4, 0, 0.2, 1)),
      margin var(--quantum-duration-standard, 300ms) var(--quantum-easing-standard, cubic-bezier(0.4, 0, 0.2, 1));
  }

  .quantum-slider__range {
    background: var(--quantum-accent-control, #FF4081);
  }

  /* Inactive: 26% black (30% white), rising to 38% while focused or pressed. */
  .quantum-slider__rest {
    background: var(--quantum-button-disabled-text, rgba(0, 0, 0, 0.26));
  }

  .quantum-slider[data-dragging] .quantum-slider__rest,
  .quantum-slider:not([data-disabled]):has(.quantum-slider__thumb:focus-visible) .quantum-slider__rest {
    background: var(--quantum-text-disabled, rgba(0, 0, 0, 0.38));
  }

  /* At 0% the thumb is a hollow ring; the line stops at its edge rather than showing through it. */
  .quantum-slider[data-zero] .quantum-slider__rest {
    margin-inline-start: 6px;
  }

  .quantum-slider[data-zero][data-dragging] .quantum-slider__rest {
    margin-inline-start: 9px;
  }

  /* Tick marks: 2 x 2 dp at every discrete value, full black (white) ink, shown while pressed. */
  .quantum-slider__ticks {
    position: absolute;
    inset: 0;
    opacity: 0;
    pointer-events: none;
    transition: opacity var(--quantum-duration-standard, 300ms) var(--quantum-easing-standard, cubic-bezier(0.4, 0, 0.2, 1));
  }

  .quantum-slider[data-dragging] .quantum-slider__ticks {
    opacity: 1;
  }

  .quantum-slider__tick {
    position: absolute;
    top: 50%;
    width: 2px;
    height: 2px;
    margin: -1px 0 0 -1px;
    background: rgb(var(--quantum-text-primary-channels, 0 0 0));
  }

  /*
   * The thumb is the 32 dp halo footprint centred on the value; the visible
   * 12 dp dot is its ::after, painted above the ripple ink.
   */
  .quantum-slider__thumb {
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
    transition: background-color var(--quantum-duration-standard, 300ms) var(--quantum-easing-standard, cubic-bezier(0.4, 0, 0.2, 1));
  }

  .quantum-slider[data-dragging] .quantum-slider__thumb {
    cursor: grabbing;
  }

  .quantum-slider__thumb::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    box-sizing: border-box;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: var(--quantum-accent-control, #FF4081);
    transform: translate(-50%, -50%);
    transition:
      width var(--quantum-duration-standard, 300ms) var(--quantum-easing-standard, cubic-bezier(0.4, 0, 0.2, 1)),
      height var(--quantum-duration-standard, 300ms) var(--quantum-easing-standard, cubic-bezier(0.4, 0, 0.2, 1)),
      transform var(--quantum-duration-standard, 300ms) var(--quantum-easing-standard, cubic-bezier(0.4, 0, 0.2, 1));
  }

  /* Pressed: the dot grows to 18 dp. */
  .quantum-slider[data-dragging] .quantum-slider__thumb::after {
    width: 18px;
    height: 18px;
  }

  /* Zero: a hollow 2 dp ring in the inactive ink, 38% while focused or pressed. */
  .quantum-slider[data-zero] .quantum-slider__thumb::after {
    border: 2px solid var(--quantum-button-disabled-text, rgba(0, 0, 0, 0.26));
    background: transparent;
  }

  .quantum-slider[data-zero][data-dragging] .quantum-slider__thumb::after,
  .quantum-slider[data-zero] .quantum-slider__thumb:focus-visible::after {
    border-color: var(--quantum-text-disabled, rgba(0, 0, 0, 0.38));
  }

  /*
   * The discrete slider draws no ring at its minimum: the sheets show a filled
   * 12 dp dot in the primary text ink (87% black, white on dark), sitting on
   * the start of the line.
   */
  .quantum-slider[data-discrete][data-zero]:not([data-disabled]) .quantum-slider__thumb::after {
    border: 0;
    background: var(--quantum-text-primary, rgba(0, 0, 0, 0.87));
  }

  .quantum-slider[data-discrete][data-zero]:not([data-disabled]) .quantum-slider__rest {
    margin-inline-start: 0;
  }

  /*
   * Focus: the 32 dp halo, 16% of the accent, or the 12% focus overlay at zero.
   * The outline is transparent so a host's focus ring does not paint beside
   * the halo, and solid so forced colours mode, which drops backgrounds, still draws one.
   */
  .quantum-slider__thumb:focus-visible {
    outline: 2px solid transparent;
    background: color-mix(in srgb, var(--quantum-accent-control, #FF4081) 16%, transparent);
  }

  .quantum-slider[data-zero] .quantum-slider__thumb:focus-visible {
    background: var(--quantum-focus, rgba(0, 0, 0, 0.12));
  }

  /*
   * The value pin: a 26 dp circle drawn to a point 8 dp above the track's
   * centreline, 26 x 32 dp in all. A square with three round corners turned
   * 45 degrees; the label sits unrotated on top.
   */
  .quantum-slider__pin {
    position: absolute;
    bottom: calc(50% + 13.4px);
    left: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 26px;
    height: 26px;
    margin-left: -13px;
    color: var(--quantum-on-accent, #FFFFFF);
    font-size: 10px;
    font-weight: var(--quantum-font-weight-regular, 400);
    line-height: 1;
    white-space: nowrap;
    pointer-events: none;
    transform: scale(0);
    transform-origin: 50% calc(100% + 5.4px);
    transition: transform var(--quantum-duration-standard, 300ms) var(--quantum-easing-standard, cubic-bezier(0.4, 0, 0.2, 1));
  }

  .quantum-slider__pin::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: -1;
    border-radius: 50% 50% 50% 0;
    background: var(--quantum-accent-control, #FF4081);
    transform: rotate(-45deg);
  }

  .quantum-slider[data-zero] .quantum-slider__pin::before {
    background: var(--quantum-button-disabled-text, rgba(0, 0, 0, 0.26));
  }

  /* Discrete: the pin replaces the thumb while focused or pressed; no halo. */
  .quantum-slider[data-discrete][data-dragging] .quantum-slider__pin,
  .quantum-slider[data-discrete]:not([data-disabled]) .quantum-slider__thumb:focus-visible .quantum-slider__pin {
    transform: scale(1);
  }

  .quantum-slider[data-discrete][data-dragging] .quantum-slider__thumb::after,
  .quantum-slider[data-discrete]:not([data-disabled]) .quantum-slider__thumb:focus-visible::after {
    transform: translate(-50%, -50%) scale(0);
  }

  .quantum-slider[data-discrete] .quantum-slider__thumb:focus-visible {
    background: transparent;
  }

  /*
   * Disabled: everything in the disabled ink, an 8 dp dot disconnected from
   * the track by 2 dp gaps (the line stops where the 12 dp thumb would end).
   */
  .quantum-slider[data-disabled] .quantum-slider__thumb {
    cursor: default;
  }

  /* A disabled thumb can still take focus from script; it draws no halo and no pin (sheets: "same, no pin"). */
  .quantum-slider[data-disabled] .quantum-slider__thumb:focus-visible {
    background: transparent;
  }

  .quantum-slider[data-disabled] .quantum-slider__thumb::after {
    width: 8px;
    height: 8px;
    border: 0;
    background: var(--quantum-button-disabled-text, rgba(0, 0, 0, 0.26));
  }

  .quantum-slider[data-disabled] .quantum-slider__range,
  .quantum-slider[data-disabled] .quantum-slider__rest {
    background: var(--quantum-button-disabled-text, rgba(0, 0, 0, 0.26));
  }

  .quantum-slider[data-disabled] .quantum-slider__rest {
    margin-inline-start: 6px;
  }

  .quantum-slider[data-disabled][dir='ltr'] .quantum-slider__range {
    clip-path: inset(0 6px 0 0);
  }

  .quantum-slider[data-disabled][dir='rtl'] .quantum-slider__range {
    clip-path: inset(0 0 0 6px);
  }

  /* The editable value: a 24 dp underlined field, right-aligned, accent line while focused or pressed. */
  .quantum-slider__field {
    flex: 0 0 auto;
    border-bottom: 1px solid rgb(from var(--quantum-hover, rgba(0, 0, 0, 0.06)) r g b / calc(alpha * 7));
    transition:
      border-color var(--quantum-duration-standard, 300ms) var(--quantum-easing-standard, cubic-bezier(0.4, 0, 0.2, 1)),
      box-shadow var(--quantum-duration-standard, 300ms) var(--quantum-easing-standard, cubic-bezier(0.4, 0, 0.2, 1));
  }

  .quantum-slider__field[data-focused],
  .quantum-slider[data-dragging] .quantum-slider__field {
    border-bottom-color: var(--quantum-accent, #FF4081);
    box-shadow: 0 1px 0 var(--quantum-accent, #FF4081);
  }

  .quantum-slider__input {
    box-sizing: border-box;
    width: max(24px, 3ch);
    margin: 0;
    padding: 4px 0;
    border: 0;
    outline: none;
    background: transparent;
    color: var(--quantum-text-primary, rgba(0, 0, 0, 0.87));
    font: inherit;
    font-size: var(--quantum-type-body-1-size, 14px);
    line-height: var(--quantum-type-body-1-leading, 20px);
    font-variant-numeric: tabular-nums;
    text-align: end;
    caret-color: var(--quantum-accent, #FF4081);
  }

  .quantum-slider[data-disabled] .quantum-slider__field {
    border-bottom-style: dotted;
  }

  .quantum-slider[data-disabled] .quantum-slider__input {
    color: var(--quantum-button-disabled-text, rgba(0, 0, 0, 0.26));
  }
</style>
