<script lang="ts">
  // Framework
  import { Checkbox, isNullOrUndefined, isString, useId, useLogger } from '@vuetify/v0'

  // Utilities
  import { toRef, useAttrs, useSlots, watch } from 'vue'

  // Types
  import type { CheckboxRootProps } from '@vuetify/v0'

  // Components
  import QuIcon from '../QuIcon/QuIcon.vue'
  import QuRipple from '../QuRipple/QuRipple.vue'

  /**
   * Quantum withholds `id`, `form`, `groupNamespace`, `ariaLabelledby`,
   * `ariaDescribedby` and `ariaInvalid` from v0's checkbox props: the visible
   * `label` names the control through `aria-labelledby`, and the selection
   * controls page has no error state. `indeterminate` is the declared
   * extension (SPEC.md, Deviations): MD1 draws no mixed state, the data table's
   * select-all needs one.
   */
  export interface QuCheckboxProps extends Pick<
    CheckboxRootProps,
    'value' | 'name' | 'namespace'
  > {
    /**
     * Inert: the disabled ink, no activation, no ripple. A plain boolean rather
     * than v0's `MaybeRefOrGetter`, so the SFC compiler emits a Boolean prop and
     * a bare `disabled` attribute casts to `true` in every consumer build.
     */
    disabled?: boolean
    /** The visible text beside the box; the control's `aria-labelledby` points at it. The default slot replaces it. */
    label?: string
    /** The mixed state (extra-spec): the box fills and draws a dash instead of the check. */
    indeterminate?: boolean
    /** Accessible name for a checkbox with no visible label, such as a data table row. */
    ariaLabel?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'QuCheckbox' })

  defineSlots<{
    /** Rich label content; replaces `label`. */
    default?: () => any
  }>()

  const {
    label,
    value,
    name,
    disabled = false,
    indeterminate = false,
    ariaLabel,
    namespace,
  } = defineProps<QuCheckboxProps>()

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
      if (wrong) logger.warn('[QuCheckbox] the checkbox has no accessible name: pass label, slot content or ariaLabel')
    }, { immediate: true })
  }
</script>

<template>
  <label class="quantum-checkbox">
    <Checkbox.Root
      v-model="model"
      :aria-labelledby="labelledby"
      class="quantum-checkbox__control"
      :disabled
      :indeterminate
      :label="ariaLabel"
      :name
      :namespace
      :value
    >
      <QuRipple unbounded />

      <span class="quantum-checkbox__box">
        <Checkbox.Indicator v-slot="{ isMixed }" class="quantum-checkbox__check" :namespace>
          <QuIcon :name="isMixed ? 'remove' : 'check'" />
        </Checkbox.Indicator>
      </span>
    </Checkbox.Root>

    <span v-if="text" :id="`${id}-label`" class="quantum-checkbox__label">
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>

