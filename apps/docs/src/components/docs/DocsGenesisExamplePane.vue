<script setup lang="ts">
  // Framework
  import { useResizeObserver } from '@vuetify/v0'

  // Utilities
  import { shallowRef, useTemplateRef } from 'vue'

  const { label, wrap = false } = defineProps<{
    /** Filename announced with the scroll region */
    label?: string
    /** Soft-wrap long lines */
    wrap?: boolean
  }>()

  const scrollable = shallowRef(false)
  const scrollRef = useTemplateRef<HTMLElement>('scroll')
  const contentRef = useTemplateRef<HTMLElement>('content')

  function overflows (el: HTMLElement): boolean {
    return el.scrollHeight - el.clientHeight > 2 || el.scrollWidth - el.clientWidth > 2
  }

  // Peek mode clips the code on an ancestor. That clip is not this element's
  // scrollport, so a tall file stays out of the tab order until it is expanded
  // and the cap below actually scrolls.
  function syncScrollable (): void {
    const el = scrollRef.value
    if (!el) {
      scrollable.value = false
      return
    }
    const capped = !el.closest('.genesis-docs-example-code')?.hasAttribute('data-truncated')
    scrollable.value = capped && overflows(el)
  }

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
      :class="scrollable && 'docs-code-window--active'"
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
    max-height: var(--docs-code-window-max, min(28rem, 70vh));
    overflow: auto;
    overscroll-behavior: contain;
  }

  .genesis-docs-example-code:not([data-truncated]) .docs-genesis-example-pane__scroll :deep(.shiki),
  .genesis-docs-example-code:not([data-truncated]) .docs-genesis-example-pane__scroll :deep(.shiki code),
  .genesis-docs-example-code:not([data-truncated]) .docs-genesis-example-pane__scroll :deep(pre) {
    overflow: visible;
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

  .docs-genesis-example-pane--scrollable .docs-genesis-example-pane__actions {
    inset-inline-end: 1.25rem;
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
