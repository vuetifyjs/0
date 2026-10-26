<script lang="ts">
  // Framework
  import { Button, isUndefined, Tabs, toElement, useElementSize, useEventListener, useLocale, useLogger, useRaf, useResizeObserver, useTabsRoot } from '@vuetify/v0'

  // Context
  import { useMd1Tabs } from './Md1Tabs.vue'

  // Utilities
  import { nextTick, onMounted, shallowRef, toRef, useTemplateRef, watch } from 'vue'

  // Types
  import type { ID, TabsListProps } from '@vuetify/v0'

  // Components
  import Md1Icon from '../Md1Icon/Md1Icon.vue'
  import Md1Menu from '../Md1Menu/Md1Menu.vue'
  import Md1MenuActivator from '../Md1Menu/Md1MenuActivator.vue'
  import Md1MenuContent from '../Md1Menu/Md1MenuContent.vue'
  import Md1MenuItem from '../Md1Menu/Md1MenuItem.vue'
  import Md1Ripple from '../Md1Ripple/Md1Ripple.vue'

  export interface Md1TabsListProps extends Pick<TabsListProps, 'label' | 'namespace'> {}

  /** The tabs page's maximum tab width, padding included. */
  const MAX = 264

  /** Fixed tabs' minimum width in larger views (from 600 px), where the centring rule applies. */
  const MIN = 160

  /** "If the margin between the tab edge and view edge is 16dp or less, use full-width tabs instead of centered tabs." */
  const MARGIN = 16
</script>

