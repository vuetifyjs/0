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
     * drawn at the disabled ink. Declared as a plain boolean rather than
     * v0's `MaybeRefOrGetter<boolean>`, which compiles to an untyped runtime
     * prop and leaves the bare `disabled` attribute as an empty, falsy string.
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
   * (tabs page). One line clips with no wrap, so an overflowing scrollWidth is
   * the signal to wrap; the unwrapped width is kept so the label unwraps only
   * once the tab is wide enough for it again, never oscillating at the edge.
   */
  const lines = shallowRef<1 | 2>(1)
  let natural = 0

  function measure () {
    const el = button.value

    if (!el) return

    const span = text.value

    if (span) {
      if (lines.value === 1) {
        natural = span.scrollWidth

        if (span.scrollWidth > span.clientWidth + 1) lines.value = 2
      } else if (span.clientWidth >= natural) {
        lines.value = 1
      }
    }

    if (!context) return

    const style = getComputedStyle(el)
    const padding = pxToNumber(style.paddingLeft) + pxToNumber(style.paddingRight)

    context.items.upsert(id, {
      value: {
        kind: kind.value,
        natural: (span ? natural : GLYPH) + padding,
      },
    })

    context.overflow.measure(key, el)
  }

  if (context) context.items.register({ id, value: { kind: kind.value, natural: 0 } })

  // New text needs a fresh unwrapped width: drop back to one line and measure again.
  watch(() => [label, kind.value], () => {
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
   * mouse), the label in the Button style, centred both ways, inactive ink at
   * the secondary text opacity. The width rules belong to the bar mode.
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
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
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

  /* Scrollable tabs size to their label, up to 264 dp or the view less 56 dp, whichever is smaller. */
  .md1-tabs[data-scrollable] .md1-tabs__item {
    max-width: min(264px, calc(100% - 56px));
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

  /* Ink follows the indicator: the accent on a surface bar (Material Design 1 decision; the page gives "#fff or accent"). */
  .md1-tabs__item[data-selected] {
    color: var(--md1-accent, #FF4081);
  }

  .md1-tabs__item[data-disabled] {
    color: var(--md1-text-disabled, rgba(0, 0, 0, 0.38));
    cursor: default;
    pointer-events: none;
  }

  /* On a primary bar: white at 100% active, 70% inactive, 60% disabled. */
  .md1-toolbar[data-variant='primary'] .md1-tabs__item {
    color: rgb(var(--md1-on-primary-channels, 255 255 255) / 0.7);
  }

  .md1-toolbar[data-variant='primary'] .md1-tabs__item[data-selected] {
    color: var(--md1-on-primary, #FFFFFF);
  }

  .md1-toolbar[data-variant='primary'] .md1-tabs__item[data-disabled] {
    color: rgb(var(--md1-on-primary-channels, 255 255 255) / 0.6);
  }

  /* Hover: the 6% currentColor overlay where a page states none (lead decision 3). Focus: the 12% overlay. */
  .md1-tabs__item:hover {
    background-color: color-mix(in srgb, currentcolor 6%, transparent);
  }

  .md1-tabs__item:focus-visible {
    outline: 2px solid transparent;
    outline-offset: -2px;
    background-color: color-mix(in srgb, currentcolor 12%, transparent);
  }

  /* Painted above the ink layer, which is absolutely positioned and would otherwise cover them. */
  .md1-tabs__icon,
  .md1-tabs__label {
    position: relative;
  }

  /* One line clips while the bar decides whether the label wraps. */
  .md1-tabs__label {
    display: block;
    max-width: 100%;
    overflow: hidden;
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
