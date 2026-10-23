<script lang="ts">
  // Framework
  import { Button, useLogger } from '@vuetify/v0'

  // Context
  import { orphan } from './QuGridList.vue'
  import { useQuGridListTile } from './QuGridListTile.vue'

  // Utilities
  import { onBeforeUnmount, toRef, watch } from 'vue'

  // Types
  import type { QuIconName } from '../../icons'

  // Components
  import QuIcon from '../QuIcon/QuIcon.vue'
  import QuRipple from '../QuRipple/QuRipple.vue'

  /** Header bars sit at the top of the tile, footer bars at the bottom. */
  export type QuGridListBarPosition = 'header' | 'footer'

  /** The side of the bar the action icon is flush with. */
  export type QuGridListBarSide = 'start' | 'end'

  export interface QuGridListBarProps {
    /** Where the bar sits on the tile. */
    position?: QuGridListBarPosition
    /** The first line, Subheading 16 sp; also the accessible name of the tile's primary action. */
    title?: string
    /** The second line, Caption 12 sp; it turns the 48 dp bar into the 68 dp two-line bar. */
    subtitle?: string
    /** A glyph role drawn through `QuIcon` as the secondary action, a 48 dp button flush with the tile edge. */
    icon?: QuIconName
    /** Which edge the icon is flush with. */
    iconSide?: QuGridListBarSide
    /** Accessible name of the icon action. Required with `icon`: the glyph is hidden from assistive technology. */
    iconLabel?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'QuGridListBar' })

  defineSlots<{
    /** Extra content under the text, inside the bar's text column. */
    default?: () => any
  }>()

  const {
    position = 'footer',
    title,
    subtitle,
    icon,
    iconSide = 'end',
    iconLabel,
  } = defineProps<QuGridListBarProps>()

  const emit = defineEmits<{
    /** The secondary action: the icon was activated by pointer or keyboard. */
    action: [event: MouseEvent]
  }>()

  const tile = useQuGridListTile()
  const logger = useLogger()

  orphan('QuGridListBar', 'QuGridListTile', tile)

  if (__DEV__) {
    watch(() => Boolean(icon) && !iconLabel, wrong => {
      if (wrong) logger.warn('[QuGridListBar] the icon action has no accessible name: the glyph is aria-hidden, so pass iconLabel')
    }, { immediate: true })
  }

  // An empty string renders no line, so it neither grows the bar nor names the tile.
  const lines = toRef(() => (subtitle ? 2 : 1))

  // The title names the tile's primary action (aria-labelledby) for as long as the bar renders one.
  watch(() => Boolean(title), named => {
    if (tile) tile.named.value = named
  }, { immediate: true })

  onBeforeUnmount(() => {
    if (tile) tile.named.value = false
  })

  function onAction (event: MouseEvent) {
    emit('action', event)
  }
</script>

<template>
  <div
    class="quantum-grid-list__bar"
    :data-icon="icon ? iconSide : undefined"
    :data-lines="lines"
    :data-position="position"
  >
    <div class="quantum-grid-list__text">
      <span v-if="title" :id="tile?.label" class="quantum-grid-list__title">{{ title }}</span>

      <span v-if="subtitle" class="quantum-grid-list__subtitle">{{ subtitle }}</span>

      <slot />
    </div>

    <Button.Root
      v-if="icon"
      :aria-label="iconLabel"
      class="quantum-grid-list__icon"
      @click="onAction"
    >
      <QuRipple />

      <Button.Icon class="quantum-grid-list__glyph">
        <QuIcon :name="icon" />
      </Button.Icon>
    </Button.Root>
  </div>
</template>

<!-- Unscoped: Button.Root is multi-root; a scoped data-v never lands on the <button>. -->
<style>
  /*
   * A translucent dark band over the image carrying the text and the action
   * icon: 48 dp for one line, 68 dp for two (grid-lists page). The band's own
   * value is not in the spec; --quantum-grid-list-bar is Quantum's 60% black,
   * the upper bound of the imagery page's scrim range, with white ink. Pointer
   * events pass through to the tile's primary action beneath; only the icon
   * takes them back.
   */
  .quantum-grid-list__bar {
    position: absolute;
    inset-inline: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    height: 48px;
    background: var(--quantum-grid-list-bar, rgba(0, 0, 0, 0.6));
    color: var(--quantum-white, #FFFFFF);
    font-family: var(--quantum-font-family, Roboto, Noto, sans-serif);
    pointer-events: none;
  }

  .quantum-grid-list__bar[data-position='header'] {
    top: 0;
    bottom: auto;
  }

  .quantum-grid-list__bar[data-lines='2'] {
    height: 68px;
  }

  /* 16 dp text padding (page); 12 dp above and below the 24 dp line fills the 48 dp bar, 16 dp fills the 68 dp one. */
  .quantum-grid-list__text {
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    box-sizing: border-box;
    min-width: 0;
    padding: 12px var(--quantum-spacing-2, 16px);
  }

  .quantum-grid-list__bar[data-lines='2'] .quantum-grid-list__text {
    padding-block: var(--quantum-spacing-2, 16px);
  }

  /* 16 dp between the text and the glyph (figure specs22): the 48 dp container holds the glyph 12 dp from its edge. */
  .quantum-grid-list__bar[data-icon='end'] .quantum-grid-list__text {
    padding-inline-end: 4px;
  }

  /* Icon on the start side: the text begins at the 48 dp container's edge (figures specs17 and specs19). */
  .quantum-grid-list__bar[data-icon='start'] .quantum-grid-list__text {
    padding-inline-start: 0;
  }

  /* Single-line text is Subheading 16 sp; two-line text is 16 sp over Caption 12 sp. Text that does not fit is cut with an ellipsis. */
  .quantum-grid-list__title,
  .quantum-grid-list__subtitle {
    display: block;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .quantum-grid-list__title {
    font-size: var(--quantum-type-subheading-size, 16px);
    font-weight: var(--quantum-type-subheading-weight, 400);
    line-height: var(--quantum-type-subheading-leading, 24px);
    letter-spacing: var(--quantum-type-subheading-tracking, 0.01em);
  }

  /* Secondary light text on a dark background is 70% white (colour page). */
  .quantum-grid-list__subtitle {
    font-size: var(--quantum-type-caption-size, 12px);
    font-weight: var(--quantum-type-caption-weight, 400);
    line-height: var(--quantum-type-caption-leading, 1);
    letter-spacing: var(--quantum-type-caption-tracking, 0.02em);
    color: color-mix(in srgb, var(--quantum-white, #FFFFFF) 70%, transparent);
  }

  /* The action icon: a 24 dp glyph in a 48 dp target drawn flush with the tile edge (figures), the icon at 100% white. */
  .quantum-grid-list__icon {
    position: relative;
    display: inline-flex;
    flex: none;
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
    color: inherit;
    cursor: pointer;
    pointer-events: auto;
    -webkit-tap-highlight-color: transparent;
  }

  .quantum-grid-list__bar[data-icon='start'] .quantum-grid-list__icon {
    order: -1;
  }

  /* Keyboard focus takes the 12% overlay of its own ink (buttons page); the ring stays for forced colours. */
  .quantum-grid-list__icon:focus-visible {
    outline: 2px solid transparent;
    background-color: color-mix(in srgb, currentcolor 12%, transparent);
  }

  /* Positioned so the glyph paints above the ink layer. */
  .quantum-grid-list__glyph {
    position: relative;
    display: inline-flex;
  }
</style>
