<script lang="ts">
  // Framework
  import { Atom, Button, createContext, isNullOrUndefined, isString, useId, useImage, useLocale, useLogger } from '@vuetify/v0'

  // Context
  import { orphan, useMd1GridList } from './Md1GridList.vue'

  // Utilities
  import { onMounted, shallowRef, toRef, useAttrs, useTemplateRef } from 'vue'

  // Types
  import type { Ref, StyleValue } from 'vue'

  // Components
  import Md1Icon from '../Md1Icon/Md1Icon.vue'
  import Md1Ripple from '../Md1Ripple/Md1Ripple.vue'

  export interface Md1GridListTileContext {
    /** The id a bar gives its title, so the tile's primary action is named by the caption. */
    label: string
    /** Set by a bar while it renders a title. */
    named: Ref<boolean>
  }

  export interface Md1GridListTileProps {
    /** Cells the tile covers across. */
    span?: number
    /** Cells the tile covers down. */
    rowSpan?: number
    /** Makes the primary action a link: the whole tile navigates. */
    href?: string
    /** The selection pattern's selected state: a scrim and a check mark over the tile. */
    selected?: boolean
    /** The primary content, an image that fills the tile. The default slot holds the bar. */
    src?: string
    /** Alternative text for the image. Defaults to decorative; a bar title names the tile instead. */
    alt?: string
  }

  const [useMd1GridListTile, provideMd1GridListTile] = createContext<Md1GridListTileContext | null>('md1:grid-list:tile', null)

  export { useMd1GridListTile }
</script>

<script setup lang="ts">
  defineOptions({ name: 'Md1GridListTile', inheritAttrs: false })

  defineSlots<{
    /** The secondary content: an `Md1GridList.Bar`. */
    default?: () => any
  }>()

  const {
    span = 1,
    rowSpan = 1,
    href,
    selected = false,
    src,
    alt = '',
  } = defineProps<Md1GridListTileProps>()

  const attrs = useAttrs()
  const grid = useMd1GridList()
  const locale = useLocale()
  const logger = useLogger()

  orphan('Md1GridListTile', 'Md1GridList', grid)

  // Taken once at setup: the entrance plays on mount and never again, so a later render must not move the tile in the sequence.
  const index = grid?.stagger() ?? 0

  const label = useId()
  const check = useId()
  const named = shallowRef(false)

  provideMd1GridListTile({ label, named })

  const link = toRef(() => isString(href))
  // The primary action exists only when it does something: a link, or a listener the consumer bound.
  const interactive = toRef(() => link.value || !isNullOrUndefined(attrs.onClick))

  // The click reaches the action element; everything else lands on the tile.
  const rest = toRef(() => {
    const { onClick, ...others } = attrs

    return others
  })

  // Bound as an object so an array of listeners (two @click bindings) reaches the action intact.
  // The selected state is described on the action: Button.Root reserves aria-pressed for its group mode.
  const action = toRef(() => ({
    'onClick': attrs.onClick,
    'aria-labelledby': named.value ? label : undefined,
    'aria-describedby': selected ? check : undefined,
  }))

  const image = useImage({ src: () => src })
  const img = useTemplateRef<HTMLImageElement>('img')

  onMounted(() => {
    // An image that finished before hydration bound `load` never fires it again; the recipe would otherwise leave it faded out.
    const el = img.value

    if (el?.complete && el.naturalWidth > 0) image.onLoad()

    if (__DEV__ && interactive.value && !named.value && alt === '') {
      logger.warn('[Md1GridListTile] the primary action has no accessible name: give the image alt text or add an Md1GridList.Bar with a title')
    }
  })

  const style = toRef((): StyleValue => ({
    '--md1-grid-list-span': span > 1 ? span : undefined,
    '--md1-grid-list-row-span': rowSpan > 1 ? rowSpan : undefined,
    '--md1-grid-list-index': index > 0 ? index : undefined,
  }))
</script>

<template>
  <li
    v-bind="rest"
    class="md1-grid-list__tile"
    :data-selected="selected || undefined"
    :style
  >
    <Atom
      v-if="link"
      v-bind="action"
      as="a"
      class="md1-grid-list__action"
      :href
    >
      <Md1Ripple />

      <img
        v-if="src"
        ref="img"
        :alt
        class="md1-grid-list__image"
        :data-state="image.status.value"
        :src="image.source.value"
        @error="image.onError"
        @load="image.onLoad"
      >
    </Atom>

    <Button.Root
      v-else-if="interactive"
      v-bind="action"
      class="md1-grid-list__action"
    >
      <Md1Ripple />

      <img
        v-if="src"
        ref="img"
        :alt
        class="md1-grid-list__image"
        :data-state="image.status.value"
        :src="image.source.value"
        @error="image.onError"
        @load="image.onLoad"
      >
    </Button.Root>

    <img
      v-else-if="src"
      ref="img"
      :alt
      class="md1-grid-list__image"
      :data-state="image.status.value"
      :src="image.source.value"
      @error="image.onError"
      @load="image.onLoad"
    >

    <slot />

    <span v-if="selected" class="md1-grid-list__scrim">
      <Md1Icon :id="check" :label="locale.ti('Md1.selected') ?? 'Selected'" name="check-circle" />
    </span>
  </li>
