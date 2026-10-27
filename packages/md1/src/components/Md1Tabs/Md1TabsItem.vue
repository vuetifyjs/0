<script lang="ts">
  // Framework
  import { isString, pxToNumber, Tabs, useId, useLogger, useRaf, useResizeObserver } from '@vuetify/v0'

  // Context
  import { useMd1Tabs } from './Md1Tabs.vue'

  // Utilities
  import { mergeProps, nextTick, onBeforeUnmount, onMounted, shallowRef, toRef, useAttrs, useSlots, useTemplateRef, watch } from 'vue'

  // Types
  import type { Md1IconName } from '../../icons'
  import type { Md1TabsItemKind } from './Md1Tabs.vue'
  import type { TabsItemProps } from '@vuetify/v0'

  // Components
  import Md1Icon from '../Md1Icon/Md1Icon.vue'
  import Md1Ripple from '../Md1Ripple/Md1Ripple.vue'

  export interface Md1TabsItemProps extends Pick<
    TabsItemProps,
    'value' | 'ariaLabel' | 'namespace'
  > {
    /**
     * Takes the tab out of use: skipped by the arrow keys, inert to a press,
     * drawn at the disabled ink. A plain boolean rather than v0's
     * `MaybeRefOrGetter<boolean>`, the type every Material Design 1 part takes.
     */
    disabled?: boolean
    /**
     * A glyph role drawn through `Md1Icon`. With a label the tab is the 72 dp
     * icon-and-text form, icon above text; without one it is a 48 dp icon-only
     * tab that needs `ariaLabel`.
     */
    icon?: Md1IconName
    /** The tab label. The default slot, when given, replaces it. */
    label?: string
  }

  /** Width of the 24 dp tab glyph; an icon-only tab's content box. */
  const GLYPH = 24

  /** The tabs page's maximum tab width, padding included. */
  const MAX = 264
</script>

