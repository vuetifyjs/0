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

  // Subpixel slack, so a menu flush with the box edge is not read as escaping it.
  const SLACK = 1

  // Breathing room under content the frame has to grow around.
  const PAD = 24

  const root = useTemplateRef<HTMLElement>('root')

  // The DOM is the source of truth for overlay state; this only tracks what the
  // parent has already been told.
  let open = false

  // True between asking the parent to promote and the parent confirming it. The
  // frame is mid-flight then — measuring against it would read a box that is
  // about to move, and a pointer-driven read could bounce the overlay back off.
  let pending = false

  // True while a pointer-revealed surface is showing: the frame grows around it
  // and never promotes, for as long as it stays open.
  let growing = false

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

  type Rect = { top: number, left: number, width: number, height: number }

  function toRect (rect: DOMRect): Rect {
    return { top: rect.top, left: rect.left, width: rect.width, height: rect.height }
  }

  // Floating content has to escape the frame, not stretch it: on a real page an
  // open menu paints over whatever follows it, and growing the example box
  // instead would reflow the docs around a transient piece of UI.
  //
  // Returns the regions the promoted frame is allowed to paint — the example's
  // own box plus every surface that escapes it — and which tier that is:
  //
  //   overlay  a viewport-laid-out surface is up (a modal and its backdrop).
  //            It is meant to cover everything, page chrome included.
  //   float    only in-flow content spilled out (a dropdown menu). It belongs
  //            to the page, so page chrome should occlude it the way a sticky
  //            navbar occludes a Bulma menu.
  function floats (el: HTMLElement): { tier: 'overlay' | 'float' | null, rects: Rect[] } {
    const box = el.getBoundingClientRect()
    const rects: Rect[] = []

    let tier: 'overlay' | 'float' | null = null

    for (const node of el.querySelectorAll<HTMLElement>('*')) {
      if (!node.checkVisibility()) continue

      const position = getComputedStyle(node).position

      if (position !== 'fixed' && position !== 'absolute') continue

      const rect = node.getBoundingClientRect()

      // Laid out against the viewport (a modal backdrop), or out-of-flow and
      // spilling past the box the example occupies inline. A menu that fits
      // inside the box needs nothing — it is already painted there.
      const escapes = position === 'fixed'
        || rect.top < box.top - SLACK
        || rect.bottom > box.bottom + SLACK
        || rect.left < box.left - SLACK
        || rect.right > box.right + SLACK

      if (!escapes) continue

      rects.push(toRect(rect))

      if (position === 'fixed') tier = 'overlay'
      else tier ??= 'float'
    }

    return tier ? { tier, rects: [toRect(box), ...rects] } : { tier: null, rects: [] }
  }

  // Promotion is only ever entered from a state change the DOM reported —
  // never from pointer movement. Bulma's `is-hoverable` dropdown opens in pure
  // CSS, and promoting on hover fights the pointer: the frame relayouts under
  // the cursor mid-gesture and the page comes apart. Hover-revealed content
  // grows the frame instead, which is what it did before promotion existed.
  //
  // The mode has to latch for the whole reveal. Growing the frame does not grow
  // this root, so the surface still reads as escaping it, and the resize this
  // very growth triggers would promote on the rebound.
  function measure (hover = false) {
    const el = root.value

    if (!el || pending) return

    const { tier, rects } = floats(el)

    if (!tier) growing = false
    else if (hover && !open) growing = true

    const overlay = !!tier && !growing

    if (overlay !== open) {
      open = overlay
      pending = overlay

      document.documentElement.toggleAttribute('data-overlay', overlay)
      pin()
      send({ type: 'v0:sandbox:overlay', open: overlay, tier, rects })

      // Never stay gated on a parent that went quiet: a stuck `pending` would
      // leave an invisible full-viewport frame swallowing the page.
      if (overlay) setTimeout(() => {
        pending = false
      }, 300)

      return
    }

    // While promoted the frame is the viewport — reporting a height back would
    // collapse the placeholder the docs page is holding open in the flow. The
    // regions still have to keep up: a menu resizes under its own content.
    if (overlay) {
      send({ type: 'v0:sandbox:rects', tier, rects })

      return
    }

    // Not promoted, so anything hanging out of the flow — a hover-revealed menu
    // — has to be made room for, or the frame clips it.
    let height = el.offsetHeight

    for (const rect of rects.slice(1)) {
      height = Math.max(height, Math.ceil(rect.top + rect.height) + PAD)
    }

    send({ type: 'v0:sandbox:size', height })
  }

  useResizeObserver(root, () => measure())

  // Opening an overlay changes no layout the ResizeObserver can see — the class
  // flip that reveals it is the only signal.
  useMutationObserver(root, () => measure(), { attributes: true, subtree: true })

  // A CSS-only reveal (Bulma's `is-hoverable` dropdown) mutates nothing and
  // resizes nothing, so pointer movement is the only signal that a menu opened.
  // Deferred a frame: moving between the trigger and its menu fires pointerout
  // before the pointer lands, and reading `:hover` mid-gap would close what the
  // reader is reaching for.
  useEventListener(root, ['pointerover', 'pointerout'], () => requestAnimationFrame(() => measure(true)))

  useEventListener(window, 'message', (event: MessageEvent) => {
    if (event.source !== window.parent) return

    switch (event.data?.type) {
      case 'v0:sandbox:theme': {
        document.documentElement.dataset.theme = event.data.dark ? 'dark' : 'light'
        break
      }
      // Also the parent's acknowledgement that the frame has settled: re-pin
      // against the fresh box, then re-read, in case the pointer left while the
      // promotion was in flight.
      case 'v0:sandbox:box': {
        box = event.data.box
        pending = false
        pin()
        measure()
        break
      }
      // The frame is clipped to the reported regions, so a click on the docs
      // page never reaches this document. Replaying it here lets v0's
      // click-outside close whatever is open.
      case 'v0:sandbox:dismiss': {
        document.documentElement.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }))
        document.documentElement.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }))
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
