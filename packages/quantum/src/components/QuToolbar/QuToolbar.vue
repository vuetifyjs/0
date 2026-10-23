<script lang="ts">
  // Framework
  import { Atom, clamp, createContext, IN_BROWSER, isArray, isElement, isNull, isObject, useEventListener, useLogger, useResizeObserver } from '@vuetify/v0'

  // Utilities
  import { Fragment, shallowRef, toRef, useSlots, useTemplateRef, watch } from 'vue'

  // Types
  import type { Ref, VNode } from 'vue'

  /** The structure page's app bar colours: the theme's app-bar grey, the primary colour, or no fill. */
  export type QuToolbarVariant = 'surface' | 'primary' | 'transparent'

  /**
   * The scrolling-techniques page's behaviours for the app bar: fixed with the
   * content under it, hide with the content and return on reverse scroll,
   * waterfall (seamed until the content scrolls under it), or collapse the
   * flexible space down to the toolbar.
   */
  export type QuToolbarScroll = 'fixed' | 'hide' | 'waterfall' | 'collapse'

  /** What a tab bar in the extension does while the toolbar hides (scrolling-techniques page). */
  export type QuToolbarTabBar = 'anchored' | 'hide' | 'staggered'

  /** The edge a fixed toolbar clings to. */
  export type QuToolbarPosition = 'top' | 'bottom'

  /** What `QuToolbarExtension` registers so the root can scroll and size the flexible space. */
  export interface QuToolbarExtensionTicket {
    /** The extension's natural height in px, before any collapse. */
    height: Readonly<Ref<number>>
    /** `true` while the extension holds a `QuTabs` bar. */
    tabs: Readonly<Ref<boolean>>
    /** `true` while the extension draws an image. */
    image: Readonly<Ref<boolean>>
  }

  export interface QuToolbarContext {
    variant: Readonly<Ref<QuToolbarVariant>>
    dense: Readonly<Ref<boolean>>
    contextual: Readonly<Ref<boolean>>
    scroll: Readonly<Ref<QuToolbarScroll>>
    /** The flexible space collapse, 0 (expanded) to 1 (only the row remains). */
    progress: Readonly<Ref<number>>
    /** The row's rendered height in px. */
    row: Readonly<Ref<number>>
    /** The bar's border-box width in px, measured on the row, which never resizes with the extension. */
    width: Readonly<Ref<number>>
    /** `QuToolbarSearch` registers while it is open; the root swaps the row for it. Returns the release. */
    search: () => () => void
    /** `QuToolbarExtension` registers its measurements. Returns the release. */
    extension: (ticket: QuToolbarExtensionTicket) => () => void
  }

  export interface QuToolbarProps {
    /**
     * The app bar (layout/structure page): a `header` banner landmark fixed to
     * the top of the viewport, with the scroll behaviours enabled.
     */
    appBar?: boolean
    /** `surface` is the theme's app-bar grey; `primary` the primary colour with white ink; `transparent` has no fill and no shadow. Defaults to `primary` on an app bar and `surface` otherwise. */
    variant?: QuToolbarVariant
    /** The 128 dp app bar (96 dp with `dense`), title at the bottom. */
    prominent?: boolean
    /** The 48 dp desktop app bar for mouse and keyboard layouts. */
    dense?: boolean
    /** How the app bar responds to the content scrolling under it. */
    scroll?: QuToolbarScroll
    /** What a `QuTabs` bar in the extension does while the toolbar hides. */
    tabBar?: QuToolbarTabBar
    /** Selection mode: the row gives way to `QuToolbarContextual`. */
    contextual?: boolean
    /** A detached 2 dp toolbar with its own width: the floating toolbar and the toolbar palette. */
    floating?: boolean
    /** `bottom` fixes the toolbar to the bottom edge, above the on-screen keyboard. */
    position?: QuToolbarPosition
  }

  const [useQuToolbar, provideQuToolbar] = createContext<QuToolbarContext | null>('quantum:toolbar', null)

  export { useQuToolbar }

  /** Dev-time guard for the parts: an orphan renders, but the toolbar state it reads is inert. */
  export function orphan (part: string, context: QuToolbarContext | null): void {
    if (__DEV__ && isNull(context)) useLogger().warn(`[${part}] rendered outside <QuToolbar>; its state is inert`)
  }

  function flatten (nodes: VNode[]): VNode[] {
    return nodes.flatMap(node => node.type === Fragment && isArray(node.children) ? flatten(node.children as VNode[]) : [node])
  }

  /** The extension renders below the row; everything else is row content. */
  function extension (node: VNode): boolean {
    return isObject(node.type) && (node.type as { name?: string }).name === 'QuToolbarExtension'
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'QuToolbar' })

  defineSlots<{
    /** The parts: Nav, Title, Actions, Search, Contextual in the row, and the Extension below it. */
    default?: () => any
  }>()

  const {
    appBar = false,
    variant: _variant,
    prominent = false,
    dense = false,
    scroll = 'fixed',
    tabBar = 'anchored',
    contextual = false,
    floating = false,
    position = 'top',
  } = defineProps<QuToolbarProps>()

  const slots = useSlots()
  const logger = useLogger()

  // Lead decision 1: large areas take the primary colour, so the app bar is primary by default.
  const variant = toRef(() => _variant ?? (appBar ? 'primary' : 'surface'))

  const row = useTemplateRef<HTMLElement>('row')
  const height = shallowRef(0)
  const width = shallowRef(0)

  useResizeObserver(row, entries => {
    height.value = entries[0]?.borderBoxSize[0]?.blockSize ?? 0
    width.value = entries[0]?.borderBoxSize[0]?.inlineSize ?? 0
  }, { box: 'border-box', immediate: true })

  const ticket = shallowRef<QuToolbarExtensionTicket>()
  const searches = shallowRef(0)

  function search () {
    searches.value++

    return () => {
      searches.value--
    }
  }

  function register (value: QuToolbarExtensionTicket) {
    ticket.value = value

    return () => {
      if (ticket.value === value) ticket.value = undefined
    }
  }

  // Scroll behaviours: an app bar follows the content scrolling under it 1:1.
  // The spec gives no threshold and no parallax ratio, so nothing is delayed or scaled.
  const top = shallowRef(0)
  const offset = shallowRef(0)
  const hidden = shallowRef(false)

  // Last offset per scroller, so a second scroller starting at 0 is not read as a scroll up.
  const offsets = new WeakMap<EventTarget, number>()

  const natural = toRef(() => ticket.value?.height.value ?? 0)
  const tabs = toRef(() => ticket.value?.tabs.value ?? false)

  const progress = toRef(() => scroll === 'collapse' && natural.value > 0 ? clamp(top.value / natural.value, 0, 1) : 0)

  function follow (value: number, delta: number) {
    top.value = value

    if (scroll !== 'hide') {
      offset.value = 0
      hidden.value = false
      return
    }

    // An anchored tab bar stays: only the row scrolls off. Staggered returns
    // the tab bar on reverse scroll and the row only at the top of the page.
    const span = tabs.value && tabBar === 'anchored' ? height.value : height.value + natural.value
    const ceiling = Math.min(span, value)
    const floor = tabs.value && tabBar === 'staggered' ? Math.min(value, height.value) : 0

    offset.value = clamp(offset.value + delta, Math.min(floor, ceiling), ceiling)
    hidden.value = span > 0 && offset.value >= span
  }

  function onScroll (event: Event) {
    const target = event.target
    const el = row.value?.parentElement

    if (isNull(target) || !el) return

    // The content is a scroller sharing the bar's parent (the app shell's
    // content region), or the document while the bar is pinned to the
    // viewport. A fixed element has an offsetParent only when an ancestor (a
    // transform, `contain`) holds it, and then the document scrolling moves the
    // bar with its container. The bar's own scrollers (a tab bar, the
    // suggestion list) and scrollers elsewhere on the page are ignored.
    if (isElement(target)) {
      if (el.contains(target) || !el.parentElement?.contains(target)) return
    } else if (el.offsetParent) {
      return
    }

    const value = Math.max(isElement(target) ? target.scrollTop : (document.scrollingElement?.scrollTop ?? 0), 0)
    const last = offsets.get(target) ?? 0

    offsets.set(target, value)
    follow(value, value - last)
  }

  watch(() => scroll, () => follow(top.value, 0))

  // Scroll does not bubble, so the capture phase on the document sees every scroller.
  useEventListener(
    () => IN_BROWSER && appBar ? document : null,
    'scroll',
    onScroll,
    { capture: true, passive: true },
  )

  // Reveal on focus: a hidden bar must not keep focusable content off screen.
  function onFocusin () {
    if (offset.value === 0) return

    offset.value = 0
    hidden.value = false
  }

  const style = toRef(() => {
    if (offset.value === 0) return undefined

    return { transform: `translateY(${position === 'bottom' ? offset.value : -offset.value}px)` }
  })

  if (__DEV__) {
    watch(() => scroll === 'waterfall' && tabs.value && (ticket.value?.image.value ?? false), wrong => {
      if (wrong) logger.warn('[QuToolbar] a flexible space with overlapping content cannot include tabs (scrolling-techniques page); drop the QuTabs or the image')
    }, { immediate: true })
  }

  provideQuToolbar({
    variant,
    dense: toRef(() => dense),
    contextual: toRef(() => contextual),
    scroll: toRef(() => scroll),
    progress,
    row: height,
    width,
    search,
    extension: register,
  })

  function Row () {
    return flatten(slots.default?.() ?? []).filter(node => !extension(node))
  }

  function Extension () {
    return flatten(slots.default?.() ?? []).filter(node => extension(node))
  }