<script setup lang="ts">
  // Tabs.Item is renderless, so consumer attrs land on the button here, chained before v0's own handlers.
  defineOptions({ name: 'Md1TabsItem', inheritAttrs: false })

  defineSlots<{
    /** The label; sentence case, capitalised by the stylesheet. */
    default?: () => any
  }>()

  const {
    value,
    disabled,
    ariaLabel,
    namespace: _namespace,
    icon,
    label,
  } = defineProps<Md1TabsItemProps>()

  const context = useMd1Tabs()
  const logger = useLogger()
  const slots = useSlots()
  const attrs = useAttrs()

  if (__DEV__ && !context) logger.warn('[Md1TabsItem] rendered outside <Md1Tabs>; its width rules and overflow measurement are inert')

  const namespace = _namespace ?? context?.namespace.value

  const id = useId()
  const key = context?.key() ?? -1

  const button = useTemplateRef<HTMLButtonElement>('button')
  const text = useTemplateRef<HTMLElement>('text')

  const labelled = toRef(() => !!slots.default || isString(label))
  const kind = toRef((): Md1TabsItemKind => labelled.value || !icon ? 'text' : 'icon')

  /** `stacked` is the 72 dp icon-and-text tab; `only` the 48 dp icon tab. */
  const glyph = toRef(() => {
    if (!icon) return undefined

    return labelled.value ? 'stacked' : 'only'
  })

  /*
   * Labels wrap to a second line at 12 sp when they do not fit, then truncate
   * (tabs page). The unwrapped width is read while the label is on one line and
   * kept, then compared with the room inside the tab's padding: the label box
   * shrinks to its text, so its own width cannot say whether the tab has room,
   * and a wrapped 12 sp label is narrower than the one-line label it replaced.
   */
  const lines = shallowRef<1 | 2>(1)
  let natural = 0

  /*
   * The widest the tab may grow, padding included. A full-width fixed tab owns
   * its share of the bar. Scrollable and centred fixed tabs size to their label,
   * so a wrapped label narrows them: their ceiling is the page's maximum, 264 dp
   * (for scrollable tabs, or the view less 56 dp when that is smaller).
   */
  function room (el: HTMLElement): number {
    const bar = el.closest('.md1-tabs__bar')

    if (context?.scrollable.value && bar) return Math.min(MAX, bar.clientWidth - 56)

    if (el.closest('.md1-tabs__bar[data-centered]')) return MAX

    return el.clientWidth
  }

  // In the "More" menu rather than the bar (desktop overflow).
  const collapsed = toRef(() => context?.hidden(id) ?? false)

  /** The row text the "More" menu lists this tab under. */
  function name (): string {
    if (isString(label) && label.length > 0) return label

    return text.value?.textContent?.trim() || ariaLabel || ''
  }

  function measure () {
    const el = button.value

    // A tab in the "More" menu keeps its last width: measured hidden it would read zero and pull every tab back into the bar.
    if (!el || collapsed.value) return

    const span = text.value
    const style = getComputedStyle(el)
    const padding = pxToNumber(style.paddingLeft) + pxToNumber(style.paddingRight)

    if (span) {
      if (lines.value === 1) natural = span.scrollWidth

      lines.value = natural > room(el) - padding + 1 ? 2 : 1
    }

    if (!context) return

    context.items.upsert(id, {
      value: {
        kind: kind.value,
        natural: (span ? natural : GLYPH) + padding,
        label: name(),
        disabled,
      },
    })

    context.overflow.measure(key, el)
  }

  if (context) context.items.register({ id, value: { kind: kind.value, natural: 0, label: label ?? ariaLabel, disabled } })

  // New text needs a fresh unwrapped width: drop back to one line and measure again.
  watch(() => [label, kind.value, disabled], () => {
    lines.value = 1
    nextTick(measure)
  })

  // A changed line count changes the label box; measure the settled layout.
  watch(lines, () => nextTick(measure), { flush: 'post' })

  /*
   * A measurement can rewrap the label and show the pagination arrows, which
   * resize the elements being observed. Deferring it a frame keeps that out of
   * the observer's own delivery, which the browser otherwise reports as a
   * "ResizeObserver loop" error.
   */
  const schedule = useRaf(measure)

  useResizeObserver(button, schedule)
  useResizeObserver(text, schedule)

  onMounted(measure)

  onBeforeUnmount(() => {
    context?.items.unregister(id)
    context?.overflow.measure(key, undefined)
  })

  if (__DEV__) {
    watch(() => kind.value === 'icon' && !ariaLabel, wrong => {
      if (wrong) logger.warn('[Md1TabsItem] an icon-only tab has no accessible name: the glyph is aria-hidden, so pass ariaLabel')
    }, { immediate: true })
  }
</script>

<template>
  <Tabs.Item
    :id
    v-slot="{ attrs: tab }"
    :aria-label
    :disabled
    :el="button"
    :namespace
    renderless
    :value
  >
    <button
      ref="button"
      v-bind="mergeProps(attrs, tab)"
      class="md1-tabs__item"
      :data-collapsed="collapsed || undefined"
      :data-icon="glyph"
      :data-lines="labelled ? lines : undefined"
    >
      <Md1Ripple />

      <Md1Icon v-if="icon" class="md1-tabs__icon" :name="icon" />

      <span v-if="labelled" ref="text" class="md1-tabs__label">
        <slot>{{ label }}</slot>
      </span>
    </button>
  </Tabs.Item>
</template>

