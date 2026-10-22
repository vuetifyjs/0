<script lang="ts">
  // Framework
  import { Button, isString, useLogger } from '@vuetify/v0'

  // Utilities
  import { toRef, useSlots, watch } from 'vue'

  // Types
  import type { QuIconName } from '../../icons'
  import type { ButtonRootProps } from '@vuetify/v0'

  // Components
  import QuIcon from '../QuIcon/QuIcon.vue'
  import QuRipple from '../QuRipple/QuRipple.vue'

  /** The buttons page's two text buttons. The floating action button is `QuFab`. */
  export type QuButtonVariant = 'flat' | 'raised'

  /**
   * Quantum withholds `loading`, `readonly`, `passive`, `grace`, `value`,
   * `groupNamespace` and `form` from v0's button props: MD1 buttons have no
   * loading state (SPEC.md, ruling 7), grouped toggles are `QuToggleButtons`,
   * and form association is not part of the MD1 button surface. `name` stays
   * because SPEC.md lists it: it feeds v0's hidden input, which is unchecked
   * on a standalone button and so submits nothing unless the button is
   * selected inside a v0 `Button.Group`.
   */
  export interface QuButtonProps extends Pick<
    ButtonRootProps,
    'disabled' | 'ariaLabel' | 'name' | 'namespace'
  > {
    /** `flat` is ink printed on the sheet it sits on; `raised` is a 2 dp sheet of its own in the primary colour. */
    variant?: QuButtonVariant
    /** The condensed form for mouse and keyboard layouts: 32 dp tall with a 13 sp label. */
    dense?: boolean
    /**
     * The persistent footer button: 48 dp tall, the width of its container,
     * square corners. Footer buttons are flat; pairing it with `raised` warns in dev.
     */
    footer?: boolean
    /**
     * A glyph role drawn through `QuIcon` ahead of the label. With no label the
     * button is icon-only: a 48 dp circular target that needs `ariaLabel`.
     */
    icon?: QuIconName
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'QuButton' })

  defineSlots<{
    /** The label. Leave it out, with `icon` set, for an icon-only button. */
    default?: () => any
  }>()

  const {
    disabled = false,
    variant = 'flat',
    dense = false,
    footer = false,
    icon,
    ariaLabel,
    name,
    namespace,
  } = defineProps<QuButtonProps>()

  const slots = useSlots()
  const logger = useLogger()

  // An icon-only button renders no Button.Content, so Button.Icon can mark the
  // root solo (data-solo and the aria-label fallback); an empty label would hide it.
  const solo = toRef(() => isString(icon) && !slots.default)

  if (__DEV__) {
    watch(() => footer && variant === 'raised', wrong => {
      if (wrong) logger.warn('[QuButton] persistent footer buttons are flat (buttons page); `footer` with variant="raised" is not a spec form')
    }, { immediate: true })

    watch(() => solo.value && !ariaLabel, wrong => {
      if (wrong) logger.warn('[QuButton] an icon-only button has no accessible name: the glyph is aria-hidden, so pass ariaLabel')
    }, { immediate: true })
  }
</script>

<template>
  <Button.Root
    :aria-label
    class="quantum-button"
    :data-dense="dense || undefined"
    :data-footer="footer || undefined"
    :data-variant="variant"
    :disabled
    :name
    :namespace
  >
    <QuRipple />

    <Button.Icon v-if="icon" class="quantum-button__icon" :namespace>
      <QuIcon :name="icon" :size="dense ? 's' : 'm'" />
    </Button.Icon>

    <Button.Content v-if="!solo" class="quantum-button__content" :namespace>
      <slot />
    </Button.Content>
  </Button.Root>
</template>

