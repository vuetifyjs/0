<script lang="ts">
  // Framework
  import { Atom } from '@vuetify/v0'

  export interface Md1SubheaderProps {
    /**
     * Aligns the text with the list text at the content keyline (72 dp, 80 dp
     * from 600 px) instead of the avatar keyline: the subheaders page's rule
     * for a list whose avatar column holds a left-aligned floating action button.
     */
    inset?: boolean
    /**
     * The coloured subheader: the primary colour in place of the secondary
     * ink, for long lists of complex information (the subheaders page's
     * settings example).
     */
    primary?: boolean
    /**
     * Pinned to the top of its scroll container until the next subheader
     * pushes it off (the subheaders page's scrolling rule). Default on.
     */
    sticky?: boolean
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'Md1Subheader' })

  defineSlots<{
    /** The section title. One line; longer text truncates with an ellipsis. */
    default?: () => any
  }>()

  const {
    inset = false,
    primary = false,
    sticky = true,
  } = defineProps<Md1SubheaderProps>()
</script>

<template>
  <Atom
    aria-level="2"
    as="div"
    class="md1-subheader"
    :data-inset="inset || undefined"
    :data-primary="primary || undefined"
    :data-sticky="sticky || undefined"
    role="heading"
  >
    <slot />
  </Atom>
</template>

<!-- Unscoped, like every Material Design 1 stylesheet (DESIGN_SYSTEMS.md ruling 3). -->
<style>
  /*
   * A 48 dp tile with the text at the 16 dp avatar keyline, in Body 2 (Roboto
   * Medium 14 sp) at the secondary ink. One line: the line box is the tile, so
   * the text sits centred and the overflow ends in an ellipsis. No fill of its
   * own (the subheaders page): it sits on the list or menu surface.
   */
  .md1-subheader {
    display: block;
    flex-shrink: 0;
    box-sizing: border-box;
    height: 48px;
    margin: 0;
    padding-block: 0;
    padding-inline: var(--md1-keyline-margin, 16px);
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-body-2-size, 14px);
    font-weight: var(--md1-type-body-2-weight, 500);
    line-height: 48px;
    letter-spacing: var(--md1-type-body-2-tracking, 0.01em);
    text-transform: var(--md1-type-body-2-transform, none);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* Inset: the text keyline, for a list whose avatar column holds a floating action button. */
  .md1-subheader[data-inset] {
    padding-inline-start: var(--md1-keyline-content, 72px);
  }

  /*
   * The coloured subheader takes the app's primary colour as text ink: the
   * 500 on light, a lighter tone of the primary on dark that holds 4.5:1
   * (`--md1-primary-ink`, colour page).
   */
  .md1-subheader[data-primary] {
    color: var(--md1-primary-ink, var(--md1-primary, #3F51B5));
  }

  /*
   * Pin and push: sticky inside the scroll container, above the positioned
   * tiles that follow it. The fill is inherited rather than painted so the
   * pinned tile matches whatever surface the list sits on, in either theme.
   */
  .md1-subheader[data-sticky] {
    position: sticky;
    inset-block-start: 0;
    z-index: 1;
    background-color: inherit;
  }

  /* From 600 px the keylines move to 24 and 80 dp (the keylines page's tablet column); restated so the rules hold without theme.css. */
  @media (min-width: 600px) {
    .md1-subheader {
      padding-inline: var(--md1-keyline-margin, 24px);
    }

    .md1-subheader[data-inset] {
      padding-inline-start: var(--md1-keyline-content, 80px);
    }
  }

  /* Mouse and keyboard: Body 2 drops to 13 sp (the typography page's desktop column); restated so the rule holds without theme.css. */
  @media (pointer: fine) {
    .md1-subheader {
      font-size: var(--md1-type-body-2-size, 13px);
    }
  }
</style>
