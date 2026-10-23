<script lang="ts">
  // Framework
  import { Atom, Dialog, getActiveElement, isArray, useId, useLocale, useLogger } from '@vuetify/v0'

  // Context
  import Md1NavigationDrawerActivator from './Md1NavigationDrawerActivator.vue'

  import { provideMd1NavigationDrawer } from './context'

  // Utilities
  import { Fragment, nextTick, shallowRef, toRef, useAttrs, useTemplateRef, watch } from 'vue'

  // Types
  import type { Md1NavigationDrawerSide, Md1NavigationDrawerType } from './context'
  import type { SetupContext, VNode } from 'vue'

  /**
   * Material Design 1 withholds every v0 dialog prop: the temporary drawer is always the
   * native `<dialog>`, its scrim is `::backdrop`, and the outside click, Escape
   * and choosing a destination are its dismissal paths.
   */
  export interface Md1NavigationDrawerProps {
    /** The drawer element's id; generated when unset. */
    id?: string
    /**
     * `temporary` opens above all content at 16 dp over the scrim; `persistent`
     * toggles beside the content at its elevation; `permanent` is always open.
     */
    type?: Md1NavigationDrawerType
    /**
     * The mini variant of the persistent drawer: at rest only the icon column
     * shows, one standard increment wide; opening expands it to the full drawer.
     */
    mini?: boolean
    /** Starts under the app bar (one increment down) instead of spanning the full height. */
    clipped?: boolean
    /** The permanent drawer detached from the screen edge, inside a card. */
    floating?: boolean
    /** `start` is the left nav; `end` is the right nav. Both mirror under `dir="rtl"`. */
    side?: Md1NavigationDrawerSide
    /** Accessible name of the drawer. Defaults to the locale's "Navigation". */
    ariaLabel?: string
  }

  export interface Md1NavigationDrawerSlotProps {
    /** Whether the drawer is open. Always `true` for a permanent drawer. */
    isOpen: boolean
    /** Open the drawer. */
    open: () => void
    /** Close the drawer. A permanent drawer ignores it. */
    close: () => void
    /** Open a closed drawer, close an open one. */
    toggle: () => void
  }

  interface SliceProps {
    part: 'activator' | 'sheet'
  }

  function flatten (nodes: VNode[]): VNode[] {
    return nodes.flatMap(node => node.type === Fragment && isArray(node.children)
      ? flatten(node.children as VNode[])
      : [node])
  }

  /**
   * The root's one slot holds the trigger and the drawer's content together.
   * The trigger has to render outside the `<dialog>` (a closed dialog hides
   * its children) and the rest inside it, so each half renders its share of
   * the same slot: `Activator` children on one side, everything else on the other.
   */
  function Slice (props: SliceProps, { slots }: SetupContext): VNode[] {
    const activator = props.part === 'activator'

    return flatten(slots.default?.() ?? []).filter(node => (node.type === Md1NavigationDrawerActivator) === activator)
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'Md1NavigationDrawer', inheritAttrs: false })

  defineSlots<{
    /** The activator, the header and the content. */
    default?: (props: Md1NavigationDrawerSlotProps) => any
  }>()

  defineEmits<{
    'update:model-value': [value: boolean]
  }>()

  const {
    id: _id,
    type = 'temporary',
    mini = false,
    clipped = false,
    floating = false,
    side = 'start',
    ariaLabel,
  } = defineProps<Md1NavigationDrawerProps>()

  const model = defineModel<boolean>({ default: false })

  const attrs = useAttrs()
  const locale = useLocale()
  const logger = useLogger()

  const uid = useId()
  const id = toRef(() => _id ?? uid)

  const temporary = toRef(() => type === 'temporary')
  const permanent = toRef(() => type === 'permanent')

  // A permanent drawer cannot be closed (pattern page), whatever the model says.
  const isOpen = toRef(() => permanent.value || model.value)

  // A persistent drawer at rest without the mini rail is off the screen: its
  // destinations must leave the tab order and the accessibility tree with it.
  const hidden = toRef(() => type === 'persistent' && !mini && !model.value)

  const label = toRef(() => ariaLabel ?? locale.ti('Md1.navigation') ?? 'Navigation')

  if (__DEV__) {
    watch(() => mini && type !== 'persistent', wrong => {
      if (wrong) logger.warn('[Md1NavigationDrawer] `mini` is the persistent drawer\'s rest state (pattern page); it has no effect on a temporary or permanent drawer')
    }, { immediate: true })

    watch(() => floating && type !== 'permanent', wrong => {
      if (wrong) logger.warn('[Md1NavigationDrawer] `floating` is a permanent drawer form (pattern page); a temporary or persistent drawer is not detached into a card')
    }, { immediate: true })

    watch(() => clipped && temporary.value, wrong => {
      if (wrong) logger.warn('[Md1NavigationDrawer] a temporary drawer opens above all content, the app bar included; `clipped` has no effect on it')
    }, { immediate: true })
  }

  const nav = useTemplateRef<{ element: HTMLElement | null }>('nav')

  // Where focus was when a persistent drawer opened, usually its menu icon.
  const origin = shallowRef<HTMLElement | null>(null)

  // A persistent drawer is no <dialog>, so nothing hands focus back when it
  // closes. Closing it with focus inside would drop focus to the document as
  // the drawer goes inert; focus returns to where it was when it opened instead.
  function restore () {
    const el = nav.value?.element
    const active = getActiveElement()
    const target = origin.value

    origin.value = null

    if (!el || !active || !el.contains(active) || !target?.isConnected) return

    nextTick(() => target.focus())
  }

  watch(model, value => {
    if (type !== 'persistent') return

    if (value) {
      const active = getActiveElement()

      if (active instanceof HTMLElement) origin.value = active

      return
    }

    restore()
  })

  function open () {
    model.value = true
  }

  function close () {
    if (permanent.value) return

    model.value = false
  }

  function toggle () {
    if (isOpen.value) close()
    else open()
  }

  provideMd1NavigationDrawer({
    id,
    type: toRef(() => type),
    isOpen,
    open,
    close,
    toggle,
  })

  const hooks = toRef(() => ({
    'data-clipped': clipped || undefined,
    'data-floating': floating || undefined,
    'data-mini': mini || undefined,
    'data-open': isOpen.value || undefined,
    'data-side': side,
    'data-type': type,
  }))

  const slotProps = toRef((): Md1NavigationDrawerSlotProps => ({
    isOpen: isOpen.value,
    open,
    close,
    toggle,
  }))
