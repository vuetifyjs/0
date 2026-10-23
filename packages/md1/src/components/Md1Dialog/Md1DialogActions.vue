<script lang="ts">
  // Framework
  import { isElement, useLogger, useResizeObserver } from '@vuetify/v0'

  // Context
  import { orphan, useMd1Dialog } from './Md1Dialog.vue'

  // Utilities
  import { onMounted, onUpdated, shallowRef, toRef, useTemplateRef } from 'vue'

  export interface Md1DialogActionsProps {
    /**
     * Full-width 48 dp buttons, affirmative above dismissive. Unset, the row
     * stacks itself when a label exceeds the side-by-side maximum.
     */
    stacked?: boolean
  }

  /**
   * The 8 dp before the first button, between the two, and after the last:
   * the maximum side-by-side button width is (W - 8 - 8 - 8) / 2 (dialogs page).
   */
  const GUTTERS = 24

  /** A button's natural width: its content past the ripple layer, plus its own horizontal padding. */
  function natural (button: Element): number {
    const range = document.createRange()
    const first = button.firstElementChild

    // The ripple layer fills the host; it is not label content.
    if (first?.classList.contains('md1-ripple')) range.setStartAfter(first)
    else range.setStart(button, 0)

    range.setEnd(button, button.childNodes.length)

    const style = getComputedStyle(button)

    return range.getBoundingClientRect().width + Number.parseFloat(style.paddingLeft) + Number.parseFloat(style.paddingRight)
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'Md1DialogActions' })

  defineSlots<{
    /** The actions: dismissive first, affirmative last; at most two. */
    default?: () => any
  }>()

  const { stacked = undefined } = defineProps<Md1DialogActionsProps>()

  const context = useMd1Dialog()

  orphan('Md1DialogActions', context)

  const logger = useLogger()
  const root = useTemplateRef<HTMLElement>('root')
  const auto = shallowRef(false)
  const isStacked = toRef(() => stacked ?? auto.value)

  let warned = false

  function actions (): Element[] {
    return [...(root.value?.children ?? [])].filter(child => isElement(child))
  }

  function audit () {
    if (!__DEV__ || warned || actions().length <= 2) return

    warned = true
    logger.warn('[Md1DialogActions] a dialog has at most two actions (dialogs page); a third such as "Learn more" belongs before the dialog or in its content')
  }

  // Side by side while every label fits (W - 24) / 2, stacked when one does not.
  // Measured only while the dialog is open: a closed dialog has no width.
  function measure () {
    const el = root.value

    if (!el || el.clientWidth === 0) return

    const max = (el.clientWidth - GUTTERS) / 2

    auto.value = actions().some(button => natural(button) > max)
  }

  function sync () {
    audit()
    measure()
  }

  onMounted(sync)
  onUpdated(sync)
  useResizeObserver(root, measure)
</script>

<template>
  <div
    ref="root"
    class="md1-dialog__actions"
    :data-stacked="isStacked || undefined"
  >
    <slot />
  </div>
</template>

<!-- Unscoped, like every MD1 stylesheet; the dialog button rules below reach the Md1Buttons placed inside. -->
<style>
  /*
   * The 52 dp action area: 8 dp around 36 dp flat buttons, 8 dp between them,
   * affirmative at the end. Sticky inside the scrolling sheet so the actions
   * stay in place while the content scrolls. Inline-size containment keeps the
   * row out of the sheet's intrinsic width, so two long labels stack instead
   * of widening the dialog.
   */
  .md1-dialog__actions {
    position: sticky;
    bottom: 0;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: var(--md1-spacing-1, 8px);
    box-sizing: border-box;
    min-height: 52px;
    padding: var(--md1-spacing-1, 8px);
    background: var(--md1-surface, #FFFFFF);
    contain: inline-size;
  }

  /* The stroke that delineates content from actions while the content scrolls; it sits within the button area. */
  .md1-dialog[data-scrolled] .md1-dialog__actions {
    border-top: 1px solid var(--md1-divider, rgba(0, 0, 0, 0.12));
  }

  /* Flat buttons in dialogs: 64 dp minimum width and 8 dp internal padding (dialogs page). */
  .md1-dialog__actions .md1-button {
    min-width: 64px;
    padding: 0 var(--md1-spacing-1, 8px);
  }

  /*
   * Stacked: full-width 48 dp touch targets, affirmative above dismissive
   * (column-reverse keeps the DOM order dismissive-first), the first 24 dp
   * below the content text (its own padding) and the last 8 dp from the edge.
   */
  .md1-dialog__actions[data-stacked] {
    flex-direction: column-reverse;
    align-items: stretch;
    gap: 0;
    padding-top: 0;
  }

  /* The row is the target, so the button's own 48 dp hit area is retired; label text ends 16 dp from the dialog edge (8 + 8). */
  .md1-dialog__actions[data-stacked] .md1-button {
    width: 100%;
    height: var(--md1-touch-target, 48px);
    justify-content: flex-end;
  }

  .md1-dialog__actions[data-stacked] .md1-button::after {
    content: none;
  }
</style>