</script>

<template>
  <Atom
    :as="appBar ? 'header' : 'div'"
    class="quantum-toolbar"
    :data-app-bar="appBar || undefined"
    :data-collapsed="progress >= 1 || undefined"
    :data-contextual="contextual || undefined"
    :data-dense="dense || undefined"
    :data-floating="floating || undefined"
    :data-hidden="hidden || undefined"
    :data-image="ticket?.image.value || undefined"
    :data-position="position"
    :data-prominent="prominent || undefined"
    :data-scroll="scroll"
    :data-scrolled="(appBar && top > 0) || undefined"
    :data-search="searches > 0 || undefined"
    :data-variant="variant"
    :style
    @focusin="onFocusin"
  >
    <div ref="row" class="quantum-toolbar__row">
      <Row />
    </div>

    <Extension />
  </Atom>
</template>

<!-- Unscoped, like every Quantum stylesheet; the class prefix is the isolation. -->
<style>
  /*
   * A sheet a step above the content it affects: 4 dp (toolbars page), in the
   * theme's app-bar grey with primary ink (colour page theme figure).
   */
  .quantum-toolbar {
    position: relative;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    width: 100%;
    background: var(--quantum-app-bar, #F5F5F5);
    color: var(--quantum-text-primary, rgba(0, 0, 0, 0.87));
    box-shadow: var(--quantum-elevation-4, 0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12));
    font-family: var(--quantum-font-family, Roboto, Noto, sans-serif);
    transition:
      background-color var(--quantum-duration-standard, 300ms) var(--quantum-easing-standard, cubic-bezier(0.4, 0, 0.2, 1)),
      box-shadow 280ms var(--quantum-easing-standard, cubic-bezier(0.4, 0, 0.2, 1));
  }

  /* The app bar: fixed to the top of the viewport, content scrolling under it. */
  .quantum-toolbar[data-app-bar] {
    position: fixed;
    inset-block-start: 0;
    inset-inline: 0;
    z-index: 2;
  }

  /* The bottom toolbar clings to the bottom edge, or to the top of the on-screen keyboard. */
  .quantum-toolbar[data-position='bottom'] {
    position: fixed;
    inset-block: auto env(keyboard-inset-height, 0px);
    inset-inline: 0;
    z-index: 2;
  }

  /* Colored: the primary 500 with 100% white text and icons (colour page). */
  .quantum-toolbar[data-variant='primary'] {
    background: var(--quantum-primary, #3F51B5);
    color: var(--quantum-on-primary, #FFFFFF);
  }

  .quantum-toolbar[data-variant='transparent'] {
    background: transparent;
    box-shadow: none;
  }

  /* Floating toolbar and detached palette: its own width and a 2 dp sheet (SPEC.md decision; the page gives no metrics). */
  .quantum-toolbar[data-floating] {
    display: inline-flex;
    width: auto;
    max-width: 100%;
    border-radius: var(--quantum-radius, 2px);
    box-shadow: var(--quantum-elevation-2, 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12));
  }

  /* Waterfall: seamed with the content until it scrolls under the bar, then a step. */
  .quantum-toolbar[data-scroll='waterfall']:not([data-scrolled]) {
    box-shadow: var(--quantum-elevation-0, none);
  }

  /* A flexible-space image runs under the row; the bar clips it to its own edges. */
  .quantum-toolbar[data-image] {
    overflow: clip;
  }

  /* Desktop resting elevation is 2 dp below the listed values (elevation page). */
  @media (pointer: fine) {
    .quantum-toolbar {
      box-shadow: var(--quantum-elevation-2, 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12));
    }
  }

  /*
   * The row: 56 dp handset, 64 dp from 600 px, 48 dp in handset landscape and
   * dense. Icon buttons are 48 dp targets around 24 dp glyphs, so the padding is
   * the 16 / 24 dp keyline less the 12 dp the target adds around the glyph.
   */
  .quantum-toolbar__row {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    height: var(--quantum-increment, 56px);
    min-width: 0;
    padding-inline: calc(var(--quantum-keyline-margin, 16px) - 12px);
  }

  @media (min-width: 600px) {
    .quantum-toolbar__row {
      height: var(--quantum-increment, 64px);
      padding-inline: calc(var(--quantum-keyline-margin, 24px) - 12px);
    }
  }

  @media (max-width: 599px) and (orientation: landscape) {
    .quantum-toolbar__row {
      height: 48px;
    }
  }

  /* Dense: 48 dp with 40 dp icon targets (structure page, desktop dense app bar). */
  .quantum-toolbar[data-dense] .quantum-toolbar__row {
    height: 48px;
    padding-inline: calc(var(--quantum-keyline-margin, 16px) - 8px);
  }

  @media (min-width: 600px) {
    .quantum-toolbar[data-dense] .quantum-toolbar__row {
      padding-inline: calc(var(--quantum-keyline-margin, 24px) - 8px);
    }
  }

  /*
   * Prominent: 128 dp (96 dp dense). The icons keep the top strip of one
   * increment and the title sits at the bottom, 20 dp above the edge.
   */
  .quantum-toolbar[data-prominent] .quantum-toolbar__row {
    align-items: flex-start;
    height: 128px;
    padding-block-start: calc((var(--quantum-increment, 56px) - var(--quantum-touch-target, 48px)) / 2);
  }

  @media (min-width: 600px) {
    .quantum-toolbar[data-prominent] .quantum-toolbar__row {
      padding-block-start: calc((var(--quantum-increment, 64px) - var(--quantum-touch-target, 48px)) / 2);
    }
  }

  .quantum-toolbar[data-prominent][data-dense] .quantum-toolbar__row {
    height: 96px;
    padding-block-start: 4px;
  }

  /* Search and selection modes replace the row content. */
  .quantum-toolbar[data-search] .quantum-toolbar__row > :not(.quantum-toolbar__search),
  .quantum-toolbar[data-contextual] .quantum-toolbar__row > :not(.quantum-toolbar__contextual) {
    display: none;
  }

  /*
   * Icons: every icon in an app bar shares one colour, 54% black on a light
   * bar and 100% white on a coloured one (colour and icons pages). Text
   * actions take the bar's ink on a coloured bar.
   */
  .quantum-toolbar .quantum-toolbar__row .quantum-button[data-solo]:not([data-disabled]) {
    color: var(--quantum-icon-active, rgba(0, 0, 0, 0.54));
  }

  /* Inactive icons: 38% black on a light bar, 50% white on a dark one (colour page, app bar icons). */
  .quantum-toolbar .quantum-toolbar__row .quantum-button[data-solo][data-disabled] {
    color: var(--quantum-icon-inactive, rgba(0, 0, 0, 0.38));
  }

  /*
   * Over a flexible-space image the bar drops its own fill so the picture
   * shows through the row, and takes white ink like a coloured bar. These
   * rules sit after the variant rules they tie with, so the image wins.
   */
  .quantum-toolbar[data-image] {
    background: transparent;
    color: var(--quantum-on-primary, #FFFFFF);
  }

  .quantum-toolbar[data-variant='primary'] .quantum-toolbar__row .quantum-button:not([data-disabled]),
  .quantum-toolbar[data-image] .quantum-toolbar__row .quantum-button:not([data-disabled]) {
    color: var(--quantum-on-primary, #FFFFFF);
  }

  /* Inactive icons on a coloured bar: 50% white (icons page, dark backgrounds). */
  .quantum-toolbar[data-variant='primary'] .quantum-toolbar__row .quantum-button[data-disabled],
  .quantum-toolbar[data-image] .quantum-toolbar__row .quantum-button[data-disabled] {
    color: color-mix(in srgb, var(--quantum-on-primary, #FFFFFF) 50%, transparent);
  }

  .quantum-toolbar[data-dense] .quantum-toolbar__row .quantum-button[data-solo] {
    width: 40px;
    min-width: 40px;
    height: 40px;
  }
</style>
