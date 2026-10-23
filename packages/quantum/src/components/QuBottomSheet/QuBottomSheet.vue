<script lang="ts">
  // Framework
  import { Collapsible, Dialog, getActiveElement, isArray, Portal, toElement, useId, useLocale } from '@vuetify/v0'

  // Context
  import QuBottomSheetActivator from './QuBottomSheetActivator.vue'

  import { provideQuBottomSheet } from './context'

  // Utilities
  import { Fragment, nextTick, shallowRef, toRef, useAttrs, useTemplateRef, watch } from 'vue'

  // Types
  import type { QuBottomSheetLayout } from './context'
  import type { ComponentPublicInstance, SetupContext, VNode } from 'vue'

  // Components
  import QuButton from '../QuButton/QuButton.vue'

  /**
   * Quantum withholds every v0 dialog prop: the modal sheet is always the
   * native `<dialog>`, its scrim is `::backdrop`, and the outside click,
   * Escape and the `X` are its dismissal paths.
   */
  export interface QuBottomSheetProps {
    /** The sheet element's id; generated when unset. */
    id?: string
    /**
     * The persistent sheet: non-modal, no scrim, no focus trap, resting at the
     * app's own elevation beside content that stays interactive. Unset, the
     * sheet is modal: 16 dp over a 20% black scrim.
     */
    persistent?: boolean
    /** Lays `Item` children out as 48 dp icon tiles with labels instead of 48 dp rows. */
    grid?: boolean
    /**
     * Persistent only: `false` renders the sheet where it is declared instead
     * of teleporting it to the stack target, so a contained preview keeps it.
     */
    teleport?: boolean
  }

  export interface QuBottomSheetSlotProps {
    /** Whether the sheet is open. */
    isOpen: boolean
    /** Whether the sheet fills the screen. */
    isExpanded: boolean
    /** Open the sheet. */
    open: () => void
    /** Dismiss the sheet. */
    close: () => void
    /** Fill the screen: the non-gesture path to the expanded state. */
    expand: () => void
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
   * The root's one slot holds the trigger and the sheet's content together.
   * The trigger has to render outside the `<dialog>` (a closed dialog hides
   * its children) and the rest inside it, so each half renders its share of
   * the same slot: `Activator` children on one side, everything else on the other.
   */
  function Slice (props: SliceProps, { slots }: SetupContext): VNode[] {
    const activator = props.part === 'activator'

    return flatten(slots.default?.() ?? []).filter(node => (node.type === QuBottomSheetActivator) === activator)
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'QuBottomSheet', inheritAttrs: false })

  defineSlots<{
    /** The activator, the title, the items and dividers. */
    default?: (props: QuBottomSheetSlotProps) => any
  }>()

  defineEmits<{
    'update:model-value': [value: boolean]
    'update:expanded': [value: boolean]
  }>()

  const {
    id: _id,
    persistent = false,
    grid = false,
    teleport = true,
  } = defineProps<QuBottomSheetProps>()

  const open = defineModel<boolean>({ default: false })
  const expanded = defineModel<boolean>('expanded', { default: false })

  const attrs = useAttrs()
  const locale = useLocale()

  const uid = useId()
  const id = toRef(() => _id ?? uid)
  const titleId = toRef(() => `${id.value}-title`)
  const layout = toRef((): QuBottomSheetLayout => grid ? 'grid' : 'list')
  const titles = shallowRef(0)

  const sheet = useTemplateRef<ComponentPublicInstance>('sheet')

  // Where focus was when a persistent sheet opened, usually its activator.
  const origin = shallowRef<HTMLElement | null>(null)

  // A persistent sheet is no <dialog>, so nothing hands focus back when it
  // closes. Closing it with focus inside (Escape, the X) would drop focus to
  // the document; it returns to where it was when the sheet opened instead.
  function restore () {
    const el = toElement(sheet.value)
    const active = getActiveElement()
    const target = origin.value

    origin.value = null

    if (!el || !active || !el.contains(active) || !target?.isConnected) return

    nextTick(() => target.focus())
  }

  watch(open, value => {
    if (value) {
      const active = getActiveElement()

      if (persistent && active instanceof HTMLElement) origin.value = active

      return
    }

    // Every dismissal ends the expanded state: the next opening starts from the content's height again.
    expanded.value = false

    if (persistent) restore()
  })

  function show () {
    open.value = true
  }

  function close () {
    open.value = false
  }

  function toggle () {
    open.value = !open.value
  }

  function expand () {
    expanded.value = true
  }

  function label () {
    titles.value++

    return () => {
      titles.value--
    }
  }

  provideQuBottomSheet({
    id,
    titleId,
    persistent: toRef(() => persistent),
    layout,
    isOpen: toRef(() => open.value),
    isExpanded: toRef(() => expanded.value),
    open: show,
    close,
    toggle,
    label,
  })

  const hooks = toRef(() => ({
    'data-expanded': expanded.value || undefined,
    'data-layout': layout.value,
    'data-open': open.value || undefined,
    'data-persistent': persistent || undefined,
  }))

  const slotProps = toRef((): QuBottomSheetSlotProps => ({
    isOpen: open.value,
    isExpanded: expanded.value,
    open: show,
    close,
    expand,
  }))

  const closeLabel = toRef(() => locale.ti('Quantum.close') ?? 'Close')

  // Back is Escape on the web; a persistent sheet has no native cancel to give it one.
  function onKeydown (event: KeyboardEvent) {
    if (event.key !== 'Escape' || event.defaultPrevented) return

    event.preventDefault()
    close()
  }
