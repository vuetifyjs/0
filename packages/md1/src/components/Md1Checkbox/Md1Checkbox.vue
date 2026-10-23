<script lang="ts">
  // Framework
  import { Checkbox, isNullOrUndefined, isString, useId, useLogger } from '@vuetify/v0'

  // Utilities
  import { toRef, useAttrs, useSlots, watch } from 'vue'

  // Types
  import type { CheckboxRootProps } from '@vuetify/v0'

  // Components
  import Md1Icon from '../Md1Icon/Md1Icon.vue'
  import Md1Ripple from '../Md1Ripple/Md1Ripple.vue'

  /**
   * Material Design 1 withholds `id`, `form`, `groupNamespace`, `ariaLabelledby`,
   * `ariaDescribedby` and `ariaInvalid` from v0's checkbox props: the visible
   * `label` names the control through `aria-labelledby`, and the selection
   * controls page has no error state. `indeterminate` is the declared
   * extension (SPEC.md, Deviations): MD1 draws no mixed state, the data table's
   * select-all needs one.
   */
  export interface Md1CheckboxProps extends Pick<
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
  defineOptions({ name: 'Md1Checkbox' })

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
  } = defineProps<Md1CheckboxProps>()

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
      if (wrong) logger.warn('[Md1Checkbox] the checkbox has no accessible name: pass label, slot content or ariaLabel')
    }, { immediate: true })
  }
</script>

<template>
  <label class="md1-checkbox">
    <Checkbox.Root
      v-model="model"
      :aria-labelledby="labelledby"
      class="md1-checkbox__control"
      :disabled
      :indeterminate
      :label="ariaLabel"
      :name
      :namespace
      :value
    >
      <Md1Ripple unbounded />

      <span class="md1-checkbox__box">
        <Checkbox.Indicator v-slot="{ isMixed }" class="md1-checkbox__check" :namespace>
          <Md1Icon :name="isMixed ? 'remove' : 'check'" />
        </Checkbox.Indicator>
      </span>
    </Checkbox.Root>

    <span v-if="text" :id="`${id}-label`" class="md1-checkbox__label">
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
  .md1-checkbox {
    display: inline-flex;
    align-items: center;
    gap: var(--md1-spacing-1, 8px);
    min-height: var(--md1-touch-target, 48px);
    vertical-align: middle;
    cursor: pointer;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
  }

  .md1-checkbox:has(> .md1-checkbox__control[data-disabled]) {
    cursor: default;
  }

  /* The 24 dp icon box the 18 dp square sits in; off ink is 54% black, 70% white on dark. */
  .md1-checkbox__control {
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
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
    cursor: inherit;
    -webkit-tap-highlight-color: transparent;
    transition: color var(--md1-duration-standard, 300ms) var(--md1-easing-standard, cubic-bezier(0.4, 0, 0.2, 1));
  }

  /*
   * The 48 dp radial reaction, centred on the control. It is also the hit area:
   * the 48 dp touch target around a 24 dp control. Drawn for keyboard focus;
   * the press reaction is the ripple's.
   */
  .md1-checkbox__control::before {
    content: '';
    position: absolute;
    inset: calc((24px - var(--md1-touch-target, 48px)) / 2);
    border-radius: 50%;
    background: transparent;
    transition: background-color var(--md1-duration-standard, 300ms) var(--md1-easing-standard, cubic-bezier(0.4, 0, 0.2, 1));
  }

  .md1-checkbox__control:focus-visible {
    outline: 2px solid transparent;
  }

  .md1-checkbox__control:focus-visible::before {
    background: var(--md1-hover, rgba(0, 0, 0, 0.06));
  }

  .md1-checkbox__control:not([data-state='unchecked']):focus-visible::before {
    background: color-mix(in srgb, var(--md1-accent, #FF4081) 10%, transparent);
  }

  /* Off: black 6% (white 10% on dark); on: 10% of the accent. The sheets measure 6 to 10%. */
  .md1-checkbox__control > .md1-ripple {
    color: var(--md1-hover, rgba(0, 0, 0, 0.06));
  }

  .md1-checkbox__control:not([data-state='unchecked']) > .md1-ripple {
    color: color-mix(in srgb, var(--md1-accent, #FF4081) 10%, transparent);
  }

  /* Desktop: no radial reaction with a mouse (selection controls page). Hidden, not removed, so the inks still settle. */
  @media (pointer: fine) {
    .md1-checkbox__control > .md1-ripple {
      opacity: 0;
    }
  }

  .md1-checkbox__control[data-state='checked'],
  .md1-checkbox__control[data-state='indeterminate'] {
    color: var(--md1-accent, #FF4081);
  }

  /* Disabled: 26% black, 30% white on dark, with no reaction. */
  .md1-checkbox__control[data-disabled] {
    color: var(--md1-button-disabled-text, rgba(0, 0, 0, 0.26));
    pointer-events: none;
  }

  /* A disabled checkbox stays focusable (v0 sets no tabindex): focus draws the grey halo whatever the state. */
  .md1-checkbox__control[data-disabled]:focus-visible::before {
    background: var(--md1-hover, rgba(0, 0, 0, 0.06));
  }

  /* The 18 dp square: a 2 dp border and 2 dp corners, filled with the ink when on. */
  .md1-checkbox__box {
    position: relative;
    display: block;
    box-sizing: border-box;
    width: 18px;
    height: 18px;
    border: 2px solid currentColor;
    border-radius: var(--md1-radius, 2px);
    background: transparent;
    transition: background-color var(--md1-duration-standard, 300ms) var(--md1-easing-standard, cubic-bezier(0.4, 0, 0.2, 1));
  }

  .md1-checkbox__control:not([data-state='unchecked']) .md1-checkbox__box {
    background: currentColor;
  }

  /* The white check, or the dash under indeterminate, across the whole square. */
  .md1-checkbox__check {
    position: absolute;
    inset: -2px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--md1-on-accent, #FFFFFF);
  }

  .md1-checkbox__check .md1-icon {
    --md1-icon-size: 18px;
  }

  /* A disabled check is cut out of the 26% square: it takes the sheet's colour. */
  .md1-checkbox__control[data-disabled] .md1-checkbox__check {
    color: var(--md1-surface, #FFFFFF);
  }

  /* The label: Body 1 in the primary ink; disabled text when the control is. */
  .md1-checkbox__label {
    color: var(--md1-text-primary, rgba(0, 0, 0, 0.87));
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-body-1-size, 14px);
    font-weight: var(--md1-type-body-1-weight, 400);
    line-height: var(--md1-type-body-1-leading, 20px);
    letter-spacing: var(--md1-type-body-1-tracking, 0.01em);
  }

  .md1-checkbox__control[data-disabled] ~ .md1-checkbox__label {
    color: var(--md1-text-disabled, rgba(0, 0, 0, 0.38));
  }
</style>
