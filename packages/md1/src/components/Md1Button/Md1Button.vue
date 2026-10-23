<script lang="ts">
  // Framework
  import { Button, isString, useLogger } from '@vuetify/v0'

  // Utilities
  import { toRef, useSlots, watch } from 'vue'

  // Types
  import type { Md1IconName } from '../../icons'
  import type { ButtonRootProps } from '@vuetify/v0'

  // Components
  import Md1Icon from '../Md1Icon/Md1Icon.vue'
  import Md1Ripple from '../Md1Ripple/Md1Ripple.vue'

  /** The buttons page's two text buttons. The floating action button is `Md1Fab`. */
  export type Md1ButtonVariant = 'flat' | 'raised'

  /**
   * MD1 withholds `loading`, `readonly`, `passive`, `grace`, `value`,
   * `groupNamespace` and `form` from v0's button props: MD1 buttons have no
   * loading state (SPEC.md, ruling 7), grouped toggles are `Md1ToggleButtons`,
   * and form association is not part of the MD1 button surface. `name` stays
   * because SPEC.md lists it: it feeds v0's hidden input, which is unchecked
   * on a standalone button and so submits nothing unless the button is
   * selected inside a v0 `Button.Group`.
   */
  export interface Md1ButtonProps extends Pick<
    ButtonRootProps,
    'disabled' | 'ariaLabel' | 'name' | 'namespace'
  > {
    /** `flat` is ink printed on the sheet it sits on; `raised` is a 2 dp sheet of its own in the primary colour. */
    variant?: Md1ButtonVariant
    /** The condensed form for mouse and keyboard layouts: 32 dp tall with a 13 sp label. */
    dense?: boolean
    /**
     * The persistent footer button: 48 dp tall, the width of its container,
     * square corners. Footer buttons are flat; pairing it with `raised` warns in dev.
     */
    footer?: boolean
    /**
     * A glyph role drawn through `Md1Icon` ahead of the label. With no label the
     * button is icon-only: a 48 dp circular target that needs `ariaLabel`.
     */
    icon?: Md1IconName
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'Md1Button' })

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
  } = defineProps<Md1ButtonProps>()

  const slots = useSlots()
  const logger = useLogger()

  // An icon-only button renders no Button.Content, so Button.Icon can mark the
  // root solo (data-solo and the aria-label fallback); an empty label would hide it.
  const solo = toRef(() => isString(icon) && !slots.default)

  if (__DEV__) {
    watch(() => footer && variant === 'raised', wrong => {
      if (wrong) logger.warn('[Md1Button] persistent footer buttons are flat (buttons page); `footer` with variant="raised" is not a spec form')
    }, { immediate: true })

    watch(() => solo.value && !ariaLabel, wrong => {
      if (wrong) logger.warn('[Md1Button] an icon-only button has no accessible name: the glyph is aria-hidden, so pass ariaLabel')
    }, { immediate: true })
  }
</script>

<template>
  <Button.Root
    :aria-label
    class="md1-button"
    :data-dense="dense || undefined"
    :data-footer="footer || undefined"
    :data-variant="variant"
    :disabled
    :name
    :namespace
  >
    <Md1Ripple />

    <Button.Icon v-if="icon" class="md1-button__icon" :namespace>
      <Md1Icon :name="icon" :size="dense ? 's' : 'm'" />
    </Button.Icon>

    <Button.Content v-if="!solo" class="md1-button__content" :namespace>
      <slot />
    </Button.Content>
  </Button.Root>
</template>