</script>

<template>
  <Dialog.Root v-if="!persistent" :id v-model="open">
    <Slice part="activator">
      <slot v-bind="slotProps" />
    </Slice>

    <!-- scrim is false on every Dialog.Content Quantum renders: the backdrop is ::backdrop (#910). -->
    <Dialog.Content
      v-bind="{ ...attrs, ...hooks }"
      class="quantum-bottom-sheet"
      :scrim="false"
    >
      <div v-if="expanded" class="quantum-bottom-sheet__bar">
        <QuButton :aria-label="closeLabel" icon="close" @click="close" />
      </div>

      <div class="quantum-bottom-sheet__content">
        <Slice part="sheet">
          <slot v-bind="slotProps" />
        </Slice>
      </div>
    </Dialog.Content>
  </Dialog.Root>

  <template v-else>
    <Slice part="activator">
      <slot v-bind="slotProps" />
    </Slice>

    <!-- A mounted Portal is an open stack entry, so it exists only while the sheet does. -->
    <Portal
      v-if="open"
      v-slot="{ zIndex }"
      :disabled="!teleport"
      :scrim="false"
      @close="close"
    >
      <Collapsible.Root
        :id
        ref="sheet"
        v-model="expanded"
        v-bind="{ ...attrs, ...hooks }"
        :aria-labelledby="titles > 0 ? titleId : undefined"
        as="aside"
        class="quantum-bottom-sheet"
        :style="{ zIndex }"
        @keydown="onKeydown"
      >
        <div v-if="expanded" class="quantum-bottom-sheet__bar">
          <QuButton :aria-label="closeLabel" icon="close" @click="close" />
        </div>

        <div class="quantum-bottom-sheet__content">
          <Slice part="sheet">
            <slot v-bind="slotProps" />
          </Slice>
        </div>
      </Collapsible.Root>
    </Portal>
  </template>
</template>

<!--
  Unscoped: Dialog.Content and Collapsible.Root are Atoms, and this one sheet
  also styles the parts (EmCard's model), which render no stylesheet of their own.
-->
<style>
  /*
   * The sheet: full width against the bottom edge, square corners in every
   * figure, the surface colour, Regular 16 sp ink. Its initial height is the
   * content's, capped at the 16:9 ratio keyline (width x 9 / 16) and never
   * reaching the app bar, so an area stays above it to tap and dismiss.
   * `display` is left to the UA on the closed <dialog> so it stays hidden.
   */
  .quantum-bottom-sheet {
    box-sizing: border-box;
    position: fixed;
    inset: auto 0 0;
    flex-direction: column;
    width: 100%;
    max-width: 100%;
    max-height: min(calc(100vw * 9 / 16), calc(100% - var(--quantum-increment, 56px) - var(--quantum-spacing-1, 8px)));
    margin: 0;
    padding: 0;
    border: 0;
    border-radius: 0;
    overflow: hidden;
    background: var(--quantum-surface, #FFFFFF);
    color: var(--quantum-text-primary, rgba(0, 0, 0, 0.87));
    font-family: var(--quantum-font-family, Roboto, Noto, sans-serif);
  }

  /* Modal: 16 dp over everything but dialogs and pickers (elevation page). */
  .quantum-bottom-sheet:not([data-persistent]) {
    box-shadow: var(--quantum-elevation-16, 0px 8px 10px -5px rgba(0, 0, 0, 0.2), 0px 16px 24px 2px rgba(0, 0, 0, 0.14), 0px 6px 30px 5px rgba(0, 0, 0, 0.12));
    transform: translateY(100%);
    transition:
      transform var(--quantum-duration-leave, 195ms) var(--quantum-easing-accelerate, cubic-bezier(0.4, 0, 1, 1)),
      max-height var(--quantum-duration-standard, 300ms) var(--quantum-easing-standard, cubic-bezier(0.4, 0, 0.2, 1)),
      overlay var(--quantum-duration-leave, 195ms) allow-discrete,
      display var(--quantum-duration-leave, 195ms) allow-discrete;
  }

  /* Enter: slides up from the bottom edge, 225 ms on the deceleration curve; leave: 195 ms accelerating (motion page). */
  .quantum-bottom-sheet[open] {
    display: flex;
    transform: none;
    transition-duration: var(--quantum-duration-enter, 225ms), var(--quantum-duration-standard, 300ms), var(--quantum-duration-enter, 225ms), var(--quantum-duration-enter, 225ms);
    transition-timing-function: var(--quantum-easing-decelerate, cubic-bezier(0, 0, 0.2, 1)), var(--quantum-easing-standard, cubic-bezier(0.4, 0, 0.2, 1));
  }

  @starting-style {
    .quantum-bottom-sheet[open] {
      transform: translateY(100%);
    }
  }

  /* The bottom sheets page's transparent overlay: #000 at 20%, the only scrim value MD1 states. */
  .quantum-bottom-sheet::backdrop {
    background: var(--quantum-scrim-sheet, rgba(0, 0, 0, 0.2));
    opacity: 0;
    transition:
      opacity var(--quantum-duration-leave, 195ms) var(--quantum-easing-accelerate, cubic-bezier(0.4, 0, 1, 1)),
      overlay var(--quantum-duration-leave, 195ms) allow-discrete,
      display var(--quantum-duration-leave, 195ms) allow-discrete;
  }

  .quantum-bottom-sheet[open]::backdrop {
    opacity: 1;
    transition-duration: var(--quantum-duration-enter, 225ms);
    transition-timing-function: var(--quantum-easing-decelerate, cubic-bezier(0, 0, 0.2, 1));
  }

  @starting-style {
    .quantum-bottom-sheet[open]::backdrop {
      opacity: 0;
    }
  }

  /*
   * Persistent: part of the layout at the app's own elevation, so no shadow;
   * the seam to the content above is a 1 dp divider (a Quantum decision: the
   * page states the elevation, not the edge).
   */
  .quantum-bottom-sheet[data-persistent] {
    display: flex;
    border-top: 1px solid var(--quantum-divider, rgba(0, 0, 0, 0.12));
    box-shadow: var(--quantum-elevation-0, none);
    transition: max-height var(--quantum-duration-standard, 300ms) var(--quantum-easing-standard, cubic-bezier(0.4, 0, 0.2, 1));
    animation: quantum-bottom-sheet-in var(--quantum-duration-enter, 225ms) var(--quantum-easing-decelerate, cubic-bezier(0, 0, 0.2, 1));
  }

  @keyframes quantum-bottom-sheet-in {
    from {
      transform: translateY(100%);
    }
  }

  /* Expanded: fills the screen, the content scrolls inside it, and the bar carries the X. */
  .quantum-bottom-sheet[data-expanded] {
    top: 0;
    height: 100%;
    max-height: 100%;
  }

  /*
   * Tablet and desktop: the modal sheet is inset by layout increments (64 dp
   * from 600 px): at least 1 from each edge and 6 wide at 960 dp, 2 and 8 at
   * 1280, 3 and 9 at 1440. The content sets the width between the two.
   */
  @media (min-width: 960px) {
    .quantum-bottom-sheet:not([data-persistent]) {
      width: fit-content;
      min-width: calc(6 * var(--quantum-increment, 64px));
      max-width: calc(100% - 2 * var(--quantum-increment, 64px));
      margin-inline: auto;
    }
  }

  @media (min-width: 1280px) {
    .quantum-bottom-sheet:not([data-persistent]) {
      min-width: calc(8 * var(--quantum-increment, 64px));
      max-width: calc(100% - 4 * var(--quantum-increment, 64px));
    }
  }

  @media (min-width: 1440px) {
    .quantum-bottom-sheet:not([data-persistent]) {
      min-width: calc(9 * var(--quantum-increment, 64px));
      max-width: calc(100% - 6 * var(--quantum-increment, 64px));
    }
  }

  /* Mouse and keyboard: every resting elevation drops 2 dp (elevation page). */
  @media (pointer: fine) {
    .quantum-bottom-sheet:not([data-persistent]) {
      box-shadow: var(--quantum-elevation-14, 0px 7px 9px -4px rgba(0, 0, 0, 0.2), 0px 14px 21px 2px rgba(0, 0, 0, 0.14), 0px 5px 26px 4px rgba(0, 0, 0, 0.12));
    }
  }

  /* The X bar of the expanded sheet: one app bar increment tall, the glyph on the 16 dp keyline (24 dp from 600 px). */
  .quantum-bottom-sheet__bar {
    display: flex;
    flex: none;
    align-items: center;
    box-sizing: border-box;
    height: var(--quantum-increment, 56px);
    padding-inline: calc(var(--quantum-keyline-margin, 16px) - (var(--quantum-touch-target, 48px) - var(--quantum-icon-size, 24px)) / 2);
    color: var(--quantum-icon-active, rgba(0, 0, 0, 0.54));
  }

  /* The QuButton accent is for actions on a sheet; the bar's X is an app bar icon at the active-icon ink. */
  .quantum-bottom-sheet__bar .quantum-button {
    color: inherit;
  }

  /* List: 8 dp above and below the rows; the content scrolls internally when it outgrows the sheet. */
  .quantum-bottom-sheet__content {
    flex: 1 1 auto;
    min-height: 0;
    padding-block: var(--quantum-spacing-1, 8px);
    overflow-y: auto;
    overscroll-behavior: contain;
  }

  /* Title: a 56 dp row, Regular 16 sp at the secondary ink, with its 1 dp divider and 8 dp below it. */
  .quantum-bottom-sheet__title {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    height: 56px;
    margin: calc(-1 * var(--quantum-spacing-1, 8px)) 0 var(--quantum-spacing-1, 8px);
    padding-inline: var(--quantum-spacing-2, 16px);
    border-bottom: 1px solid var(--quantum-divider, rgba(0, 0, 0, 0.12));
    overflow: hidden;
    color: var(--quantum-text-secondary, rgba(0, 0, 0, 0.54));
    font-size: var(--quantum-type-subheading-size, 16px);
    font-weight: var(--quantum-type-subheading-weight, 400);
    line-height: var(--quantum-type-subheading-leading, 24px);
    letter-spacing: var(--quantum-type-subheading-tracking, 0.01em);
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  /* A section divider gets 8 dp above and below (the header metrics' "space above and below divider"). */
  .quantum-bottom-sheet__content > .quantum-divider {
    margin-block: var(--quantum-spacing-1, 8px);
  }

  /*
   * List item: a 48 dp row on the 16 dp keyline, a 24 dp icon in the active
   * icon ink, 32 dp from icon to text, Regular 16 sp at the primary ink.
   */
  .quantum-bottom-sheet__item {
    position: relative;
    display: flex;
    align-items: center;
    gap: var(--quantum-spacing-4, 32px);
    box-sizing: border-box;
    width: 100%;
    height: var(--quantum-touch-target, 48px);
    margin: 0;
    padding: 0 var(--quantum-spacing-2, 16px);
    border: 0;
    background: transparent;
    color: var(--quantum-text-primary, rgba(0, 0, 0, 0.87));
    font-family: var(--quantum-font-family, Roboto, Noto, sans-serif);
    font-size: var(--quantum-type-subheading-size, 16px);
    font-weight: var(--quantum-type-subheading-weight, 400);
    line-height: var(--quantum-type-subheading-leading, 24px);
    letter-spacing: var(--quantum-type-subheading-tracking, 0.01em);
    text-align: start;
    text-decoration: none;
    cursor: pointer;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
    transition: background-color var(--quantum-duration-standard, 300ms) var(--quantum-easing-standard, cubic-bezier(0.4, 0, 0.2, 1));
  }

  /* The page states no item states; the lists rule applies: 6% hover, 12% keyboard focus. */
  .quantum-bottom-sheet__item:hover {
    background-color: var(--quantum-hover, rgba(0, 0, 0, 0.06));
  }

  .quantum-bottom-sheet__item:focus-visible {
    outline: 2px solid transparent;
    background-color: var(--quantum-focus, rgba(0, 0, 0, 0.12));
  }

  .quantum-bottom-sheet__item[data-disabled] {
    color: var(--quantum-text-disabled, rgba(0, 0, 0, 0.38));
    pointer-events: none;
    cursor: default;
  }

  /* Positioned so both paint above the ink layer. */
  .quantum-bottom-sheet__icon,
  .quantum-bottom-sheet__label {
    position: relative;
  }

  .quantum-bottom-sheet__icon {
    display: inline-flex;
    flex: none;
    color: var(--quantum-icon-active, rgba(0, 0, 0, 0.54));
  }

  .quantum-bottom-sheet__item[data-disabled] .quantum-bottom-sheet__icon {
    color: var(--quantum-icon-inactive, rgba(0, 0, 0, 0.38));
  }

  .quantum-bottom-sheet__label {
    flex: 1 1 auto;
    min-width: 0;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  /*
   * Grid: 24 dp margins on every side, rows 24 dp apart, tiles spread evenly
   * across each row. Each tile is a 48 dp icon with a 16 dp label 8 dp below it.
   */
  .quantum-bottom-sheet[data-layout='grid'] .quantum-bottom-sheet__content {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(96px, 1fr));
    align-content: start;
    row-gap: var(--quantum-spacing-3, 24px);
    padding: var(--quantum-spacing-3, 24px);
  }

  /* The header spans the row, sits flush with the sheet edges, and leaves 8 dp below its divider. */
  .quantum-bottom-sheet[data-layout='grid'] .quantum-bottom-sheet__title {
    grid-column: 1 / -1;
    margin: calc(-1 * var(--quantum-spacing-3, 24px)) calc(-1 * var(--quantum-spacing-3, 24px)) calc(var(--quantum-spacing-1, 8px) - var(--quantum-spacing-3, 24px));
    padding-inline: var(--quantum-spacing-3, 24px);
  }

  .quantum-bottom-sheet[data-layout='grid'] .quantum-bottom-sheet__content > .quantum-divider {
    grid-column: 1 / -1;
    margin: calc(var(--quantum-spacing-1, 8px) - var(--quantum-spacing-3, 24px)) calc(-1 * var(--quantum-spacing-3, 24px));
  }

  .quantum-bottom-sheet[data-layout='grid'] .quantum-bottom-sheet__item {
    flex-direction: column;
    justify-content: flex-start;
    gap: var(--quantum-spacing-1, 8px);
    height: auto;
    padding: 0;
  }

  /* The item's own glyph only: the X of an expanded grid sheet keeps its 24 dp. */
  .quantum-bottom-sheet[data-layout='grid'] .quantum-bottom-sheet__icon > .quantum-icon {
    --quantum-icon-size: 48px;
  }

  /* The page sizes the label row (16 dp) and not the type; Caption on a 16 dp line is a Quantum decision. */
  .quantum-bottom-sheet[data-layout='grid'] .quantum-bottom-sheet__label {
    flex: none;
    width: 100%;
    height: 16px;
    font-size: var(--quantum-type-caption-size, 12px);
    line-height: 16px;
    letter-spacing: var(--quantum-type-caption-tracking, 0.02em);
    text-align: center;
  }

  /* Reduced motion: the sheet appears and leaves at once. The plugin's body attribute wins over the OS query. */
  body[data-reduced-motion='reduce'] .quantum-bottom-sheet,
  body[data-reduced-motion='reduce'] .quantum-bottom-sheet::backdrop {
    transition: none;
    animation: none;
  }

  @media (prefers-reduced-motion: reduce) {
    body:not([data-reduced-motion='no-preference']) .quantum-bottom-sheet,
    body:not([data-reduced-motion='no-preference']) .quantum-bottom-sheet::backdrop {
      transition: none;
      animation: none;
    }
  }
</style>