<!-- Unscoped: Checkbox.Root is multi-root; a scoped data-v never lands on the <button>. -->
<style>
  /*
   * The row: control, the 8 dp gap (a decision; the page gives none) and the
   * label, 48 dp tall so stacked controls keep their touch targets apart. The
   * whole label is a click target through the native <label>.
   */
  .quantum-checkbox {
    display: inline-flex;
    align-items: center;
    gap: var(--quantum-spacing-1, 8px);
    min-height: var(--quantum-touch-target, 48px);
    vertical-align: middle;
    cursor: pointer;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
  }

  .quantum-checkbox:has(> .quantum-checkbox__control[data-disabled]) {
    cursor: default;
  }

  /* The 24 dp icon box the 18 dp square sits in; off ink is 54% black, 70% white on dark. */
  .quantum-checkbox__control {
    position: relative;
    display: inline-flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    width: 24px;
    height: 24px;
    margin: 0;
    padding: 0;
    border: 0;
    border-radius: 50%;
    background: transparent;
    color: var(--quantum-text-secondary, rgba(0, 0, 0, 0.54));
    cursor: inherit;
    -webkit-tap-highlight-color: transparent;
    transition: color var(--quantum-duration-standard, 300ms) var(--quantum-easing-standard, cubic-bezier(0.4, 0, 0.2, 1));
  }

  /*
   * The 48 dp radial reaction, centred on the control. It is also the hit area:
   * the 48 dp touch target around a 24 dp control. Drawn for keyboard focus;
   * the press reaction is the ripple's.
   */
  .quantum-checkbox__control::before {
    content: '';
    position: absolute;
    inset: calc((24px - var(--quantum-touch-target, 48px)) / 2);
    border-radius: 50%;
    background: transparent;
    transition: background-color var(--quantum-duration-standard, 300ms) var(--quantum-easing-standard, cubic-bezier(0.4, 0, 0.2, 1));
  }

  .quantum-checkbox__control:focus-visible {
    outline: 2px solid transparent;
  }

  .quantum-checkbox__control:focus-visible::before {
    background: var(--quantum-hover, rgba(0, 0, 0, 0.06));
  }

  .quantum-checkbox__control:not([data-state='unchecked']):focus-visible::before {
    background: color-mix(in srgb, var(--quantum-accent, #FF4081) 10%, transparent);
  }

  /* Off: black 6% (white 10% on dark); on: 10% of the accent. The sheets measure 6 to 10%. */
  .quantum-checkbox__control > .quantum-ripple {
    color: var(--quantum-hover, rgba(0, 0, 0, 0.06));
  }

  .quantum-checkbox__control:not([data-state='unchecked']) > .quantum-ripple {
    color: color-mix(in srgb, var(--quantum-accent, #FF4081) 10%, transparent);
  }

  /* Desktop: no radial reaction with a mouse (selection controls page). Hidden, not removed, so the inks still settle. */
  @media (pointer: fine) {
    .quantum-checkbox__control > .quantum-ripple {
      opacity: 0;
    }
  }

  .quantum-checkbox__control[data-state='checked'],
  .quantum-checkbox__control[data-state='indeterminate'] {
    color: var(--quantum-accent, #FF4081);
  }

  /* Disabled: 26% black, 30% white on dark, with no reaction. */
  .quantum-checkbox__control[data-disabled] {
    color: var(--quantum-button-disabled-text, rgba(0, 0, 0, 0.26));
    pointer-events: none;
  }

  /* A disabled checkbox stays focusable (v0 sets no tabindex): focus draws the grey halo whatever the state. */
  .quantum-checkbox__control[data-disabled]:focus-visible::before {
    background: var(--quantum-hover, rgba(0, 0, 0, 0.06));
  }

  /* The 18 dp square: a 2 dp border and 2 dp corners, filled with the ink when on. */
  .quantum-checkbox__box {
    position: relative;
    display: block;
    box-sizing: border-box;
    width: 18px;
    height: 18px;
    border: 2px solid currentColor;
    border-radius: var(--quantum-radius, 2px);
    background: transparent;
    transition: background-color var(--quantum-duration-standard, 300ms) var(--quantum-easing-standard, cubic-bezier(0.4, 0, 0.2, 1));
  }

  .quantum-checkbox__control:not([data-state='unchecked']) .quantum-checkbox__box {
    background: currentColor;
  }

  /* The white check, or the dash under indeterminate, across the whole square. */
  .quantum-checkbox__check {
    position: absolute;
    inset: -2px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--quantum-on-accent, #FFFFFF);
  }

  .quantum-checkbox__check .quantum-icon {
    --quantum-icon-size: 18px;
  }

  /* A disabled check is cut out of the 26% square: it takes the sheet's colour. */
  .quantum-checkbox__control[data-disabled] .quantum-checkbox__check {
    color: var(--quantum-surface, #FFFFFF);
  }

  /* The label: Body 1 in the primary ink; disabled text when the control is. */
  .quantum-checkbox__label {
    color: var(--quantum-text-primary, rgba(0, 0, 0, 0.87));
    font-family: var(--quantum-font-family, Roboto, Noto, sans-serif);
    font-size: var(--quantum-type-body-1-size, 14px);
    font-weight: var(--quantum-type-body-1-weight, 400);
    line-height: var(--quantum-type-body-1-leading, 20px);
    letter-spacing: var(--quantum-type-body-1-tracking, 0.01em);
  }

  .quantum-checkbox__control[data-disabled] ~ .quantum-checkbox__label {
    color: var(--quantum-text-disabled, rgba(0, 0, 0, 0.38));
  }
</style>