<!-- Unscoped: Button.Root is multi-root; a scoped data-v never lands on the <button>. -->
<style>
  .quantum-button {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    height: 36px;
    min-width: 88px;
    margin: 0;
    padding: 0 16px;
    border: 0;
    border-radius: var(--quantum-radius, 2px);
    background: transparent;
    font-family: var(--quantum-font-family, Roboto, Noto, sans-serif);
    font-size: var(--quantum-type-button-size, 14px);
    font-weight: var(--quantum-type-button-weight, 500);
    line-height: var(--quantum-type-button-leading, 1);
    letter-spacing: var(--quantum-type-button-tracking, 0.01em);
    text-transform: var(--quantum-type-button-transform, uppercase);
    text-decoration: none;
    white-space: nowrap;
    vertical-align: middle;
    cursor: pointer;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
    transition:
      background-color var(--quantum-duration-standard, 300ms) var(--quantum-easing-standard, cubic-bezier(0.4, 0, 0.2, 1)),
      color var(--quantum-duration-standard, 300ms) var(--quantum-easing-standard, cubic-bezier(0.4, 0, 0.2, 1)),
      box-shadow 280ms var(--quantum-easing-standard, cubic-bezier(0.4, 0, 0.2, 1));
  }

  /*
   * The 48 dp touch target around the 36 dp button (metrics and keylines page)
   * as a transparent hit area: it costs no layout and no margin. The dense
   * button reaches further; the footer and icon-only forms are 48 dp already.
   */
  .quantum-button::after {
    content: '';
    position: absolute;
    inset: calc((36px - var(--quantum-touch-target, 48px)) / 2) 0;
  }

  .quantum-button[data-dense]::after {
    inset: calc((32px - var(--quantum-touch-target, 48px)) / 2) 0;
  }

  .quantum-button[data-footer]::after,
  .quantum-button[data-solo]::after {
    content: none;
  }

  /* Flat: ink in the accent, the colour that sets a button apart from text (colour page). */
  .quantum-button[data-variant='flat'] {
    color: var(--quantum-accent, #FF4081);
  }

  /* Raised: a sheet in the primary colour resting at 2 dp. */
  .quantum-button[data-variant='raised'] {
    background: var(--quantum-primary, #3F51B5);
    color: var(--quantum-on-primary, #FFFFFF);
    box-shadow: var(--quantum-elevation-2, 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12));
  }

  /*
   * Focus: the page's 12% overlay, keyboard only. Flat takes 12% of its own
   * ink; raised takes a 12% black shade over the colour. The outline is
   * transparent so nothing paints beside the overlay, and solid so forced
   * colours mode, which drops backgrounds, still draws a ring.
   */
  .quantum-button:focus-visible {
    outline: 2px solid transparent;
    background-color: color-mix(in srgb, currentcolor 12%, transparent);
  }

  .quantum-button[data-variant='raised']:focus-visible {
    background-color: color-mix(in srgb, var(--quantum-black, #000000) 12%, var(--quantum-primary, #3F51B5));
  }

  /* Pressed: the raised sheet lifts to 8 dp and fills with the 700 shade. The ink itself is QuRipple's. */
  .quantum-button[data-variant='raised']:active {
    background-color: var(--quantum-primary-dark, #303F9F);
    box-shadow: var(--quantum-elevation-8, 0px 5px 5px -3px rgba(0, 0, 0, 0.2), 0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12));
  }

  /* Desktop (mouse and keyboard): the raised button rests seamed at 0 dp and gains 2 dp on hover and press. */
  @media (pointer: fine) {
    .quantum-button[data-variant='raised'] {
      box-shadow: var(--quantum-elevation-0, none);
    }

    .quantum-button[data-variant='raised']:hover,
    .quantum-button[data-variant='raised']:active {
      box-shadow: var(--quantum-elevation-2, 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12));
    }
  }

  /* Disabled: 26% black ink (30% white in the dark theme); the raised container drops to 12% and casts no shadow. */
  .quantum-button[data-disabled] {
    color: var(--quantum-button-disabled-text, rgba(0, 0, 0, 0.26));
    pointer-events: none;
  }

  .quantum-button[data-variant='raised'][data-disabled] {
    background: var(--quantum-button-disabled, rgba(0, 0, 0, 0.12));
    box-shadow: none;
  }

  /* Dense: 32 dp and 13 sp for mouse and keyboard layouts; padding and radius are unchanged. */
  .quantum-button[data-dense] {
    height: 32px;
    font-size: 13px;
  }

  /* Persistent footer: a 48 dp flat button across its container with square corners. */
  .quantum-button[data-footer] {
    width: 100%;
    height: 48px;
    border-radius: 0;
  }

  /* Icon-only: Button.Root sets data-solo when Button.Icon is the only child. The glyph sits centred in the touch target. */
  .quantum-button[data-solo] {
    width: var(--quantum-touch-target, 48px);
    min-width: var(--quantum-touch-target, 48px);
    height: var(--quantum-touch-target, 48px);
    padding: 0;
    border-radius: 50%;
  }

  /* The icon toggle's dense rule (buttons page): a 20 dp glyph in a 40 dp target. */
  .quantum-button[data-solo][data-dense] {
    width: 40px;
    min-width: 40px;
    height: 40px;
  }

  /* Positioned so both paint above the ink layer, which is absolutely positioned and would otherwise cover them. */
  .quantum-button__icon,
  .quantum-button__content {
    position: relative;
    display: inline-flex;
    align-items: center;
  }

  /* The page gives no icon-to-label gap; one step of the 8 dp grid. */
  .quantum-button__icon {
    margin-inline-end: var(--quantum-spacing-1, 8px);
  }

  .quantum-button[data-solo] .quantum-button__icon {
    margin: 0;
  }
</style>
