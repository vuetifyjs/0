<script lang="ts">
  // Framework
  import { isNullOrUndefined, Toggle, useLogger } from '@vuetify/v0'

  // Utilities
  import { toRef, useAttrs, watch } from 'vue'

  // Types
  import type { Md1IconName } from '../../icons'
  import type { ToggleRootProps } from '@vuetify/v0'

  // Components
  import Md1Icon from '../Md1Icon/Md1Icon.vue'
  import Md1Ripple from '../Md1Ripple/Md1Ripple.vue'

  /**
   * MD1 withholds `value` and `groupNamespace` from v0's toggle props: the
   * icon toggle is the buttons page's single choice, selected or deselected
   * (a star, a bookmark); grouped toggles are `Md1ToggleButtons`.
   */
  export interface Md1IconToggleProps extends Pick<ToggleRootProps, 'disabled' | 'namespace'> {
    /** The glyph role drawn while the toggle is off. */
    icon: Md1IconName
    /** The glyph role drawn while the toggle is on; defaults to `icon`, so the state then reads from the ink alone. */
    iconOn?: Md1IconName
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
  defineOptions({ name: 'Md1IconToggle' })

  const {
    disabled = false,
    icon,
    iconOn,
    unbounded = true,
    ariaLabel,
    namespace,
  } = defineProps<Md1IconToggleProps>()

  const model = defineModel<boolean>()

  const attrs = useAttrs()
  const logger = useLogger()

  const on = toRef(() => iconOn ?? icon)

  if (__DEV__) {
    // A consumer may name the toggle from a visible caption through
    // `aria-labelledby` instead; only a toggle with neither has no name.
    watch(() => isNullOrUndefined(ariaLabel) && isNullOrUndefined(attrs['aria-labelledby']), wrong => {
      if (wrong) logger.warn('[Md1IconToggle] the toggle has no accessible name: the glyph is aria-hidden, so pass ariaLabel')
    }, { immediate: true })
  }
</script>

<template>
  <Toggle.Root
    v-model="model"
    :aria-label
    class="md1-icon-toggle"
    :data-unbounded="unbounded || undefined"
    :disabled
    :namespace
  >
    <Md1Ripple :unbounded />

    <!-- Renderless: the indicator reads the pressed state, and the single glyph swaps with it rather than hiding. -->
    <Toggle.Indicator v-slot="{ isPressed }" :namespace renderless>
      <Md1Icon :name="isPressed ? on : icon" />
    </Toggle.Indicator>
  </Toggle.Root>
</template>

<!-- Unscoped: Toggle.Root is multi-root; a scoped data-v never lands on the <button>. -->
<style>
  /*
   * The 24 dp system icon centred in its 48 dp touch target (icons page). The
   * ink tiers are the icons page's: inactive at rest, active while on.
   */
  .md1-icon-toggle {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    width: var(--md1-touch-target, 48px);
    height: var(--md1-touch-target, 48px);
    margin: 0;
    padding: 0;
    border: 0;
    border-radius: 50%;
    background: transparent;
    color: var(--md1-icon-inactive, rgba(0, 0, 0, 0.38));
    vertical-align: middle;
    cursor: pointer;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
    transition:
      background-color var(--md1-duration-standard, 300ms) var(--md1-easing-standard, cubic-bezier(0.4, 0, 0.2, 1)),
      color var(--md1-duration-standard, 300ms) var(--md1-easing-standard, cubic-bezier(0.4, 0, 0.2, 1));
  }

  .md1-icon-toggle[data-state='on'] {
    color: var(--md1-icon-active, rgba(0, 0, 0, 0.54));
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
  .md1-icon-toggle:focus-visible {
    outline: 2px solid transparent;
    color: var(--md1-icon-focused, rgba(0, 0, 0, 0.87));
    background-color: color-mix(in srgb, currentcolor 12%, transparent);
  }

  /* The page draws the disabled toggle only as an image: it takes the buttons page's disabled ink (26% black, 30% white). */
  .md1-icon-toggle[data-disabled] {
    color: var(--md1-button-disabled-text, rgba(0, 0, 0, 0.26));
    pointer-events: none;
  }

  /* Positioned so the glyph paints above the ink layer, which is absolutely positioned and would otherwise cover it. */
  .md1-icon-toggle .md1-icon {
    position: relative;
  }

  /*
   * Dense hosts (an MD1 toolbar or list carrying data-dense): the icons
   * page condenses the system icon to 20 dp in a 40 dp target for mouse and
   * keyboard layouts. The toggle has no dense prop of its own; the host rules.
   */
  [data-dense] .md1-icon-toggle {
    width: 40px;
    height: 40px;
  }

  [data-dense] .md1-icon-toggle .md1-icon {
    --md1-icon-size: var(--md1-icon-size-dense, 20px);
  }
</style>