<!-- Unscoped: Button.Root is multi-root; a scoped data-v never lands on the <button>. -->
<style>
  .md1-button {
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
    border-radius: var(--md1-radius, 2px);
    background: transparent;
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-button-size, 14px);
    font-weight: var(--md1-type-button-weight, 500);
    line-height: var(--md1-type-button-leading, 1);
    letter-spacing: var(--md1-type-button-tracking, 0.01em);
    text-transform: var(--md1-type-button-transform, uppercase);
    text-decoration: none;
    white-space: nowrap;
    vertical-align: middle;
    cursor: pointer;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
    transition:
      background-color var(--md1-duration-standard, 300ms) var(--md1-easing-standard, cubic-bezier(0.4, 0, 0.2, 1)),
      color var(--md1-duration-standard, 300ms) var(--md1-easing-standard, cubic-bezier(0.4, 0, 0.2, 1)),
      box-shadow 280ms var(--md1-easing-standard, cubic-bezier(0.4, 0, 0.2, 1));
  }

  /*
   * The 48 dp touch target around the 36 dp button (metrics and keylines page)
   * as a transparent hit area: it costs no layout and no margin. The dense
   * button reaches further; the footer and icon-only forms are 48 dp already.
   */
  .md1-button::after {
    content: '';
    position: absolute;
    inset: calc((36px - var(--md1-touch-target, 48px)) / 2) 0;
  }

  .md1-button[data-dense]::after {
    inset: calc((32px - var(--md1-touch-target, 48px)) / 2) 0;
  }

  .md1-button[data-footer]::after,
  .md1-button[data-solo]::after {
    content: none;
  }

  /* Flat: ink in the accent, the colour that sets a button apart from text (colour page). */
  .md1-button[data-variant='flat'] {
    color: var(--md1-accent, #FF4081);
  }

  /* Raised: a sheet in the primary colour resting at 2 dp. */
  .md1-button[data-variant='raised'] {
    background: var(--md1-primary, #3F51B5);
    color: var(--md1-on-primary, #FFFFFF);
    box-shadow: var(--md1-elevation-2, 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12));
  }

  /*
   * Focus: the page's 12% overlay, keyboard only. Flat takes 12% of its own
   * ink; raised takes a 12% black shade over the colour. The outline is
   * transparent so nothing paints beside the overlay, and solid so forced
   * colours mode, which drops backgrounds, still draws a ring.
   */
  .md1-button:focus-visible {
    outline: 2px solid transparent;
    background-color: color-mix(in srgb, currentcolor 12%, transparent);
  }

  .md1-button[data-variant='raised']:focus-visible {
    background-color: color-mix(in srgb, var(--md1-black, #000000) 12%, var(--md1-primary, #3F51B5));
  }

  /* Pressed: the raised sheet lifts to 8 dp and fills with the 700 shade. The ink itself is Md1Ripple's. */
  .md1-button[data-variant='raised']:active {
    background-color: var(--md1-primary-dark, #303F9F);
    box-shadow: var(--md1-elevation-8, 0px 5px 5px -3px rgba(0, 0, 0, 0.2), 0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12));
  }

  /* Desktop (mouse and keyboard): the raised button rests seamed at 0 dp and gains 2 dp on hover and press. */
  @media (pointer: fine) {
    .md1-button[data-variant='raised'] {
      box-shadow: var(--md1-elevation-0, none);
    }

    .md1-button[data-variant='raised']:hover,
    .md1-button[data-variant='raised']:active {
      box-shadow: var(--md1-elevation-2, 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12));
    }
  }

  /* Disabled: 26% black ink (30% white in the dark theme); the raised container drops to 12% and casts no shadow. */
  .md1-button[data-disabled] {
    color: var(--md1-button-disabled-text, rgba(0, 0, 0, 0.26));
    pointer-events: none;
  }

  .md1-button[data-variant='raised'][data-disabled] {
    background: var(--md1-button-disabled, rgba(0, 0, 0, 0.12));
    box-shadow: none;
  }

  /* Dense: 32 dp and 13 sp for mouse and keyboard layouts; padding and radius are unchanged. */
  .md1-button[data-dense] {
    height: 32px;
    font-size: 13px;
  }

  /* Persistent footer: a 48 dp flat button across its container with square corners. */
  .md1-button[data-footer] {
    width: 100%;
    height: 48px;
    border-radius: 0;
  }

  /* Icon-only: Button.Root sets data-solo when Button.Icon is the only child. The glyph sits centred in the touch target. */
  .md1-button[data-solo] {
    width: var(--md1-touch-target, 48px);
    min-width: var(--md1-touch-target, 48px);
    height: var(--md1-touch-target, 48px);
    padding: 0;
    border-radius: 50%;
  }

  /* The icon toggle's dense rule (buttons page): a 20 dp glyph in a 40 dp target. */
  .md1-button[data-solo][data-dense] {
    width: 40px;
    min-width: 40px;
    height: 40px;
  }

  /* Positioned so both paint above the ink layer, which is absolutely positioned and would otherwise cover them. */
  .md1-button__icon,
  .md1-button__content {
    position: relative;
    display: inline-flex;
    align-items: center;
  }

  /* The page gives no icon-to-label gap; one step of the 8 dp grid. */
  .md1-button__icon {
    margin-inline-end: var(--md1-spacing-1, 8px);
  }

  .md1-button[data-solo] .md1-button__icon {
    margin: 0;
  }
</style>
