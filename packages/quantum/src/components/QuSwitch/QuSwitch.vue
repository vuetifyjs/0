<script lang="ts">
  // Framework
  import { isNullOrUndefined, isString, Switch, useId, useLogger } from '@vuetify/v0'

  // Utilities
  import { toRef, useAttrs, useSlots, watch } from 'vue'

  // Types
  import type { SwitchRootProps } from '@vuetify/v0'

  // Components
  import QuRipple from '../QuRipple/QuRipple.vue'

  /**
   * Quantum withholds `id`, `form`, `indeterminate`, `groupNamespace`,
   * `ariaLabelledby`, `ariaDescribedby` and `ariaInvalid` from v0's switch
   * props: a switch is one setting, on or off, named by its inline label
   * (selection controls page).
   */
  export interface QuSwitchProps extends Pick<
    SwitchRootProps,
    'value' | 'name' | 'namespace'
  > {
    /**
     * Inert: the disabled ink, no activation, no ripple. A plain boolean rather
     * than v0's `MaybeRefOrGetter`, so the SFC compiler emits a Boolean prop and
     * a bare `disabled` attribute casts to `true` in every consumer build.
     */
    disabled?: boolean
    /** The inline label naming the setting; the control's `aria-labelledby` points at it. The default slot replaces it. */
    label?: string
    /** Accessible name for a switch with no visible label, such as one in a list tile whose text names it. */
    ariaLabel?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'QuSwitch' })

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
  } = defineProps<QuSwitchProps>()

  const model = defineModel<boolean>()

  const attrs = useAttrs()
  const slots = useSlots()
  const logger = useLogger()

  const id = useId()

  const text = toRef(() => !isNullOrUndefined(label) || !!slots.default)
  // The root is the <label>, so a consumer's aria-labelledby falls through to it
  // rather than to the control it names; forward it when there is no visible label.
  const labelledby = toRef(() => {
    if (text.value) return `${id}-label`

    const external = attrs['aria-labelledby']

    return isString(external) ? external : undefined
  })

  if (__DEV__) {
    watch(() => !text.value && isNullOrUndefined(ariaLabel) && isNullOrUndefined(labelledby.value), wrong => {
      if (wrong) logger.warn('[QuSwitch] the switch has no accessible name: pass label, slot content or ariaLabel')
    }, { immediate: true })
  }
</script>

