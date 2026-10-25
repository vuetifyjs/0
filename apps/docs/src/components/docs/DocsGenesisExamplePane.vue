<script setup lang="ts">
  // Framework
  import { useEventListener, useResizeObserver } from '@vuetify/v0'

  // Utilities
  import { shallowRef, useTemplateRef } from 'vue'

  const { label, wrap = false } = defineProps<{
    /** Filename announced with the scroll region */
    label?: string
    /** Soft-wrap long lines */
    wrap?: boolean
  }>()

  const scrollable = shallowRef(false)
  // A wide line leaves progress at 0, which would paint the bottom veil over lines already in view.
  const overflowsY = shallowRef(false)
  const scrollRef = useTemplateRef<HTMLElement>('scroll')
  const contentRef = useTemplateRef<HTMLElement>('content')

  // Peek mode clips the code on an ancestor. That clip is not this element's
  // scrollport, so a tall file stays out of the tab order until it is expanded
  // and the cap below actually scrolls.
  function syncProgress (): void {
    const el = scrollRef.value
    if (!el) return
    const range = el.scrollHeight - el.clientHeight
    const progress = range > 0 ? el.scrollTop / range : 0
    el.style.setProperty('--docs-code-progress', String(progress))
  }

  function syncScrollable (): void {
    const el = scrollRef.value
    if (!el) {
      scrollable.value = false
      overflowsY.value = false
      return
    }
    const capped = !el.closest('.genesis-docs-example-code')?.hasAttribute('data-truncated')
    const vertical = el.scrollHeight - el.clientHeight > 2
    const horizontal = el.scrollWidth - el.clientWidth > 2
    overflowsY.value = capped && vertical
    scrollable.value = capped && (vertical || horizontal)
    syncProgress()
  }

  useEventListener(scrollRef, 'scroll', syncProgress, { passive: true })
  useResizeObserver(scrollRef, syncScrollable)
  useResizeObserver(contentRef, syncScrollable)
</script>

<template>
  <div
    class="docs-genesis-example-pane"
    :class="[
      wrap && 'docs-genesis-example-pane--wrap',
      scrollable && 'docs-genesis-example-pane--scrollable',
    ]"
    data-tour="example-code"
  >
    <div
      ref="scroll"
      :aria-label="scrollable ? (label ? `Scrollable example code, ${label}` : 'Scrollable example code') : undefined"
      class="docs-genesis-example-pane__scroll docs-code-window"
      :class="overflowsY && 'docs-code-window--active'"
      :role="scrollable ? 'region' : undefined"
      :tabindex="scrollable ? 0 : undefined"
    >
      <div ref="content">
        <slot />
      </div>
    </div>

    <div class="docs-genesis-example-pane__actions" data-tour="example-toolbar">
      <slot name="actions" />
    </div>
  </div>
</template>

<style scoped>
  .docs-genesis-example-pane {
    position: relative;
  }

  /* Files shorter than the cap never scroll and keep today's height. Long
     files scroll inside the window instead of stretching the page. */
  .docs-genesis-example-pane__scroll {
    --docs-code-window-fade: var(--v0-pre, var(--v0-surface));
  }

  .genesis-docs-example-code:not([data-truncated]) .docs-genesis-example-pane__scroll {
    max-height: var(--docs-code-window-max, min(42rem, 105vh));
    overflow: auto;
    overscroll-behavior: contain;
  }

  .genesis-docs-example-code:not([data-truncated]) .docs-genesis-example-pane__scroll :deep(.shiki),
  .genesis-docs-example-code:not([data-truncated]) .docs-genesis-example-pane__scroll :deep(.shiki code),
  .genesis-docs-example-code:not([data-truncated]) .docs-genesis-example-pane__scroll :deep(pre) {
    overflow: visible;
  }

  /* The pre is the painted code surface. As a block it is only the scrollport
     wide, so a long line runs off its background. Grow it to the line. Width
     stays auto, so a short file still fills the pane. Wrap mode must be able
     to shrink, so it keeps the default min-width. */
  .genesis-docs-example-code:not([data-truncated]) .docs-genesis-example-pane:not(.docs-genesis-example-pane--wrap) .docs-genesis-example-pane__scroll :deep(.shiki) {
    min-width: max-content;
  }

  .docs-genesis-example-pane__actions {
    position: absolute;
    top: 0.5rem;
    inset-inline-end: 0.5rem;
    z-index: 10;
    display: flex;
    gap: 0.25rem;
    opacity: 0;
    transition: opacity 0.15s;
  }

  .docs-genesis-example-pane:hover .docs-genesis-example-pane__actions,
  .docs-genesis-example-pane:focus-within .docs-genesis-example-pane__actions {
    opacity: 1;
  }

  @media (max-width: 767px) {
    .docs-genesis-example-pane__actions {
      opacity: 1;
    }
  }

  .docs-genesis-example-pane--wrap :deep(.docs-genesis-shiki-block pre),
  .docs-genesis-example-pane--wrap :deep(.docs-genesis-shiki-block pre code) {
    white-space: pre-wrap;
    word-break: break-word;
  }
</style>
