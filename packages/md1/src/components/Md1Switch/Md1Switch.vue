<script lang="ts">
  // Framework
  import { isNullOrUndefined, isString, Switch, useId, useLogger } from '@vuetify/v0'

  // Utilities
  import { toRef, useAttrs, useSlots, watch } from 'vue'

  // Types
  import type { SwitchRootProps } from '@vuetify/v0'

  // Components
  import Md1Ripple from '../Md1Ripple/Md1Ripple.vue'

  /**
   * Material Design 1 withholds `id`, `form`, `indeterminate`, `groupNamespace`,
   * `ariaLabelledby`, `ariaDescribedby` and `ariaInvalid` from v0's switch
   * props: a switch is one setting, on or off, named by its inline label
   * (selection controls page).
   * As plain attributes, `aria-describedby` and (without a visible label)
   * `aria-labelledby` still reach the control rather than the root `<label>`.
   */
  export interface Md1SwitchProps extends Pick<
    SwitchRootProps,
    'value' | 'name' | 'namespace'
  > {
    /**
     * Inert: the disabled ink, no activation, no ripple. A plain boolean rather
     * than v0's `MaybeRefOrGetter<boolean>`, the type every Material Design 1
     * part takes.
     */
    disabled?: boolean
    /** The inline label naming the setting; the control's `aria-labelledby` points at it. The default slot replaces it. */
    label?: string
    /** Accessible name for a switch with no visible label, such as one in a list tile whose text names it. */
    ariaLabel?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'Md1Switch', inheritAttrs: false })

  defineSlots<{
    /** Rich label content; replaces `label`. */
    default?: () => any
  }>()

  const {
    label,
    value,
    name,
    disabled = false,
    ariaLabel,
    namespace,
  } = defineProps<Md1SwitchProps>()

  const model = defineModel<boolean>()

  const attrs = useAttrs()
  const slots = useSlots()
  const logger = useLogger()

  const id = useId()

  const text = toRef(() => !isNullOrUndefined(label) || !!slots.default)
  // The root is the <label>, so the naming attrs are held back from it and go to
  // the control they describe; a consumer's aria-labelledby only when there is
  // no visible label to name it.
  const labelledby = toRef(() => {
    if (text.value) return `${id}-label`

    const external = attrs['aria-labelledby']

    return isString(external) ? external : undefined
  })

  const describedby = toRef(() => {
    const external = attrs['aria-describedby']

    return isString(external) ? external : undefined
  })

  const rest = toRef(() => Object.fromEntries(Object.entries(attrs).filter(([key]) => key !== 'aria-labelledby' && key !== 'aria-describedby')))

  if (__DEV__) {
    watch(() => !text.value && isNullOrUndefined(ariaLabel) && isNullOrUndefined(labelledby.value), wrong => {
      if (wrong) logger.warn('[Md1Switch] the switch has no accessible name: pass label, slot content or ariaLabel')
    }, { immediate: true })
  }
</script>

<template>
  <label class="md1-switch" v-bind="rest">
    <Switch.Root
      v-model="model"
      :aria-describedby="describedby"
      :aria-labelledby="labelledby"
      class="md1-switch__control"
      :disabled
      :label="ariaLabel"
      :name
      :namespace
      :value
    >
      <Md1Ripple unbounded />

      <Switch.Track class="md1-switch__track" :namespace>
        <Switch.Thumb class="md1-switch__thumb" :namespace />
      </Switch.Track>
    </Switch.Root>

    <span v-if="text" :id="`${id}-label`" class="md1-switch__label">
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>