<template>
  <label class="quantum-switch">
    <Switch.Root
      v-model="model"
      :aria-labelledby="labelledby"
      class="quantum-switch__control"
      :disabled
      :label="ariaLabel"
      :name
      :namespace
      :value
    >
      <QuRipple unbounded />

      <Switch.Track class="quantum-switch__track" :namespace>
        <Switch.Thumb class="quantum-switch__thumb" :namespace />
      </Switch.Track>
    </Switch.Root>

    <span v-if="text" :id="`${id}-label`" class="quantum-switch__label">
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
  .quantum-switch {
    display: inline-flex;
    align-items: center;
    gap: var(--quantum-spacing-1, 8px);
    min-height: var(--quantum-touch-target, 48px);
    vertical-align: middle;
    cursor: pointer;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
  }

  .quantum-switch:has(> .quantum-switch__control[data-disabled]) {
    cursor: default;
  }

  /* The 36 dp track's box, 24 dp tall like the checkbox and radio icon box. */
  .quantum-switch__control {
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
  .quantum-switch__control::before {
    content: '';
    position: absolute;
    top: calc((24px - var(--quantum-touch-target, 48px)) / 2);
    left: calc(10px - var(--quantum-touch-target, 48px) / 2);
    width: var(--quantum-touch-target, 48px);
    height: var(--quantum-touch-target, 48px);
    border-radius: 50%;
    background: transparent;
    transition:
      background-color var(--quantum-duration-standard, 300ms) var(--quantum-easing-standard, cubic-bezier(0.4, 0, 0.2, 1)),
      transform var(--quantum-duration-standard, 300ms) var(--quantum-easing-standard, cubic-bezier(0.4, 0, 0.2, 1));
  }

  .quantum-switch__control[data-state='checked']::before {
    transform: translateX(16px);
  }

  .quantum-switch__control:focus-visible {
    outline: 2px solid transparent;
  }

  .quantum-switch__control:focus-visible::before {
    background: var(--quantum-hover, rgba(0, 0, 0, 0.06));
  }

  .quantum-switch__control[data-state='checked']:focus-visible::before {
    background: color-mix(in srgb, var(--quantum-accent-control, #FF4081) 10%, transparent);
  }

  /*
   * The ink layer covers the control and QuRipple centres the 48 dp ink on it;
   * shifting the layer 8 dp toward the thumb centres the ink on the thumb.
   */
  .quantum-switch__control > .quantum-ripple {
    color: var(--quantum-hover, rgba(0, 0, 0, 0.06));
    transform: translateX(-8px);
    transition: transform var(--quantum-duration-standard, 300ms) var(--quantum-easing-standard, cubic-bezier(0.4, 0, 0.2, 1));
  }

  .quantum-switch__control[data-state='checked'] > .quantum-ripple {
    color: color-mix(in srgb, var(--quantum-accent-control, #FF4081) 10%, transparent);
    transform: translateX(8px);
  }

  /* Desktop: no radial reaction with a mouse (selection controls page). Hidden, not removed, so the inks still settle. */
  @media (pointer: fine) {
    .quantum-switch__control > .quantum-ripple {
      opacity: 0;
    }
  }

  .quantum-switch__control[data-disabled] {
    pointer-events: none;
  }

  /* A disabled switch stays focusable (v0 sets no tabindex): focus draws the grey halo whatever the state. */
  .quantum-switch__control[data-disabled]:focus-visible::before {
    background: var(--quantum-hover, rgba(0, 0, 0, 0.06));
  }

  /*
   * The 36 x 14 dp pill: 38% black off (30% white on dark), the accent at 50%
   * on. v0 hard-codes dir="ltr" on the track, so right-to-left mirrors it here.
   */
  .quantum-switch__track {
    position: relative;
    display: block;
    width: 36px;
    height: 14px;
    border-radius: 7px;
    background: color-mix(in srgb, var(--quantum-black, #000000) 38%, transparent);
    transition: background-color var(--quantum-duration-standard, 300ms) var(--quantum-easing-standard, cubic-bezier(0.4, 0, 0.2, 1));
  }

  .quantum-switch__track[data-state='checked'] {
    background: color-mix(in srgb, var(--quantum-accent-control, #FF4081) 50%, transparent);
  }

  /* The 20 dp thumb at 1 dp, overhanging the track by 3 dp and travelling 16 dp: Grey 50 off, the accent on. */
  .quantum-switch__thumb {
    position: absolute;
    top: -3px;
    left: 0;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: var(--quantum-grey-50, #FAFAFA);
    box-shadow: var(--quantum-elevation-1, 0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12));
    transition:
      background-color var(--quantum-duration-standard, 300ms) var(--quantum-easing-standard, cubic-bezier(0.4, 0, 0.2, 1)),
      transform var(--quantum-duration-standard, 300ms) var(--quantum-easing-standard, cubic-bezier(0.4, 0, 0.2, 1));
  }

  .quantum-switch__thumb[data-state='checked'] {
    background: var(--quantum-accent-control, #FF4081);
    transform: translateX(16px);
  }

  /* Disabled: a Grey 400 thumb on a 12% black track, either position. */
  .quantum-switch__control[data-disabled] .quantum-switch__track {
    background: color-mix(in srgb, var(--quantum-black, #000000) 12%, transparent);
  }

  .quantum-switch__control[data-disabled] .quantum-switch__thumb {
    background: var(--quantum-grey-400, #BDBDBD);
  }

  /*
   * The dark theme's switch values are palette and alpha figures no role token
   * carries: a Grey 400 thumb on a 30% white track off, Grey 800 on 10% white
   * disabled. The accent on is --quantum-accent-control, which is the 200 there.
   */
  [data-theme='quantum-dark'] .quantum-switch__track {
    background: color-mix(in srgb, var(--quantum-white, #FFFFFF) 30%, transparent);
  }

  [data-theme='quantum-dark'] .quantum-switch__track[data-state='checked'] {
    background: color-mix(in srgb, var(--quantum-accent-control, #F48FB1) 50%, transparent);
  }

  [data-theme='quantum-dark'] .quantum-switch__thumb {
    background: var(--quantum-grey-400, #BDBDBD);
  }

  [data-theme='quantum-dark'] .quantum-switch__thumb[data-state='checked'] {
    background: var(--quantum-accent-control, #F48FB1);
  }

  [data-theme='quantum-dark'] .quantum-switch__control[data-disabled] .quantum-switch__track {
    background: color-mix(in srgb, var(--quantum-white, #FFFFFF) 10%, transparent);
  }

  [data-theme='quantum-dark'] .quantum-switch__control[data-disabled] .quantum-switch__thumb {
    background: var(--quantum-grey-800, #424242);
  }

  /* Right to left: the off thumb rests at the start (right) edge and travels left. */
  .quantum-switch:dir(rtl) .quantum-switch__track {
    transform: scaleX(-1);
  }

  .quantum-switch:dir(rtl) .quantum-switch__control::before {
    left: calc(26px - var(--quantum-touch-target, 48px) / 2);
  }

  .quantum-switch:dir(rtl) .quantum-switch__control[data-state='checked']::before {
    transform: translateX(-16px);
  }

  .quantum-switch:dir(rtl) .quantum-switch__control > .quantum-ripple {
    transform: translateX(8px);
  }

  .quantum-switch:dir(rtl) .quantum-switch__control[data-state='checked'] > .quantum-ripple {
    transform: translateX(-8px);
  }

  /* The label: Body 1 in the primary ink; disabled text when the control is. */
  .quantum-switch__label {
    color: var(--quantum-text-primary, rgba(0, 0, 0, 0.87));
    font-family: var(--quantum-font-family, Roboto, Noto, sans-serif);
    font-size: var(--quantum-type-body-1-size, 14px);
    font-weight: var(--quantum-type-body-1-weight, 400);
    line-height: var(--quantum-type-body-1-leading, 20px);
    letter-spacing: var(--quantum-type-body-1-tracking, 0.01em);
  }

  .quantum-switch__control[data-disabled] ~ .quantum-switch__label {
    color: var(--quantum-text-disabled, rgba(0, 0, 0, 0.38));
  }
</style>