<script setup lang="ts">
  defineOptions({ name: 'Md1TabsList' })

  defineSlots<{
    /** The `Md1Tabs.Item`s, in reading order. */
    default?: () => any
  }>()

  const { label, namespace: _namespace } = defineProps<Md1TabsListProps>()

  const context = useMd1Tabs()
  const logger = useLogger()
  const locale = useLocale()

  if (__DEV__ && !context) logger.warn('[Md1TabsList] rendered outside <Md1Tabs>; its overflow arrows and centring are inert')

  const namespace = _namespace ?? context?.namespace.value

  const tabs = useTabsRoot(namespace ?? 'v0:tabs')

  const bar = useTemplateRef<HTMLElement>('bar')
  const list = useTemplateRef<HTMLElement>('list')

  /*
   * Fixed tabs measure against the bar, which the arrows do not narrow: shown,
   * the arrows shrink the tablist and squeeze every fixed tab to its minimum,
   * so measured against the tablist the tabs would keep overflowing it and the
   * arrows would never hide again. Scrollable tabs keep their own widths, so
   * the tablist, the part that actually scrolls, is their container.
   */
  context?.attach(() => context.scrollable.value ? list.value : bar.value)

  const { width } = useElementSize(bar)

  const previous = toRef(() => locale.ti('Md1.previousTabs') ?? 'Previous tabs')
  const next = toRef(() => locale.ti('Md1.nextTabs') ?? 'Next tabs')

  /*
   * Fixed tabs centre in larger views when the bar has room for every tab at
   * the widest one's width (clamped to the 160 to 264 dp range) with more than
   * 16 dp to spare on each side. The 600 px gate is the stylesheet's.
   */
  const centered = toRef(() => {
    if (!context || context.scrollable.value) return false

    const tickets = context.items.values()

    if (tickets.length === 0) return false

    let widest = MIN

    for (const ticket of tickets) widest = Math.max(widest, ticket.value.natural)

    return (width.value - tickets.length * Math.min(widest, MAX)) / 2 > MARGIN
  })

  const overflowing = toRef(() => context?.overflow.isOverflowing.value ?? false)

  /*
   * The desktop "More" dropdown: the tabs past the bar's capacity, listed in an
   * Md1Menu behind a "More" control at the bar's end. A collected tab that is
   * selected names the control and moves the indicator under it (decision: the
   * page names the pattern, "Tabs with Books selected from a More dropdown
   * menu", and draws no metrics).
   */
  const collapsed = toRef(() => context?.collapsed.value ?? false)
  const arrows = toRef(() => overflowing.value && !collapsed.value)
  const more = useTemplateRef<HTMLElement>('more')

  const rest = toRef(() => {
    if (!context || !collapsed.value) return []

    return context.items.values().filter(ticket => context.hidden(ticket.id))
  })

  const chosen = toRef(() => rest.value.find(ticket => ticket.id === tabs.selectedId.value))
  const caption = toRef(() => chosen.value?.value.label || (locale.ti('Md1.more') ?? 'More'))

  /*
   * Every caption the control can show: "More" and each tab's label. They
   * share the label's one grid cell, unseen, so the control is always as wide
   * as its widest caption. Naming a collected tab then never resizes it, which
   * would resize the tablist beside it and recount which tabs fit.
   */
  const captions = toRef(() => {
    if (!context || !collapsed.value) return []

    const labels = new Set([locale.ti('Md1.more') ?? 'More'])

    for (const ticket of context.items.values()) {
      if (ticket.value.label) labels.add(ticket.value.label)
    }

    return [...labels]
  })

  /*
   * The room the More control may take: the bar less the tablist's start
   * padding and the first tab, which always stays in the bar. A narrow bar
   * then truncates the control's caption rather than clipping that tab. Read
   * from the bar and the first tab only, so a selection never changes it.
   */
  const spare = shallowRef(0)

  function fit () {
    const el = list.value
    const first = el?.querySelector<HTMLElement>('.md1-tabs__item')

    if (!collapsed.value || !el || !first) {
      spare.value = 0
      return
    }

    const pad = Number.parseFloat(getComputedStyle(el).paddingInlineStart) || 0

    spare.value = Math.max(0, width.value - pad - first.offsetWidth)
  }

  const current = toRef(() => tabs.selectedId.value)

  function onMore (id: unknown) {
    if (!isUndefined(id)) tabs.select(id as ID)
  }

  // Scroll position, for disabling the arrow that has nowhere left to go.
  const start = shallowRef(true)
  const end = shallowRef(true)

  function edges () {
    const el = list.value

    if (!el) return

    // RTL scroll offsets run negative from zero; the magnitude is the distance from the start edge.
    const offset = Math.abs(el.scrollLeft)

    start.value = offset <= 1
    end.value = offset + el.clientWidth >= el.scrollWidth - 1
  }

  function rtl (): boolean {
    return !!list.value && getComputedStyle(list.value).direction === 'rtl'
  }

  /** Pages the bar by its own visible width toward the start (-1) or the end (1) of the reading order. */
  function onPage (step: 1 | -1) {
    const el = list.value

    if (!el) return

    el.scrollBy({ left: step * (rtl() ? -1 : 1) * el.clientWidth })
  }

  function onPrevious () {
    onPage(-1)
  }

  function onNext () {
    onPage(1)
  }

  // The indicator: a 2 dp line under the selected tab, positioned in the list's scroll coordinates.
  const left = shallowRef(0)
  const size = shallowRef(0)
  const animate = shallowRef(false)

  // The first placement jumps; only later moves slide.
  const arm = useRaf(() => {
    animate.value = true
  })

  function selected (): HTMLElement | undefined {
    return toElement(tabs.selectedItem.value?.el) as HTMLElement | undefined
  }

  function place () {
    const el = selected()

    if (!el || !list.value) {
      size.value = 0
      return
    }

    left.value = el.offsetLeft
    size.value = el.offsetWidth

    if (!animate.value) arm()
  }

  /** Brings the selected tab fully into the visible part of the bar, horizontally only. */
  function reveal () {
    const el = selected()
    const box = list.value

    if (!el || !box) return

    const tab = el.getBoundingClientRect()
    const view = box.getBoundingClientRect()

    if (tab.left < view.left) box.scrollBy({ left: tab.left - view.left })
    else if (tab.right > view.right) box.scrollBy({ left: tab.right - view.right })
  }

  function refresh () {
    place()
    edges()
    fit()
  }

  watch(() => tabs.selectedId.value, (_, old) => {
    // The arrow keys can walk onto a collected tab, which has no box to focus: the More control takes focus for it.
    if (chosen.value && list.value?.contains(document.activeElement)) more.value?.focus()

    refresh()
    // The initial selection is not the user's: scrolling then could fight a restored scroll position.
    if (!isUndefined(old)) reveal()
  }, { flush: 'post' })

  // Tab widths change with labels, fonts and the 600 px breakpoint; the overflow total tracks all of them.
  watch(() => [context?.overflow.total.value, overflowing.value, centered.value, collapsed.value, width.value], () => {
    nextTick(refresh)
  }, { flush: 'post' })

  useResizeObserver(list, refresh)
  useResizeObserver(selected, place)
  useEventListener(list, 'scroll', edges, { passive: true })

  onMounted(refresh)