<!-- Unscoped: Switch.Root is multi-root; a scoped data-v never lands on the <button>. -->
<style>
  /*
   * The row: control, the 8 dp gap (a decision; the page gives none) and the
   * label, 48 dp tall so stacked switches keep their touch targets apart. The
   * whole label is a click target through the native <label>.
   */
  .md1-switch {
    display: inline-flex;
    align-items: center;
    gap: var(--md1-spacing-1, 8px);
    min-height: var(--md1-touch-target, 48px);
    vertical-align: middle;
    cursor: pointer;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
  }

  .md1-switch:has(> .md1-switch__control[data-disabled]) {
    cursor: default;
  }

  /* The 36 dp track's box, 24 dp tall like the checkbox and radio icon box. */
  .md1-switch__control {
    position: relative;
    display: inline-flex;
    flex-shrink: 0;
    align-items: center;
    box-sizing: border-box;
    width: 36px;
    height: 24px;
    margin: 0;
    padding: 0;
    border: 0;
    background: transparent;
    cursor: inherit;
    -webkit-tap-highlight-color: transparent;
  }

  /*
   * The 48 dp radial reaction, centred on the thumb and travelling with it: the
   * off thumb's centre sits 10 dp in from the start edge. It is also the hit
   * area. Drawn for keyboard focus; the press reaction is the ripple's.
   */
  .md1-switch__control::before {
    content: '';
    position: absolute;
    top: calc((24px - var(--md1-touch-target, 48px)) / 2);
    left: calc(10px - var(--md1-touch-target, 48px) / 2);
    width: var(--md1-touch-target, 48px);
    height: var(--md1-touch-target, 48px);
    border-radius: 50%;
    background: transparent;
    transition:
      background-color var(--md1-duration-standard, 300ms) var(--md1-easing-standard, cubic-bezier(0.4, 0, 0.2, 1)),
      transform var(--md1-duration-standard, 300ms) var(--md1-easing-standard, cubic-bezier(0.4, 0, 0.2, 1));
  }

  .md1-switch__control[data-state='checked']::before {
    transform: translateX(16px);
  }

  .md1-switch__control:focus-visible {
    outline: 2px solid transparent;
  }

  .md1-switch__control:focus-visible::before {
    background: var(--md1-hover, rgba(0, 0, 0, 0.06));
  }

  .md1-switch__control[data-state='checked']:focus-visible::before {
    background: color-mix(in srgb, var(--md1-accent-control, #FF4081) 10%, transparent);
  }

  /*
   * The ink layer covers the control and Md1Ripple centres the 48 dp ink on it;
   * shifting the layer 8 dp toward the thumb centres the ink on the thumb.
   */
  .md1-switch__control > .md1-ripple {
    color: var(--md1-hover, rgba(0, 0, 0, 0.06));
    transform: translateX(-8px);
    transition: transform var(--md1-duration-standard, 300ms) var(--md1-easing-standard, cubic-bezier(0.4, 0, 0.2, 1));
  }

  .md1-switch__control[data-state='checked'] > .md1-ripple {
    color: color-mix(in srgb, var(--md1-accent-control, #FF4081) 10%, transparent);
    transform: translateX(8px);
  }

  /* Desktop: no radial reaction with a mouse (selection controls page). Hidden, not removed, so the inks still settle. */
  @media (pointer: fine) {
    .md1-switch__control > .md1-ripple {
      opacity: 0;
    }
  }

  .md1-switch__control[data-disabled] {
    pointer-events: none;
  }

  /* A disabled switch stays focusable (v0 sets no tabindex): focus draws the grey halo whatever the state. */
  .md1-switch__control[data-disabled]:focus-visible::before {
    background: var(--md1-hover, rgba(0, 0, 0, 0.06));
  }

  /*
   * The 36 x 14 dp pill: 38% black off (30% white on dark), the accent at 50%
   * on. v0 hard-codes dir="ltr" on the track, so right-to-left mirrors it here.
   */
  .md1-switch__track {
    position: relative;
    display: block;
    width: 36px;
    height: 14px;
    border-radius: 7px;
    background: color-mix(in srgb, var(--md1-black, #000000) 38%, transparent);
    transition: background-color var(--md1-duration-standard, 300ms) var(--md1-easing-standard, cubic-bezier(0.4, 0, 0.2, 1));
  }

  .md1-switch__track[data-state='checked'] {
    background: color-mix(in srgb, var(--md1-accent-control, #FF4081) 50%, transparent);
  }

  /* The 20 dp thumb at 1 dp, overhanging the track by 3 dp and travelling 16 dp: Grey 50 off, the accent on. */
  .md1-switch__thumb {
    position: absolute;
    top: -3px;
    left: 0;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: var(--md1-grey-50, #FAFAFA);
    box-shadow: var(--md1-elevation-1, 0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12));
    transition:
      background-color var(--md1-duration-standard, 300ms) var(--md1-easing-standard, cubic-bezier(0.4, 0, 0.2, 1)),
      transform var(--md1-duration-standard, 300ms) var(--md1-easing-standard, cubic-bezier(0.4, 0, 0.2, 1));
  }

  .md1-switch__thumb[data-state='checked'] {
    background: var(--md1-accent-control, #FF4081);
    transform: translateX(16px);
  }

  /* Disabled: a Grey 400 thumb on a 12% black track, either position. */
  .md1-switch__control[data-disabled] .md1-switch__track {
    background: color-mix(in srgb, var(--md1-black, #000000) 12%, transparent);
  }

  .md1-switch__control[data-disabled] .md1-switch__thumb {
    background: var(--md1-grey-400, #BDBDBD);
  }

  /*
   * The dark theme's switch values are palette and alpha figures no role token
   * carries: a Grey 400 thumb on a 30% white track off, Grey 800 on 10% white
   * disabled. The accent on is --md1-accent-control, which is the 200 there.
   */
  [data-theme='md1-dark'] .md1-switch__track {
    background: color-mix(in srgb, var(--md1-white, #FFFFFF) 30%, transparent);
  }

  [data-theme='md1-dark'] .md1-switch__track[data-state='checked'] {
    background: color-mix(in srgb, var(--md1-accent-control, #F48FB1) 50%, transparent);
  }

  [data-theme='md1-dark'] .md1-switch__thumb {
    background: var(--md1-grey-400, #BDBDBD);
  }

  [data-theme='md1-dark'] .md1-switch__thumb[data-state='checked'] {
    background: var(--md1-accent-control, #F48FB1);
  }

  [data-theme='md1-dark'] .md1-switch__control[data-disabled] .md1-switch__track {
    background: color-mix(in srgb, var(--md1-white, #FFFFFF) 10%, transparent);
  }

  [data-theme='md1-dark'] .md1-switch__control[data-disabled] .md1-switch__thumb {
    background: var(--md1-grey-800, #424242);
  }

  /* Right to left: the off thumb rests at the start (right) edge and travels left. */
  .md1-switch:dir(rtl) .md1-switch__track {
    transform: scaleX(-1);
  }

  .md1-switch:dir(rtl) .md1-switch__control::before {
    left: calc(26px - var(--md1-touch-target, 48px) / 2);
  }

  .md1-switch:dir(rtl) .md1-switch__control[data-state='checked']::before {
    transform: translateX(-16px);
  }

  .md1-switch:dir(rtl) .md1-switch__control > .md1-ripple {
    transform: translateX(8px);
  }

  .md1-switch:dir(rtl) .md1-switch__control[data-state='checked'] > .md1-ripple {
    transform: translateX(-8px);
  }

  /* The label: Body 1 in the primary ink; disabled text when the control is. */
  .md1-switch__label {
    color: var(--md1-text-primary, rgba(0, 0, 0, 0.87));
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-body-1-size, 14px);
    font-weight: var(--md1-type-body-1-weight, 400);
    line-height: var(--md1-type-body-1-leading, 20px);
    letter-spacing: var(--md1-type-body-1-tracking, 0.01em);
  }

  .md1-switch__control[data-disabled] ~ .md1-switch__label {
    color: var(--md1-text-disabled, rgba(0, 0, 0, 0.38));
  }
</style>