</template>

<!-- Unscoped: Button.Root is multi-root; a scoped data-v never lands on the rendered action. -->
<style>
  /*
   * A cell's tile: square corners (every figure), the ratio keyline of its grid
   * multiplied by its spans, and a 12% ink wash where an image is missing or
   * still loading (the page requires a default image and names no colour).
   * Explicit stretch lets the tiles of one row share the row's height, so a
   * wider tile's fractionally taller ratio never leaves a seam beside it.
   */
  .md1-grid-list__tile {
    position: relative;
    grid-column: span var(--md1-grid-list-span, 1);
    grid-row: span var(--md1-grid-list-row-span, 1);
    align-self: stretch;
    box-sizing: border-box;
    min-width: 0;
    aspect-ratio: calc(var(--md1-grid-list-ratio, 1) * var(--md1-grid-list-span, 1) / var(--md1-grid-list-row-span, 1));
    overflow: hidden;
    margin: 0;
    padding: 0;
    background: var(--md1-divider, rgba(0, 0, 0, 0.12));
    color: var(--md1-text-primary, rgba(0, 0, 0, 0.87));
    animation: md1-grid-list-enter var(--md1-duration-enter, 225ms) var(--md1-easing-decelerate, cubic-bezier(0, 0, 0.2, 1)) both;
    animation-delay: calc(var(--md1-grid-list-index, 0) * var(--md1-stagger, 20ms));
  }

  /* The choreography page: grids populate left to right then top to bottom, each tile no more than 20 ms after the last. */
  @keyframes md1-grid-list-enter {
    from {
      opacity: 0;
      transform: translateY(var(--md1-spacing-1, 8px));
    }

    to {
      opacity: 1;
      transform: none;
    }
  }

  body[data-reduced-motion='reduce'] .md1-grid-list__tile {
    animation: none;
  }

  @media (prefers-reduced-motion: reduce) {
    body:not([data-reduced-motion='no-preference']) .md1-grid-list__tile {
      animation: none;
    }
  }

  /* The primary action fills the entire tile and is never represented by an icon or text (grid-lists page). */
  .md1-grid-list__action {
    position: absolute;
    inset: 0;
    display: block;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    border: 0;
    border-radius: 0;
    background: transparent;
    color: inherit;
    text-decoration: none;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    isolation: isolate;
  }

  /*
   * The image is positioned and follows the ripple, so it would paint over the
   * ink. The ink is raised inside the action's own stacking context, which
   * keeps it under the bar and the selection scrim that follow the action.
   */
  .md1-grid-list__action > .md1-ripple {
    z-index: 1;
  }

  /* Hover is 6% ink (lead decision 3, the page states none); focus is the 12% overlay of the buttons page, keyboard only. */
  .md1-grid-list__action::after {
    content: '';
    position: absolute;
    inset: 0;
    background-color: transparent;
    transition: background-color var(--md1-duration-standard, 300ms) var(--md1-easing-standard, cubic-bezier(0.4, 0, 0.2, 1));
  }

  .md1-grid-list__action:hover::after {
    background-color: var(--md1-hover, rgba(0, 0, 0, 0.06));
  }

  .md1-grid-list__action:focus-visible {
    outline: 2px solid transparent;
  }

  .md1-grid-list__action:focus-visible::after {
    background-color: var(--md1-focus, rgba(0, 0, 0, 0.12));
  }

  /*
   * The loading-images recipe: the image fades in from 0% opacity and 20%
   * saturation over a duration longer than a transition, the complex one.
   * Exposure is not shipped; CSS has no gamma filter.
   */
  .md1-grid-list__image {
    position: absolute;
    inset: 0;
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0;
    filter: saturate(0.2);
    transition:
      opacity var(--md1-duration-complex, 375ms) var(--md1-easing-decelerate, cubic-bezier(0, 0, 0.2, 1)),
      filter var(--md1-duration-complex, 375ms) var(--md1-easing-decelerate, cubic-bezier(0, 0, 0.2, 1));
  }

  .md1-grid-list__image[data-state='loaded'] {
    opacity: 1;
    filter: saturate(1);
  }

  /*
   * The selection pattern: a scrim and a check mark over the selected item.
   * The scrim is the selection token (the accent at 30%); the check sits in a
   * 48 dp box flush with the start corner, the same geometry as a bar icon.
   */
  .md1-grid-list__scrim {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    background: var(--md1-selection, rgba(255, 64, 129, 0.3));
    color: var(--md1-white, #FFFFFF);
    pointer-events: none;
  }

  .md1-grid-list__scrim > .md1-icon {
    margin: 12px;
  }
</style>