</script>

<template>
  <div
    ref="bar"
    class="md1-tabs__bar"
    :data-centered="centered || undefined"
    :data-overflow="overflowing || undefined"
    :style="width ? { '--md1-tabs-view': `${width}px`, '--md1-tabs-spare': spare ? `${spare}px` : undefined } : undefined"
  >
    <Button.Root
      v-if="arrows"
      v-slot="{ attrs }"
      :aria-label="previous"
      :disabled="start"
      renderless
    >
      <button
        v-bind="attrs"
        class="md1-tabs__arrow"
        data-direction="previous"
        tabindex="-1"
        @click="onPrevious"
      >
        <Md1Ripple />

        <Md1Icon name="chevron-left" />
      </button>
    </Button.Root>

    <Tabs.List v-slot="{ attrs }" :label :namespace renderless>
      <div
        ref="list"
        v-bind="attrs"
        class="md1-tabs__list"
        :style="collapsed ? { '--md1-tabs-total': `${context?.overflow.total.value ?? 0}px` } : undefined"
      >
        <slot />

        <span
          aria-hidden="true"
          class="md1-tabs__indicator"
          :data-animate="animate || undefined"
          :style="{ width: `${size}px`, transform: `translateX(${left}px)` }"
        />
      </div>
    </Tabs.List>

    <Button.Root
      v-if="arrows"
      v-slot="{ attrs }"
      :aria-label="next"
      :disabled="end"
      renderless
    >
      <button
        v-bind="attrs"
        class="md1-tabs__arrow"
        data-direction="next"
        tabindex="-1"
        @click="onNext"
      >
        <Md1Ripple />

        <Md1Icon name="chevron-right" />
      </button>
    </Button.Root>

    <Md1Menu v-if="collapsed" desktop :selected="current" @update:selected="onMore">
      <Md1MenuActivator v-slot="{ attrs }">
        <button
          ref="more"
          v-bind="attrs"
          class="md1-tabs__item md1-tabs__more"
          :data-selected="chosen ? true : undefined"
        >
          <Md1Ripple />

          <span class="md1-tabs__label md1-tabs__caption">
            <span
              v-for="text in captions"
              :key="text"
              aria-hidden="true"
              class="md1-tabs__reserve"
              :data-text="text"
            />

            <span class="md1-tabs__caption-text">{{ caption }}</span>
          </span>

          <Md1Icon class="md1-tabs__cue" name="arrow-drop-down" />
        </button>
      </Md1MenuActivator>

      <Md1MenuContent>
        <Md1MenuItem
          v-for="ticket in rest"
          :key="ticket.id"
          :disabled="ticket.value.disabled"
          :value="ticket.id"
        >
          {{ ticket.value.label }}
        </Md1MenuItem>
      </Md1MenuContent>
    </Md1Menu>
  </div>
</template>

