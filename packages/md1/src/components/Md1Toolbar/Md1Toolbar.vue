<script lang="ts">
  // Framework
  import { Atom, clamp, createContext, IN_BROWSER, isArray, isElement, isNull, isObject, useEventListener, useLogger, useResizeObserver } from '@vuetify/v0'

  // Utilities
  import { Fragment, shallowRef, toRef, useSlots, useTemplateRef, watch } from 'vue'

  // Types
  import type { Ref, VNode } from 'vue'

  /** The structure page's app bar colours: the theme's app-bar grey, the primary colour, or no fill. */
  export type Md1ToolbarVariant = 'surface' | 'primary' | 'transparent'

  /**
   * The scrolling-techniques page's behaviours for the app bar: fixed with the
   * content under it, hide with the content and return on reverse scroll,
   * waterfall (seamed until the content scrolls under it), collapse the
   * flexible space down to the toolbar, or scroll the whole extended bar off
   * and return only the toolbar on reverse scroll, the flexible space growing
   * back at the top (the flexible space's second option).
   */
  export type Md1ToolbarScroll = 'fixed' | 'hide' | 'waterfall' | 'collapse' | 'collapse-hide'

  /** What a tab bar in the extension does while the toolbar hides (scrolling-techniques page). */
  export type Md1ToolbarTabBar = 'anchored' | 'hide' | 'staggered'

  /** The edge a fixed toolbar clings to. */
  export type Md1ToolbarPosition = 'top' | 'bottom'

  /** What `Md1ToolbarExtension` registers so the root can scroll and size the flexible space. */
  export interface Md1ToolbarExtensionTicket {
    /** The extension's natural height in px, before any collapse. */
    height: Readonly<Ref<number>>
    /** `true` while the extension holds an `Md1Tabs` bar. */
    tabs: Readonly<Ref<boolean>>
    /** `true` while the extension draws an image. */
    image: Readonly<Ref<boolean>>
  }

  export interface Md1ToolbarContext {
    variant: Readonly<Ref<Md1ToolbarVariant>>
    dense: Readonly<Ref<boolean>>
    contextual: Readonly<Ref<boolean>>
    scroll: Readonly<Ref<Md1ToolbarScroll>>
    /** `true` when the flexible space collapses with the scroll: `collapse` and `collapse-hide`. */
    collapsing: Readonly<Ref<boolean>>
    /** The flexible space collapse, 0 (expanded) to 1 (only the row remains). */
    progress: Readonly<Ref<number>>
    /** The row's rendered height in px. */
    row: Readonly<Ref<number>>
    /** The bar's border-box width in px, measured on the row, which never resizes with the extension. */
    width: Readonly<Ref<number>>
    /** `Md1ToolbarSearch` registers while it is open; the root swaps the row for it. Returns the release. */
    search: () => () => void
    /** `Md1ToolbarExtension` registers its measurements. Returns the release. */
    extension: (ticket: Md1ToolbarExtensionTicket) => () => void
  }

  export interface Md1ToolbarProps {
    /**
     * The app bar (layout/structure page): a `header` banner landmark fixed to
     * the top of the viewport, with the scroll behaviours enabled.
     */
    appBar?: boolean
    /** `surface` is the theme's app-bar grey; `primary` the primary colour with white ink; `transparent` has no fill and no shadow. Defaults to `primary` on an app bar and `surface` otherwise. */
    variant?: Md1ToolbarVariant
    /** The 128 dp app bar (96 dp with `dense`), title at the bottom. */
    prominent?: boolean
    /** The 48 dp desktop app bar for mouse and keyboard layouts. */
    dense?: boolean
    /** How the app bar responds to the content scrolling under it. */
    scroll?: Md1ToolbarScroll
    /** What an `Md1Tabs` bar in the extension does while the toolbar hides. */
    tabBar?: Md1ToolbarTabBar
    /** Selection mode: the row gives way to `Md1ToolbarContextual`. */
    contextual?: boolean
    /** A detached toolbar with its own width, 16 px clear of its surroundings: the floating toolbar and the toolbar palette. */
    floating?: boolean
    /** `bottom` fixes the toolbar to the bottom edge, above the on-screen keyboard. */
    position?: Md1ToolbarPosition
  }

  const [useMd1Toolbar, provideMd1Toolbar] = createContext<Md1ToolbarContext | null>('md1:toolbar', null)

  export { useMd1Toolbar }

  /** Dev-time guard for the parts: an orphan renders, but the toolbar state it reads is inert. */
  export function orphan (part: string, context: Md1ToolbarContext | null): void {
    if (__DEV__ && isNull(context)) useLogger().warn(`[${part}] rendered outside <Md1Toolbar>; its state is inert`)
  }

  function flatten (nodes: VNode[]): VNode[] {
    return nodes.flatMap(node => node.type === Fragment && isArray(node.children) ? flatten(node.children as VNode[]) : [node])
  }

  /** The extension renders below the row; everything else is row content. */
  function extension (node: VNode): boolean {
    return isObject(node.type) && (node.type as { name?: string }).name === 'Md1ToolbarExtension'
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'Md1Toolbar' })

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
  } = defineProps<Md1ToolbarProps>()

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

  const ticket = shallowRef<Md1ToolbarExtensionTicket>()
  const searches = shallowRef(0)

  function search () {
    searches.value++

    return () => {
      searches.value--
    }
  }

  function register (value: Md1ToolbarExtensionTicket) {
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

  // `collapse-hide` only: the whole bar has scrolled off once, so it returns
  // as the toolbar alone until the content is back at the top.
  const folded = shallowRef(false)

  const collapsing = toRef(() => scroll === 'collapse' || scroll === 'collapse-hide')

  const progress = toRef(() => {
    if (!collapsing.value || natural.value <= 0) return 0
    if (scroll === 'collapse-hide' && !folded.value) return 0

    return clamp(top.value / natural.value, 0, 1)
  })

  function follow (value: number, delta: number) {
    top.value = value

    // The flexible space's second option: the whole extended bar scrolls off
    // 1:1; reverse scroll brings back only the toolbar, anchored to the top;
    // the flexible space and the title grow into place as the content
    // returns to the top, where the bar unfolds.
    if (scroll === 'collapse-hide') {
      if (value <= 0) folded.value = false

      const span = folded.value ? height.value : height.value + natural.value

      offset.value = clamp(offset.value + delta, 0, Math.min(span, value))

      // Off screen: fold to the toolbar, still off screen, for its return.
      if (!folded.value && natural.value > 0 && offset.value >= span) {
        folded.value = true
        offset.value = height.value
      }

      hidden.value = height.value > 0 && offset.value >= (folded.value ? height.value : span)
      return
    }

    folded.value = false

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
    // Hidden only once the whole bar is off screen: an anchored tab bar still shows.
    hidden.value = span > 0 && offset.value >= height.value + natural.value
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

    // A sideways scroll (a carousel or a wide table in the content) leaves
    // scrollTop where it was; read as a position it would snap the bar back.
    if (value === last) return

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
      if (wrong) logger.warn('[Md1Toolbar] a flexible space with overlapping content cannot include tabs (scrolling-techniques page); drop the Md1Tabs or the image')
    }, { immediate: true })
  }

  provideMd1Toolbar({
    variant,
    dense: toRef(() => dense),
    contextual: toRef(() => contextual),
    scroll: toRef(() => scroll),
    collapsing,
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
    class="md1-toolbar"
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
    <div ref="row" class="md1-toolbar__row">
      <Row />
    </div>

    <Extension />
  </Atom>
</template>

<!-- Unscoped, like every Material Design 1 stylesheet; the class prefix is the isolation. -->
<style>
  /*
   * A sheet a step above the content it affects: 4 dp (toolbars page), in the
   * theme's app-bar grey with primary ink (colour page theme figure).
   */
  .md1-toolbar {
    position: relative;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    width: 100%;
    background: var(--md1-app-bar, #F5F5F5);
    color: var(--md1-text-primary, rgba(0, 0, 0, 0.87));
    box-shadow: var(--md1-elevation-4, 0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12));
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    transition:
      background-color var(--md1-duration-standard, 300ms) var(--md1-easing-standard, cubic-bezier(0.4, 0, 0.2, 1)),
      box-shadow 280ms var(--md1-easing-standard, cubic-bezier(0.4, 0, 0.2, 1));
  }

  /*
   * Hidden: the shadow goes with the bar, so no penumbra is left along the edge
   * it scrolled past (the 4 dp shadow reaches past the bar's own box).
   */
  .md1-toolbar[data-hidden] {
    box-shadow: none;
  }

  /* The app bar: fixed to the top of the viewport, content scrolling under it. */
  .md1-toolbar[data-app-bar] {
    position: fixed;
    inset-block-start: 0;
    inset-inline: 0;
    z-index: 2;
  }

  /* The bottom toolbar clings to the bottom edge, or to the top of the on-screen keyboard. */
  .md1-toolbar[data-position='bottom'] {
    position: fixed;
    inset-block: auto env(keyboard-inset-height, 0px);
    inset-inline: 0;
    z-index: 2;
  }

  /* Colored: the primary 500 with 100% white text and icons (colour page). */
  .md1-toolbar[data-variant='primary'] {
    background: var(--md1-primary, #3F51B5);
    color: var(--md1-on-primary, #FFFFFF);
  }

  .md1-toolbar[data-variant='transparent'] {
    background: transparent;
    box-shadow: none;
  }

  /*
   * Floating toolbar and detached palette: its own width, the page gives no
   * metrics, so it is Vuetify 1.5's floating toolbar (_toolbar.styl:34,
   * 153-156): the toolbar's own elevation, square corners and 16 px clear of
   * its surroundings.
   */
  .md1-toolbar[data-floating] {
    display: inline-flex;
    width: auto;
    max-width: calc(100% - 2 * var(--md1-spacing-2, 16px));
    margin: var(--md1-spacing-2, 16px);
  }

  /* Waterfall: seamed with the content until it scrolls under the bar, then a step. */
  .md1-toolbar[data-scroll='waterfall']:not([data-scrolled]) {
    box-shadow: var(--md1-elevation-0, none);
  }

  /* A flexible-space image runs under the row; the bar clips it to its own edges. */
  .md1-toolbar[data-image] {
    overflow: clip;
  }

  /* Desktop resting elevation is 2 dp below the listed values (elevation page). */
  @media (pointer: fine) {
    .md1-toolbar {
      box-shadow: var(--md1-elevation-2, 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12));
    }
  }

  /*
   * The row: 56 dp handset, 64 dp from 600 px, 48 dp in handset landscape and
   * dense. Icon buttons are 48 dp targets around 24 dp glyphs, so the padding is
   * the 16 / 24 dp keyline less the 12 dp the target adds around the glyph.
   */
  .md1-toolbar__row {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    height: var(--md1-increment, 56px);
    min-width: 0;
    padding-inline: calc(var(--md1-keyline-margin, 16px) - 12px);
  }

  @media (min-width: 600px) {
    .md1-toolbar__row {
      height: var(--md1-increment, 64px);
      padding-inline: calc(var(--md1-keyline-margin, 24px) - 12px);
    }
  }

  @media (max-width: 599px) and (orientation: landscape) {
    .md1-toolbar__row {
      height: 48px;
    }
  }

  /* Dense: 48 dp with 40 dp icon targets (structure page, desktop dense app bar). */
  .md1-toolbar[data-dense] .md1-toolbar__row {
    height: 48px;
    padding-inline: calc(var(--md1-keyline-margin, 16px) - 8px);
  }

  @media (min-width: 600px) {
    .md1-toolbar[data-dense] .md1-toolbar__row {
      padding-inline: calc(var(--md1-keyline-margin, 24px) - 8px);
    }
  }

  /*
   * Prominent: 128 dp (96 dp dense). The icons keep the top strip of one
   * increment and the title sits at the bottom, 20 dp above the edge.
   */
  .md1-toolbar[data-prominent] .md1-toolbar__row {
    align-items: flex-start;
    height: 128px;
    padding-block-start: calc((var(--md1-increment, 56px) - var(--md1-touch-target, 48px)) / 2);
  }

  @media (min-width: 600px) {
    .md1-toolbar[data-prominent] .md1-toolbar__row {
      padding-block-start: calc((var(--md1-increment, 64px) - var(--md1-touch-target, 48px)) / 2);
    }
  }

  .md1-toolbar[data-prominent][data-dense] .md1-toolbar__row {
    height: 96px;
    padding-block-start: 4px;
  }

  /* Search and selection modes replace the row content. */
  .md1-toolbar[data-search] .md1-toolbar__row > :not(.md1-toolbar__search),
  .md1-toolbar[data-contextual] .md1-toolbar__row > :not(.md1-toolbar__contextual) {
    display: none;
  }

  /*
   * Icons: every icon in an app bar shares one colour, 54% black on a light
   * bar and 100% white on a coloured one (colour and icons pages). Text
   * actions take the bar's ink on a coloured bar.
   *
   * The inks reach only the bar's own actions: buttons placed straight in the
   * row, in Actions, Search or Contextual, or wrapped in a feature-discovery
   * target there (at zero weight, so the target's disc ink wins). A component
   * nested in the row (a search bar, a dropdown button) sits on its own sheet
   * and keeps its own icon ink.
   */
  .md1-toolbar :is(.md1-toolbar__row, .md1-toolbar__actions, .md1-toolbar__search, .md1-toolbar__contextual) > .md1-button[data-solo]:not([data-disabled]),
  .md1-toolbar :is(.md1-toolbar__row, .md1-toolbar__actions) > :where(.md1-feature-discovery__action) > :where(.md1-feature-discovery__pulse) > .md1-button[data-solo]:not([data-disabled]) {
    color: var(--md1-icon-active, rgba(0, 0, 0, 0.54));
  }

  /* Inactive icons: 38% black on a light bar, 50% white on a dark one (colour page, app bar icons). */
  .md1-toolbar :is(.md1-toolbar__row, .md1-toolbar__actions, .md1-toolbar__search, .md1-toolbar__contextual) > .md1-button[data-solo][data-disabled],
  .md1-toolbar :is(.md1-toolbar__row, .md1-toolbar__actions) > :where(.md1-feature-discovery__action) > :where(.md1-feature-discovery__pulse) > .md1-button[data-solo][data-disabled] {
    color: var(--md1-icon-inactive, rgba(0, 0, 0, 0.38));
  }

  /*
   * Over a flexible-space image the bar drops its own fill so the picture
   * shows through the row, and takes white ink like a coloured bar. These
   * rules sit after the variant rules they tie with, so the image wins.
   */
  .md1-toolbar[data-image] {
    background: transparent;
    color: var(--md1-on-primary, #FFFFFF);
  }

  :is(.md1-toolbar[data-variant='primary'], .md1-toolbar[data-image]) :is(.md1-toolbar__row, .md1-toolbar__actions, .md1-toolbar__search, .md1-toolbar__contextual) > .md1-button:not([data-disabled]),
  :is(.md1-toolbar[data-variant='primary'], .md1-toolbar[data-image]) :is(.md1-toolbar__row, .md1-toolbar__actions) > :where(.md1-feature-discovery__action) > :where(.md1-feature-discovery__pulse) > .md1-button:not([data-disabled]) {
    color: var(--md1-on-primary, #FFFFFF);
  }

  /* Inactive icons on a coloured bar: 50% white (icons page, dark backgrounds). */
  :is(.md1-toolbar[data-variant='primary'], .md1-toolbar[data-image]) :is(.md1-toolbar__row, .md1-toolbar__actions, .md1-toolbar__search, .md1-toolbar__contextual) > .md1-button[data-disabled],
  :is(.md1-toolbar[data-variant='primary'], .md1-toolbar[data-image]) :is(.md1-toolbar__row, .md1-toolbar__actions) > :where(.md1-feature-discovery__action) > :where(.md1-feature-discovery__pulse) > .md1-button[data-disabled] {
    color: color-mix(in srgb, var(--md1-on-primary, #FFFFFF) 50%, transparent);
  }

  .md1-toolbar[data-dense] :is(.md1-toolbar__row, .md1-toolbar__actions, .md1-toolbar__search, .md1-toolbar__contextual) > .md1-button[data-solo],
  .md1-toolbar[data-dense] :is(.md1-toolbar__row, .md1-toolbar__actions) > :where(.md1-feature-discovery__action) > :where(.md1-feature-discovery__pulse) > .md1-button[data-solo] {
    width: 40px;
    min-width: 40px;
    height: 40px;
  }
</style>
