<script setup lang="ts">
  // Framework
  import { useEventListener, useMutationObserver, useResizeObserver } from '@vuetify/v0'

  // Utilities
  import { onMounted, useTemplateRef } from 'vue'

  // Types
  import type { Component } from 'vue'

  const { is, name } = defineProps<{
    /** Resolved example component, or undefined when the query names nothing. */
    is?: Component
    /** Example path from the query string, shown when resolution fails. */
    name: string
  }>()

  // Breathing room under an absolutely positioned surface, matching `.sandbox`.
  const PAD = 24

  const root = useTemplateRef<HTMLElement>('root')

  // The DOM is the source of truth for overlay state; this only tracks what the
  // parent has already been told.
  let open = false

  // Where the inline frame sits in the docs viewport. The parent keeps this
  // fresh so a promotion can pin against it in the same tick it is detected.
  let box: { top: number, left: number, width: number } | null = null

  function send (message: Record<string, unknown>) {
    window.parent?.postMessage(message, '*')
  }

  // Promotion moves the frame's viewport origin to the top of the page, which
  // would drag the example's in-flow content — the trigger button — along with
  // it. Pinning the content back to the box it occupied inline keeps it exactly
  // where the reader left it while the overlay covers the viewport.
  //
  // `top`/`left`, never `transform`: a transformed ancestor becomes the
  // containing block for fixed descendants, which would shrink the modal and
  // its backdrop to this box instead of the viewport.
  function pin () {
    const el = root.value

    if (!el) return

    if (!open || !box) {
      el.style.position = ''
      el.style.top = ''
      el.style.left = ''
      el.style.width = ''

      return
    }

    el.style.position = 'fixed'
    el.style.top = `${box.top}px`
    el.style.left = `${box.left}px`
    el.style.width = `${box.width}px`
  }

  function measure () {
    const el = root.value

    if (!el) return

    const nodes = [...el.querySelectorAll<HTMLElement>('*')].filter(node => node.checkVisibility())
    const positions = nodes.map(node => [node, getComputedStyle(node).position] as const)

    // A fixed surface is laid out against this document's viewport, so it can
    // only be seen in full if the parent promotes the whole frame.
    const overlay = positions.some(([, position]) => position === 'fixed')

    if (overlay !== open) {
      open = overlay

      document.documentElement.toggleAttribute('data-overlay', overlay)
      pin()
      send({ type: 'v0:sandbox:overlay', open: overlay })
    }

    // While promoted the frame is the viewport — reporting that back would
    // collapse the placeholder the docs page is holding open in the flow.
    if (overlay) return

    let height = el.offsetHeight

    // Dropdown menus and popovers overflow the flow by a knowable amount.
    for (const [node, position] of positions) {
      if (position !== 'absolute') continue

      height = Math.max(height, Math.ceil(node.getBoundingClientRect().bottom) + PAD)
    }

    send({ type: 'v0:sandbox:size', height })
  }

  useResizeObserver(root, measure)

  // Opening an overlay changes no layout the ResizeObserver can see — the class
  // flip that reveals it is the only signal.
  useMutationObserver(root, measure, { attributes: true, subtree: true })

  // A CSS-only reveal (Bulma's `is-hoverable` dropdown) mutates nothing and
  // resizes nothing, so pointer movement is the only signal that the frame has
  // to grow around a menu.
  useEventListener(root, ['pointerover', 'pointerout'], measure)

  useEventListener(window, 'message', (event: MessageEvent) => {
    if (event.source !== window.parent) return

    switch (event.data?.type) {
      case 'v0:sandbox:theme': {
        document.documentElement.dataset.theme = event.data.dark ? 'dark' : 'light'
        break
      }
      case 'v0:sandbox:box': {
        box = event.data.box
        pin()
        break
      }
    }
  })

  // The frame loads lazily, so the theme carried on the URL can be stale by the
  // time it does — ask the parent for the current one.
  onMounted(() => send({ type: 'v0:sandbox:ready' }))
</script>

<template>
  <div ref="root" class="sandbox">
    <component :is v-if="is" />

    <div v-else class="notification is-danger">
      No example found for <code>{{ name }}</code>.
    </div>
  </div>
</template>

<style>
  /* This document deliberately loads no UnoCSS — utility classes are not
     available here, and anything beyond frame padding belongs to Bulma. */
  .sandbox {
    padding: 1.5rem;
  }
</style>