</script>

<template>
  <Dialog.Root v-if="temporary" :id v-model="model">
    <Slice part="activator">
      <slot v-bind="slotProps" />
    </Slice>

    <!-- scrim is false on every Dialog.Content Material Design 1 renders: the backdrop is ::backdrop (#910). -->
    <Dialog.Content
      v-bind="{ ...attrs, ...hooks }"
      :aria-label="label"
      class="md1-navigation-drawer"
      :scrim="false"
    >
      <nav class="md1-navigation-drawer__sheet">
        <Slice part="sheet">
          <slot v-bind="slotProps" />
        </Slice>
      </nav>
    </Dialog.Content>
  </Dialog.Root>

  <template v-else>
    <Slice part="activator">
      <slot v-bind="slotProps" />
    </Slice>

    <Atom
      :id
      ref="nav"
      v-bind="{ ...attrs, ...hooks }"
      :aria-label="label"
      as="nav"
      class="md1-navigation-drawer"
      :inert="hidden || undefined"
    >
      <div class="md1-navigation-drawer__sheet">
        <Slice part="sheet">
          <slot v-bind="slotProps" />
        </Slice>
      </div>
    </Atom>
  </template>
</template>

<!--
  Unscoped: Dialog.Content and Atom render the root, and this one sheet also
  styles the parts (EmCard's model), which render no stylesheet of their own.
-->
<style>
  /*
   * Every drawer: the surface colour and primary ink, Roboto, and the width
   * rule of the pattern page: the screen width minus the app bar height, at
   * most five standard increments. Under 600 px that is min(100vw - 56, 280);
   * from 600 px min(100vw - 64, 320). The drawer's own keylines hold at every
   * width: icons on 16 dp, text on 72 dp (pattern page), so the list tokens
   * are rescoped inside it.
   */
  .md1-navigation-drawer {
    --md1-keyline-margin: var(--md1-spacing-2, 16px);
    --md1-keyline-content: 72px;

    box-sizing: content-box;
    width: min(calc(100vw - var(--md1-increment, 56px)), calc(5 * var(--md1-increment, 56px)));
    margin: 0;
    padding: 0;
    border: 0;
    background: var(--md1-surface, #FFFFFF);
    color: var(--md1-text-primary, rgba(0, 0, 0, 0.87));
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
  }

  /* The sheet scrolls as a view (pattern page); it keeps the open width so nothing reflows while the drawer changes width. */
  .md1-navigation-drawer__sheet {
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    width: min(calc(100vw - var(--md1-increment, 56px)), calc(5 * var(--md1-increment, 56px)));
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    overscroll-behavior: contain;
    background-color: inherit;
  }

  @media (min-width: 600px) {
    .md1-navigation-drawer,
    .md1-navigation-drawer__sheet {
      width: min(calc(100vw - var(--md1-increment, 64px)), calc(5 * var(--md1-increment, 64px)));
    }
  }

  /*
   * Temporary: the native <dialog> against the start edge, the full height of
   * the screen, 16 dp above everything (pattern page). `display` is left to
   * the UA so a closed dialog stays hidden. Leave: 195 ms on the acceleration
   * curve back past the edge.
   */
  .md1-navigation-drawer[data-type='temporary'] {
    position: fixed;
    inset-block: 0;
    inset-inline: 0 auto;
    height: 100%;
    max-width: none;
    max-height: none;
    overflow: visible;
    box-shadow: var(--md1-elevation-16, 0px 8px 10px -5px rgba(0, 0, 0, 0.2), 0px 16px 24px 2px rgba(0, 0, 0, 0.14), 0px 6px 30px 5px rgba(0, 0, 0, 0.12));
    transition:
      transform var(--md1-duration-leave, 195ms) var(--md1-easing-accelerate, cubic-bezier(0.4, 0, 1, 1)),
      overlay var(--md1-duration-leave, 195ms) allow-discrete,
      display var(--md1-duration-leave, 195ms) allow-discrete;
  }

  .md1-navigation-drawer[data-type='temporary'][data-side='end'] {
    inset-inline: auto 0;
  }

  /* Closed, the sheet waits past its edge; the start edge is the right one under dir="rtl". */
  .md1-navigation-drawer[data-type='temporary']:not([open]) {
    transform: translateX(-100%);
  }

  .md1-navigation-drawer[data-type='temporary'][data-side='end']:not([open]),
  .md1-navigation-drawer[data-type='temporary']:not([open]):dir(rtl) {
    transform: translateX(100%);
  }

  .md1-navigation-drawer[data-type='temporary'][data-side='end']:not([open]):dir(rtl) {
    transform: translateX(-100%);
  }

  /* Enter: slides in from the edge, 225 ms on the deceleration curve (motion page). */
  .md1-navigation-drawer[data-type='temporary'][open] {
    transition-duration: var(--md1-duration-enter, 225ms);
    transition-timing-function: var(--md1-easing-decelerate, cubic-bezier(0, 0, 0.2, 1));
  }

  @starting-style {
    .md1-navigation-drawer[data-type='temporary'][open] {
      transform: translateX(-100%);
    }

    .md1-navigation-drawer[data-type='temporary'][data-side='end'][open],
    .md1-navigation-drawer[data-type='temporary'][open]:dir(rtl) {
      transform: translateX(100%);
    }

    .md1-navigation-drawer[data-type='temporary'][data-side='end'][open]:dir(rtl) {
      transform: translateX(-100%);
    }
  }

  /* Native backdrop in the scrim colour, everything behind it darkened but visible: Material Design 1 never mounts v0's Scrim (#910). */
  .md1-navigation-drawer::backdrop {
    background: var(--md1-scrim, rgba(33, 33, 33, 0.46));
    opacity: 0;
    transition:
      opacity var(--md1-duration-leave, 195ms) var(--md1-easing-accelerate, cubic-bezier(0.4, 0, 1, 1)),
      overlay var(--md1-duration-leave, 195ms) allow-discrete,
      display var(--md1-duration-leave, 195ms) allow-discrete;
  }

  .md1-navigation-drawer[open]::backdrop {
    opacity: 1;
    transition-duration: var(--md1-duration-enter, 225ms);
    transition-timing-function: var(--md1-easing-decelerate, cubic-bezier(0, 0, 0.2, 1));
  }

  @starting-style {
    .md1-navigation-drawer[open]::backdrop {
      opacity: 0;
    }
  }

  /* Mouse and keyboard: every resting elevation drops 2 dp (elevation page), so the temporary drawer rests at 14 dp. */
  @media (pointer: fine) {
    .md1-navigation-drawer[data-type='temporary'] {
      box-shadow: var(--md1-elevation-14, 0px 7px 9px -4px rgba(0, 0, 0, 0.2), 0px 14px 21px 2px rgba(0, 0, 0, 0.14), 0px 5px 26px 4px rgba(0, 0, 0, 0.12));
    }
  }

  /*
   * Persistent and permanent: part of the layout, beside the content in a
   * flex row, at the content's own elevation, so no shadow. It stretches to
   * the row and stays in view, capped at the screen height. The seam to the
   * content is a 1 dp divider (a Material Design 1 decision: the page states the
   * elevation, not the edge). Width changes push the content: 300 ms on the
   * standard curve, the motion page's relative movement.
   */
  .md1-navigation-drawer:not([data-type='temporary']) {
    position: sticky;
    inset-block-start: 0;
    flex: none;
    max-height: 100dvh;
    overflow: hidden;
    border-inline-end: 1px solid var(--md1-divider, rgba(0, 0, 0, 0.12));
    box-shadow: var(--md1-elevation-0, none);
    transition:
      width var(--md1-duration-standard, 300ms) var(--md1-easing-standard, cubic-bezier(0.4, 0, 0.2, 1)),
      visibility 0s;
  }

  .md1-navigation-drawer:not([data-type='temporary'])[data-side='end'] {
    border-inline-end: 0;
    border-inline-start: 1px solid var(--md1-divider, rgba(0, 0, 0, 0.12));
  }

  /* Persistent, closed: no width and no seam, hidden once the width has gone. */
  .md1-navigation-drawer[data-type='persistent']:not([data-open]):not([data-mini]) {
    width: 0;
    border-width: 0;
    visibility: hidden;
    transition:
      width var(--md1-duration-standard, 300ms) var(--md1-easing-standard, cubic-bezier(0.4, 0, 0.2, 1)),
      visibility 0s linear var(--md1-duration-standard, 300ms);
  }

  /*
   * Mini at rest: one standard increment, 56 dp (64 dp from 600 px), the
   * 24 dp icon column between its 16 dp margins (a Material Design 1 decision; the page
   * gives no width). Text past the column is clipped, not reflowed; the
   * subheaders and the account area fade out; the scrollbar stays hidden.
   */
  .md1-navigation-drawer[data-type='persistent'][data-mini]:not([data-open]) {
    width: var(--md1-increment, 56px);
  }

  @media (min-width: 600px) {
    .md1-navigation-drawer[data-type='persistent'][data-mini]:not([data-open]) {
      width: var(--md1-increment, 64px);
    }
  }

  .md1-navigation-drawer[data-mini]:not([data-open]) .md1-navigation-drawer__sheet {
    scrollbar-width: none;
  }

  .md1-navigation-drawer[data-mini] .md1-navigation-drawer__header > *,
  .md1-navigation-drawer[data-mini] .md1-subheader {
    transition: opacity var(--md1-duration-standard, 300ms) var(--md1-easing-standard, cubic-bezier(0.4, 0, 0.2, 1));
  }

  .md1-navigation-drawer[data-mini]:not([data-open]) .md1-navigation-drawer__header > *,
  .md1-navigation-drawer[data-mini]:not([data-open]) .md1-subheader {
    opacity: 0;
  }

  /* Clipped: starts under the app bar, one increment down (56 dp, 64 dp from 600 px; scrolling techniques page). */
  .md1-navigation-drawer[data-clipped]:not([data-type='temporary']) {
    inset-block-start: var(--md1-increment, 56px);
    max-height: calc(100dvh - var(--md1-increment, 56px));
  }

  @media (min-width: 600px) {
    .md1-navigation-drawer[data-clipped]:not([data-type='temporary']) {
      inset-block-start: var(--md1-increment, 64px);
      max-height: calc(100dvh - var(--md1-increment, 64px));
    }
  }

  /*
   * Floating: the permanent drawer detached from the edge inside a card, so
   * it takes the card's sheet: 2 dp corners and the 2 dp resting elevation
   * (0 dp under a fine pointer), 8 dp clear of its surroundings (a Material Design 1
   * decision; the figure gives no gap), and no seam.
   */
  .md1-navigation-drawer[data-floating]:not([data-type='temporary']) {
    margin: var(--md1-spacing-1, 8px);
    inset-block-start: var(--md1-spacing-1, 8px);
    max-height: calc(100dvh - 2 * var(--md1-spacing-1, 8px));
    border: 0;
    border-radius: var(--md1-radius, 2px);
    box-shadow: var(--md1-elevation-2, 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12));
  }

  @media (pointer: fine) {
    .md1-navigation-drawer[data-floating]:not([data-type='temporary']) {
      box-shadow: var(--md1-elevation-0, none);
    }
  }

  /*
   * Header, the account area: a 16:9 block of the drawer's width (the ratio
   * keyline), the primary colour by default or an image, the 64 dp avatar on
   * the 16 dp keyline, and the 56 dp account row at the bottom (pattern page).
   */
  .md1-navigation-drawer__header {
    position: relative;
    display: flex;
    flex: none;
    flex-direction: column;
    justify-content: space-between;
    box-sizing: border-box;
    aspect-ratio: 16 / 9;
    padding: var(--md1-spacing-2, 16px) var(--md1-spacing-2, 16px) 0;
    overflow: hidden;
    isolation: isolate;
    background: var(--md1-primary, #3F51B5);
    color: var(--md1-on-primary, #FFFFFF);
  }

  /* The background image covers the block; the avatar and the account row paint above it. */
  .md1-navigation-drawer__image {
    position: absolute;
    inset: 0;
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  /*
   * Text protection (imagery page): the white name and email sit on an
   * arbitrary photograph, so an image header lays a dark scrim under the
   * account row only, 40% at the bottom edge fading out over 168 dp (three
   * app bar heights) with its centre three tenths of the way toward the dark
   * end. The primary fill needs none: white on the primary is the spec's pair.
   */
  .md1-navigation-drawer__header[data-image]::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, color-mix(in srgb, var(--md1-black, #000000) 40%, transparent), 50px, transparent 168px);
    pointer-events: none;
  }

  .md1-navigation-drawer__avatar {
    position: relative;
    z-index: 1;
    display: block;
    width: 64px;
    height: 64px;
    border-radius: 50%;
    object-fit: cover;
  }

  .md1-navigation-drawer__account {
    position: relative;
    z-index: 1;
    display: flex;
    flex: none;
    align-items: center;
    gap: var(--md1-spacing-2, 16px);
    height: 56px;
    margin-block-start: auto;
  }

  .md1-navigation-drawer__identity {
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    min-width: 0;
  }

  /* Name: Roboto Medium 14 sp, white. Email: Roboto Regular 14 sp, white (pattern page). */
  .md1-navigation-drawer__name,
  .md1-navigation-drawer__email {
    overflow: hidden;
    font-size: var(--md1-type-body-2-size, 14px);
    line-height: var(--md1-type-body-1-leading, 20px);
    letter-spacing: var(--md1-type-body-2-tracking, 0.01em);
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .md1-navigation-drawer__name {
    font-weight: var(--md1-type-body-2-weight, 500);
  }

  .md1-navigation-drawer__email {
    font-size: var(--md1-type-body-1-size, 14px);
    font-weight: var(--md1-type-body-1-weight, 400);
  }

  /*
   * Content: the drawer's lists, subheaders and dividers. Destinations are
   * Roboto Medium 14 sp at 87%, icons at 54% on 16 dp, text on 72 dp; the
   * lists' own 8 dp above and below each grouping are the space around a
   * full-bleed divider (pattern page).
   */
  .md1-navigation-drawer__content {
    flex: 1 0 auto;
    background-color: inherit;
  }

  .md1-navigation-drawer__content .md1-list__body,
  .md1-navigation-drawer__content .md1-list__primary {
    font-size: var(--md1-type-body-2-size, 14px);
    font-weight: var(--md1-type-body-2-weight, 500);
    letter-spacing: var(--md1-type-body-2-tracking, 0.01em);
  }

  /*
   * The current destination's text takes the primary colour with its icon
   * (pattern page), also when the label is bare text in the item's body;
   * Md1List colours only the Primary part. The dark sheet takes the primary's
   * 100, as Md1List does for the icon.
   */
  .md1-navigation-drawer__content .md1-list[data-select='none'] .md1-list__item[data-selected] .md1-list__body {
    color: var(--md1-primary, #3F51B5);
  }

  [data-theme='md1-dark'] .md1-navigation-drawer__content .md1-list[data-select='none'] .md1-list__item[data-selected] .md1-list__body {
    color: var(--md1-primary-light, #C5CAE9);
  }

  /* Mouse and keyboard: Body 2 drops to 13 sp (typography page); restated so the rule holds without theme.css. */
  @media (pointer: fine) {
    .md1-navigation-drawer__name,
    .md1-navigation-drawer__content .md1-list__body,
    .md1-navigation-drawer__content .md1-list__primary {
      font-size: var(--md1-type-body-2-size, 13px);
    }

    .md1-navigation-drawer__email {
      font-size: var(--md1-type-body-1-size, 13px);
    }
  }

  /* Reduced motion: the drawer appears, leaves and changes width at once. The plugin's body attribute wins over the OS query. */
  body[data-reduced-motion='reduce'] .md1-navigation-drawer,
  body[data-reduced-motion='reduce'] .md1-navigation-drawer::backdrop,
  body[data-reduced-motion='reduce'] .md1-navigation-drawer__header > *,
  body[data-reduced-motion='reduce'] .md1-navigation-drawer .md1-subheader {
    transition: none;
  }

  @media (prefers-reduced-motion: reduce) {
    body:not([data-reduced-motion='no-preference']) .md1-navigation-drawer,
    body:not([data-reduced-motion='no-preference']) .md1-navigation-drawer::backdrop,
    body:not([data-reduced-motion='no-preference']) .md1-navigation-drawer__header > *,
    body:not([data-reduced-motion='no-preference']) .md1-navigation-drawer .md1-subheader {
      transition: none;
    }
  }
</style>
