<script lang="ts">
  // Framework
  import { isNullOrUndefined, Toggle, useLogger } from '@vuetify/v0'

  // Utilities
  import { toRef, useAttrs, watch } from 'vue'

  // Types
  import type { QuIconName } from '../../icons'
  import type { ToggleRootProps } from '@vuetify/v0'

  // Components
  import QuIcon from '../QuIcon/QuIcon.vue'
  import QuRipple from '../QuRipple/QuRipple.vue'

  /**
   * Quantum withholds `value` and `groupNamespace` from v0's toggle props: the
   * icon toggle is the buttons page's single choice, selected or deselected
   * (a star, a bookmark); grouped toggles are `QuToggleButtons`.
   */
  export interface QuIconToggleProps extends Pick<ToggleRootProps, 'disabled' | 'namespace'> {
    /** The glyph role drawn while the toggle is off. */
    icon: QuIconName
    /** The glyph role drawn while the toggle is on; defaults to `icon`, so the state then reads from the ink alone. */
    iconOn?: QuIconName
    /**
     * The buttons page lets an icon toggle's ink run bounded or unbounded. On
     * by default: the 48 dp circle of ink extends past the 24 dp glyph. `false`
     * clips the ink to the toggle's circle, growing from the press point.
     */
    unbounded?: boolean
    /** Accessible name. Required: the glyph is hidden from assistive technology. */
    ariaLabel?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'QuIconToggle' })

  const {
    disabled = false,
    icon,
    iconOn,
    unbounded = true,
    ariaLabel,
    namespace,
  } = defineProps<QuIconToggleProps>()

  const model = defineModel<boolean>()

  const attrs = useAttrs()
  const logger = useLogger()

  const on = toRef(() => iconOn ?? icon)

  if (__DEV__) {
    // A consumer may name the toggle from a visible caption through
    // `aria-labelledby` instead; only a toggle with neither has no name.
    watch(() => isNullOrUndefined(ariaLabel) && isNullOrUndefined(attrs['aria-labelledby']), wrong => {
      if (wrong) logger.warn('[QuIconToggle] the toggle has no accessible name: the glyph is aria-hidden, so pass ariaLabel')
    }, { immediate: true })
  }
</script>

<template>
  <Toggle.Root
    v-model="model"
    :aria-label
    class="quantum-icon-toggle"
    :data-unbounded="unbounded || undefined"
    :disabled
    :namespace
  >
    <QuRipple :unbounded />

    <!-- Renderless: the indicator reads the pressed state, and the single glyph swaps with it rather than hiding. -->
    <Toggle.Indicator v-slot="{ isPressed }" :namespace renderless>
      <QuIcon :name="isPressed ? on : icon" />
    </Toggle.Indicator>
  </Toggle.Root>
</template>

<!-- Unscoped: Toggle.Root is multi-root; a scoped data-v never lands on the <button>. -->
<style>
  /*
   * The 24 dp system icon centred in its 48 dp touch target (icons page). The
   * ink tiers are the icons page's: inactive at rest, active while on.
   */
  .quantum-icon-toggle {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    width: var(--quantum-touch-target, 48px);
    height: var(--quantum-touch-target, 48px);
    margin: 0;
    padding: 0;
    border: 0;
    border-radius: 50%;
    background: transparent;
    color: var(--quantum-icon-inactive, rgba(0, 0, 0, 0.38));
    vertical-align: middle;
    cursor: pointer;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
    transition:
      background-color var(--quantum-duration-standard, 300ms) var(--quantum-easing-standard, cubic-bezier(0.4, 0, 0.2, 1)),
      color var(--quantum-duration-standard, 300ms) var(--quantum-easing-standard, cubic-bezier(0.4, 0, 0.2, 1));
  }

  .quantum-icon-toggle[data-state='on'] {
    color: var(--quantum-icon-active, rgba(0, 0, 0, 0.54));
  }

  /*
   * Focus: the buttons page ties the indicator's colour and opacity to the
   * icon's own colour, and its focus overlay is 12%. The glyph also lifts to
   * the icons page's focused tier (87%), but that alone is no indicator in the
   * dark theme, where an on toggle is already at 100%; the 12% circle in the
   * glyph's ink shows focus in every state. The outline is transparent so
   * nothing else paints, and solid so forced colours mode, which drops
   * backgrounds, still draws a ring.
   */
  .quantum-icon-toggle:focus-visible {
    outline: 2px solid transparent;
    color: var(--quantum-icon-focused, rgba(0, 0, 0, 0.87));
    background-color: color-mix(in srgb, currentcolor 12%, transparent);
  }

  /* The page draws the disabled toggle only as an image: it takes the buttons page's disabled ink (26% black, 30% white). */
  .quantum-icon-toggle[data-disabled] {
    color: var(--quantum-button-disabled-text, rgba(0, 0, 0, 0.26));
    pointer-events: none;
  }

  /* Positioned so the glyph paints above the ink layer, which is absolutely positioned and would otherwise cover it. */
  .quantum-icon-toggle .quantum-icon {
    position: relative;
  }

  /*
   * Dense hosts (a Quantum toolbar or list carrying data-dense): the icons
   * page condenses the system icon to 20 dp in a 40 dp target for mouse and
   * keyboard layouts. The toggle has no dense prop of its own; the host rules.
   */
  [data-dense] .quantum-icon-toggle {
    width: 40px;
    height: 40px;
  }

  [data-dense] .quantum-icon-toggle .quantum-icon {
    --quantum-icon-size: var(--quantum-icon-size-dense, 20px);
  }
</style>
