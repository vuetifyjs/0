<script lang="ts">
  // Framework
  import { isNullOrUndefined, isString, Radio, useId, useLogger } from '@vuetify/v0'

  // Utilities
  import { toRef, useAttrs, useSlots, watch } from 'vue'

  // Types
  import type { RadioRootProps } from '@vuetify/v0'

  // Components
  import Md1Ripple from '../Md1Ripple/Md1Ripple.vue'

  /**
   * Material Design 1 withholds `id`, `form`, `ariaLabelledby`, `ariaDescribedby` and
   * `ariaInvalid` from v0's radio props: the visible `label` names the control
   * through `aria-labelledby`, and the selection controls page has no error
   * state. `groupNamespace` stays so a radio can find an `Md1Radio.Group` given
   * its own `namespace`.
   * As plain attributes, `aria-describedby` and (without a visible label)
   * `aria-labelledby` still reach the control rather than the root `<label>`.
   */
  export interface Md1RadioProps extends Pick<
    RadioRootProps,
    'value' | 'name' | 'namespace' | 'groupNamespace'
  > {
    /**
     * Inert: the disabled ink, no activation, no ripple. A plain boolean rather
     * than v0's `MaybeRefOrGetter<boolean>`, the type every Material Design 1
     * part takes.
     */
    disabled?: boolean
    /** The visible text beside the ring; the control's `aria-labelledby` points at it. The default slot replaces it. */
    label?: string
    /** Accessible name for a radio with no visible label. */
    ariaLabel?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'Md1Radio', inheritAttrs: false })

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
    groupNamespace,
  } = defineProps<Md1RadioProps>()

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
      if (wrong) logger.warn('[Md1Radio] the radio has no accessible name: pass label, slot content or ariaLabel')
    }, { immediate: true })
  }
</script>

<template>
  <label class="md1-radio" v-bind="rest">
    <Radio.Root
      :aria-describedby="describedby"
      :aria-labelledby="labelledby"
      class="md1-radio__control"
      :disabled
      :group-namespace
      :label="ariaLabel"
      :name
      :namespace
      :value
    >
      <Md1Ripple unbounded />

      <span class="md1-radio__ring">
        <Radio.Indicator class="md1-radio__dot" :namespace />
      </span>
    </Radio.Root>

    <span v-if="text" :id="`${id}-label`" class="md1-radio__label">
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>

<!-- Unscoped: Radio.Root is multi-root; a scoped data-v never lands on the <button>. -->
<style>
  /*
   * The row: control, the 8 dp gap (a decision; the page gives none) and the
   * label, 48 dp tall so stacked radios keep their touch targets apart. The
   * whole label is a click target through the native <label>.
   */
  .md1-radio {
    display: inline-flex;
    align-items: center;
    gap: var(--md1-spacing-1, 8px);
    min-height: var(--md1-touch-target, 48px);
    vertical-align: middle;
    cursor: pointer;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
  }

  .md1-radio:has(> .md1-radio__control[data-disabled]) {
    cursor: default;
  }

  /* The 24 dp icon box the 20 dp ring sits in; off ink is 54% black, 70% white on dark. */
  .md1-radio__control {
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
  .md1-radio__control::before {
    content: '';
    position: absolute;
    inset: calc((24px - var(--md1-touch-target, 48px)) / 2);
    border-radius: 50%;
    background: transparent;
    transition: background-color var(--md1-duration-standard, 300ms) var(--md1-easing-standard, cubic-bezier(0.4, 0, 0.2, 1));
  }

  .md1-radio__control:focus-visible {
    outline: 2px solid transparent;
  }

  .md1-radio__control:focus-visible::before {
    background: var(--md1-hover, rgba(0, 0, 0, 0.06));
  }

  .md1-radio__control[data-state='checked']:focus-visible::before {
    background: color-mix(in srgb, var(--md1-accent, #FF4081) 10%, transparent);
  }

  /* Off: black 6% (white 10% on dark); on: 10% of the accent. The sheets measure 6 to 10%. */
  .md1-radio__control > .md1-ripple {
    color: var(--md1-hover, rgba(0, 0, 0, 0.06));
  }

  .md1-radio__control[data-state='checked'] > .md1-ripple {
    color: color-mix(in srgb, var(--md1-accent, #FF4081) 10%, transparent);
  }

  /* Desktop: no radial reaction with a mouse (selection controls page). Hidden, not removed, so the inks still settle. */
  @media (pointer: fine) {
    .md1-radio__control > .md1-ripple {
      opacity: 0;
    }
  }

  .md1-radio__control[data-state='checked'] {
    color: var(--md1-accent, #FF4081);
  }

  /* Disabled: 26% black, 30% white on dark, with no reaction. */
  .md1-radio__control[data-disabled] {
    color: var(--md1-button-disabled-text, rgba(0, 0, 0, 0.26));
    pointer-events: none;
  }

  .md1-radio__control[data-disabled]::before {
    content: none;
  }

  /* The 20 dp ring with a 2 dp stroke. */
  .md1-radio__ring {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    width: 20px;
    height: 20px;
    border: 2px solid currentColor;
    border-radius: 50%;
  }

  /* The 10 dp dot, grown from the centre when the radio turns on. */
  .md1-radio__dot {
    display: block;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: currentColor;
    transform: scale(0);
    transition: transform var(--md1-duration-standard, 300ms) var(--md1-easing-standard, cubic-bezier(0.4, 0, 0.2, 1));
  }

  .md1-radio__dot[data-state='checked'] {
    transform: scale(1);
  }

  /* The label: Body 1 in the primary ink; disabled text when the control is. */
  .md1-radio__label {
    color: var(--md1-text-primary, rgba(0, 0, 0, 0.87));
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-body-1-size, 14px);
    font-weight: var(--md1-type-body-1-weight, 400);
    line-height: var(--md1-type-body-1-leading, 20px);
    letter-spacing: var(--md1-type-body-1-tracking, 0.01em);
  }

  .md1-radio__control[data-disabled] ~ .md1-radio__label {
    color: var(--md1-text-disabled, rgba(0, 0, 0, 0.38));
  }
</style>