<!-- Unscoped: the list and its items are rendered through v0's renderless parts. -->
<style>
  .md1-tabs__bar {
    display: flex;
    align-items: stretch;
    min-width: 0;
    grid-row: 1;
  }

  /*
   * The tablist is the scroller: a touch swipes it natively, the desktop pages
   * it with the arrows, and the indicator scrolls with the tabs it underlines.
   */
  .md1-tabs__list {
    position: relative;
    display: flex;
    flex: 1 1 auto;
    min-width: 0;
    overflow-x: auto;
    overflow-y: hidden;
    overscroll-behavior-x: contain;
    scroll-behavior: smooth;
    scrollbar-width: none;
  }

  .md1-tabs__list::-webkit-scrollbar {
    display: none;
  }

  /*
   * Collapsed into a More menu, the tablist asks for every tab's width, the
   * collected ones included, and the bar shrinks it to the room there is. Sized
   * by its visible tabs alone, a bar in a shrink-to-fit parent would stay as
   * narrow as its last collapse, so widening it would never bring a tab back.
   */
  .md1-tabs[data-more] .md1-tabs__list {
    box-sizing: content-box;
    width: var(--md1-tabs-total, auto);
  }

  /*
   * Fixed tabs have equal widths. Full width, every tab takes an equal share of
   * the bar and never less than 72 dp (160 dp from 600 px); a share that falls
   * under the minimum scrolls.
   */
  .md1-tabs[data-fixed] .md1-tabs__list {
    display: grid;
    grid-auto-columns: minmax(72px, 1fr);
    grid-auto-flow: column;
  }

  /*
   * Scrollable tabs: the left-most tab's content sits on the screen-edge
   * keyline (16 dp, 24 dp from 600 px), so the list pads by the keyline less
   * the tab's own 12 dp side padding.
   */
  .md1-tabs[data-scrollable] .md1-tabs__list {
    padding-inline-start: calc(var(--md1-keyline-margin, 16px) - 12px);
  }

  @media (min-width: 600px) {
    .md1-tabs[data-fixed] .md1-tabs__list {
      grid-auto-columns: minmax(160px, 1fr);
    }

    /*
     * Centred: the list shrinks to its max-content width, where equal flexible
     * columns all take the widest tab's width (the page's "based on the widest
     * tab label"), and sits in the middle of the bar.
     */
    .md1-tabs__bar[data-centered] .md1-tabs__list {
      flex: 0 1 auto;
      width: max-content;
      margin-inline: auto;
    }

    .md1-tabs[data-scrollable] .md1-tabs__list {
      padding-inline-start: calc(var(--md1-keyline-margin, 24px) - 12px);
    }
  }

  /* Desktop: the first tab's text starts on the 80 dp content keyline, past 24 dp of tab padding. */
  @media (pointer: fine) {
    .md1-tabs[data-scrollable] .md1-tabs__list {
      padding-inline-start: calc(var(--md1-keyline-content, 72px) - 24px);
    }
  }

  @media (pointer: fine) and (min-width: 600px) {
    .md1-tabs[data-scrollable] .md1-tabs__list {
      padding-inline-start: calc(var(--md1-keyline-content, 80px) - 24px);
    }
  }

  /*
   * The 2 dp indicator in the accent (white on a primary bar). It moves on the
   * standard curve; the page states no duration, so it takes the standard one,
   * which the desktop scale shortens.
   */
  .md1-tabs__indicator {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 2px;
    background: var(--md1-accent, #FF4081);
    pointer-events: none;
  }

  .md1-tabs__indicator[data-animate] {
    transition:
      transform var(--md1-duration-standard, 300ms) var(--md1-easing-standard, cubic-bezier(0.4, 0, 0.2, 1)),
      width var(--md1-duration-standard, 300ms) var(--md1-easing-standard, cubic-bezier(0.4, 0, 0.2, 1));
  }

  /*
   * Overflow pagination (desktop): the page names the arrows and states no
   * metrics. They take the 48 dp touch target width and the inactive tab ink.
   * Touch screens swipe the bar instead, so the arrows only show for a fine pointer.
   */
  .md1-tabs__arrow {
    position: relative;
    display: none;
    flex: 0 0 auto;
    align-items: center;
    justify-content: center;
    width: var(--md1-touch-target, 48px);
    margin: 0;
    padding: 0;
    border: 0;
    background: transparent;
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }

  @media (pointer: fine) {
    .md1-tabs__arrow {
      display: inline-flex;
    }
  }

  .md1-tabs__arrow:focus-visible {
    outline: 2px solid transparent;
    background-color: color-mix(in srgb, currentcolor 12%, transparent);
  }

  .md1-tabs__arrow[data-disabled] {
    color: var(--md1-text-disabled, rgba(0, 0, 0, 0.38));
    cursor: default;
  }

  .md1-tabs__arrow > .md1-icon {
    position: relative;
  }

  /*
   * The "More" control is a tab-styled menu button at the bar's end: the tab's
   * padding, type and inks, its label followed by the arrow-drop-down glyph, at
   * its own width. Selected, it takes the active ink and the 2 dp indicator.
   */
  .md1-tabs__more {
    flex-direction: row;
    gap: 0;
    min-width: 0;
    padding-inline-end: 12px;
  }

  @media (min-width: 600px) {
    .md1-tabs__more {
      min-width: 0;
    }
  }

  .md1-tabs__cue {
    position: relative;
    flex: 0 0 auto;
  }

  /*
   * The control holds its widest caption's width and no more than the bar can
   * spare beside the first tab (see `captions` and `spare`), so a selection
   * never resizes it and a narrow bar truncates the caption instead.
   */
  .md1-tabs[data-scrollable] .md1-tabs__more {
    max-width: min(264px, var(--md1-tabs-spare, 264px));
  }

  /* The caption and the unseen captions overlap in one cell; none of them holds a minimum width, so the cell can truncate. */
  .md1-tabs__more .md1-tabs__caption {
    display: grid;
    text-align: center;
  }

  .md1-tabs__caption > * {
    grid-area: 1 / 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* Generated content, so the reserve never joins the control's text or its accessible name. */
  .md1-tabs__reserve {
    visibility: hidden;
  }

  .md1-tabs__reserve::before {
    content: attr(data-text);
  }

  .md1-tabs__more[data-selected]::after {
    content: '';
    position: absolute;
    inset: auto 0 0;
    height: 2px;
    background: var(--md1-accent, #FF4081);
  }

  .md1-toolbar[data-variant='primary'] .md1-tabs__more[data-selected]::after {
    background: var(--md1-on-primary, #FFFFFF);
  }

  /* On a primary bar the tab ink is white: 100% active and 70% inactive (tabs page), 30% disabled (Vuetify 1.5's dark disabled-button ink). */
  .md1-toolbar[data-variant='primary'] .md1-tabs__indicator {
    background: var(--md1-on-primary, #FFFFFF);
  }

  .md1-toolbar[data-variant='primary'] .md1-tabs__arrow {
    color: rgb(var(--md1-on-primary-channels, 255 255 255) / 0.7);
  }

  .md1-toolbar[data-variant='primary'] .md1-tabs__arrow[data-disabled] {
    color: rgb(var(--md1-on-primary-channels, 255 255 255) / 0.3);
  }

  @media (prefers-reduced-motion: reduce) {
    body:not([data-reduced-motion='no-preference']) .md1-tabs__list {
      scroll-behavior: auto;
    }

    body:not([data-reduced-motion='no-preference']) .md1-tabs__indicator {
      transition: none;
    }
  }

  body[data-reduced-motion='reduce'] .md1-tabs__list {
    scroll-behavior: auto;
  }

  body[data-reduced-motion='reduce'] .md1-tabs__indicator {
    transition: none;
  }
</style>