<!-- Unscoped: Tabs.Item is renderless, so the button is this file's own element. -->
<style>
  /*
   * A tab is its whole cell: 48 dp tall, 12 dp of side padding (24 dp for a
   * mouse), the label in the Button style, centred both ways. The inactive ink
   * is Vuetify 1.5's: the primary text ink at 70% (_tabs.styl:139-140, th:70-71),
   * about 61% black and 70% white. The width rules belong to the bar mode.
   */
  .md1-tabs__item {
    position: relative;
    display: flex;
    flex: 0 0 auto;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    box-sizing: border-box;
    min-width: 72px;
    min-height: 48px;
    margin: 0;
    padding: 0 12px;
    border: 0;
    background: transparent;
    color: color-mix(in srgb, var(--md1-text-primary, rgba(0, 0, 0, 0.87)) 70%, transparent);
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-button-size, 14px);
    font-weight: var(--md1-type-button-weight, 500);
    line-height: var(--md1-type-button-leading, 1);
    letter-spacing: var(--md1-type-button-tracking, 0.01em);
    text-align: center;
    text-transform: var(--md1-type-button-transform, uppercase);
    cursor: pointer;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
    transition: color var(--md1-duration-standard, 300ms) var(--md1-easing-standard, cubic-bezier(0.4, 0, 0.2, 1));
  }

  /*
   * Scrollable tabs size to their label, up to 264 dp or the view less 56 dp,
   * whichever is smaller. The view is the bar's width, which the list writes:
   * the tablist itself is narrowed by the keyline padding and the arrows.
   */
  .md1-tabs[data-scrollable] .md1-tabs__item {
    max-width: min(264px, calc(var(--md1-tabs-view, 100%) - 56px));
  }

  @media (min-width: 600px) {
    .md1-tabs__item {
      min-width: 160px;
    }

    /* Centred fixed tabs stop at 264 dp; full-width ones fill their share. */
    .md1-tabs__bar[data-centered] .md1-tabs__item {
      max-width: 264px;
    }
  }

  /* Desktop: 24 dp of side padding and the 13 sp label (Body 2's desktop size at the Button weight). */
  @media (pointer: fine) {
    .md1-tabs__item {
      padding: 0 24px;
      font-size: var(--md1-type-body-2-size, 13px);
    }
  }

  /* Icons and text: 72 dp, the 24 dp glyph above the label with 10 dp between. */
  .md1-tabs__item[data-icon='stacked'] {
    min-height: 72px;
  }

  /*
   * The active label on a surface bar is Vuetify 1.5's tabs.active, the primary
   * text ink (87% black, white on dark; th:70-71, 173-174); only the indicator
   * takes the accent. Disabled is the disabled-button ink, 26% black and 30%
   * white (_tabs.styl:11-12).
   */
  .md1-tabs__item[data-selected] {
    color: var(--md1-text-primary, rgba(0, 0, 0, 0.87));
  }

  .md1-tabs__item[data-disabled] {
    color: var(--md1-button-disabled-text, rgba(0, 0, 0, 0.26));
    cursor: default;
    pointer-events: none;
  }

  /* A tab the "More" dropdown collected leaves the bar; it stays a tab in the tablist for v0's selection. */
  .md1-tabs__item[data-collapsed] {
    display: none;
  }

  /* On a primary bar: white at 100% active and 70% inactive (tabs page); disabled 30%, Vuetify 1.5's dark disabled-button ink. */
  .md1-toolbar[data-variant='primary'] .md1-tabs__item {
    color: rgb(var(--md1-on-primary-channels, 255 255 255) / 0.7);
  }

  .md1-toolbar[data-variant='primary'] .md1-tabs__item[data-selected] {
    color: var(--md1-on-primary, #FFFFFF);
  }

  .md1-toolbar[data-variant='primary'] .md1-tabs__item[data-disabled] {
    color: rgb(var(--md1-on-primary-channels, 255 255 255) / 0.3);
  }

  /*
   * No hover and no focus fill, as in Vuetify 1.5 (the page states neither):
   * keyboard focus shows the user agent's focus ring, inset so the bar does not
   * clip it.
   */
  .md1-tabs__item:focus-visible {
    outline-offset: -2px;
  }

  /* Painted above the ink layer, which is absolutely positioned and would otherwise cover them. */
  .md1-tabs__icon,
  .md1-tabs__label {
    position: relative;
  }

  /*
   * One line clips while the bar decides whether the label wraps. A word wider
   * than the tab truncates with an ellipsis on either line, never a bare cut.
   */
  .md1-tabs__label {
    display: block;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* Wrapped: 12 sp across at most two lines, then an ellipsis. */
  .md1-tabs__item[data-lines='2'] .md1-tabs__label {
    display: -webkit-box;
    font-size: var(--md1-type-caption-size, 12px);
    line-height: 14px;
    white-space: normal;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }
</style>
