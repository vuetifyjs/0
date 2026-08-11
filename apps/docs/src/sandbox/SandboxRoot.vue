<script setup lang="ts">
  // Framework
  import { useEventListener, useMutationObserver, useResizeObserver } from '@vuetify/v0'

  // Utilities
  import { onMounted, useTemplateRef } from 'vue'

  // Types
  import type { Component } from 'vue'

  const {
    is,
    name,
    themes = { light: 'light', dark: 'dark' },
  } = defineProps<{
    /** Resolved example component, or undefined when the query names nothing. */
    is?: Component
    /** Example path from the query string, shown when resolution fails. */
    name: string
    /**
     * What each scheme is called in `data-theme`. The docs page only ever speaks
     * in light and dark; a design system is free to name its themes something
     * else, and Emerald does (`emerald` / `emerald-dark`) because those are the
     * ids its stylesheet keys on. Defaulting to the scheme names themselves
     * keeps every system that agrees with the docs — Bulma — untouched.
     *
     * Upstream candidate: this is the one piece of the sandbox that is not
     * system-agnostic, and it belongs next to the entry that owns the frame.
     */
    themes?: Record<'light' | 'dark', string>
  }>()

  // Subpixel slack, so a menu flush with the box edge is not read as escaping it.
  const SLACK = 1

  // Breathing room under content the frame has to grow around.
  const PAD = 24

  const root = useTemplateRef<HTMLElement>('root')

  // The DOM is the source of truth for overlay state; this only tracks what the
  // parent has already been told.
  let open = false

  // Observers attach before the first paint and fire on their own initial tick,
  // so without this the first thing the parent hears is the height of a
  // document that has rendered nothing — frame padding and no example — and it
  // holds the box open at that until the real content arrives. Nothing is
  // measurable until mount.
  let ready = false

  // True between asking the parent to promote and the parent confirming it. The
  // frame is mid-flight then — measuring against it would read a box that is
  // about to move.
  let pending = false

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

  // A fixed element that accepts no pointer input anywhere in its subtree is a
  // decoration riding the viewport — a drop indicator tracking a drag — not an
  // overlay. Inline, the frame's viewport IS the example box, so it already
  // paints exactly where it belongs; promoting for it would pin and clip the
  // frame mid-drag, which reads as the board jumping out of its box. The
  // subtree check is what keeps a snackbar portal promoting: the portal itself
  // is `pointer-events: none`, but the snackbars inside it are interactive.
  function inert (el: HTMLElement): boolean {
    if (getComputedStyle(el).pointerEvents !== 'none') return false

    for (const node of el.querySelectorAll<HTMLElement>('*')) {
      if (getComputedStyle(node).pointerEvents !== 'none') return false
    }

    return true
  }

  // Classification contract — a DOM fact, read fresh on every measurement, so
  // the same layout always classifies the same way whichever observer noticed
  // it. Nothing here consults events or prior state.
  //
  //   overlay  something is laid out against the viewport (a modal and its
  //            backdrop). Meant to cover everything, page chrome included.
  //   float    out-of-flow content spilled past the example's box AND is owned
  //            by component state — Bulma marks that with `is-active`, which
  //            only this package's JS sets. It belongs to the page, so page
  //            chrome occludes it.
  //   grow     everything else, including a pure-CSS `:hover` reveal
  //            (`is-hoverable`), which carries no `is-active` anywhere. The
  //            frame makes room for it instead of being promoted.
  //
  // `escaping` is reported either way: promotion clips to it, growth sizes
  // around it.
  function floats (el: HTMLElement): { tier: 'overlay' | 'float' | null, rects: Rect[], escaping: Rect[] } {
    const box = el.getBoundingClientRect()
    const escaping: Rect[] = []

    let tier: 'overlay' | 'float' | null = null

    for (const node of el.querySelectorAll<HTMLElement>('*')) {
      if (!node.checkVisibility()) continue

      const position = getComputedStyle(node).position

      if (position !== 'fixed' && position !== 'absolute') continue

      if (position === 'fixed' && inert(node)) continue

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

      escaping.push(toRect(rect))

      if (position === 'fixed') tier = 'overlay'
      else if (node.closest('.is-active')) tier ??= 'float'
    }

    return {
      tier,
      rects: tier ? [toRect(box), ...escaping] : [],
      escaping,
    }
  }

  function measure () {
    const el = root.value

    if (!el || !ready || pending) return

    const found = floats(el)
    const tier = found.tier

    // Never ask to be promoted from an unpinned state: without a box to pin
    // against, the content would land at the frame's corner the moment the
    // frame becomes the viewport.
    const overlay = !!tier && (open || !!box)

    if (overlay !== open) {
      open = overlay
      pending = overlay

      document.documentElement.toggleAttribute('data-overlay', overlay)

      // Order matters in both directions, and it is not symmetric.
      //
      // Opening: pin BEFORE telling the parent, and re-read the regions AFTER
      // pinning. The pin moves this root from the frame's own origin to page
      // coordinates, and those numbers are what the parent clips the promoted
      // frame to — send the pre-pin ones and the clip lands at the viewport
      // corner for a frame or two, which is the flash.
      //
      // Closing: stay pinned. Unpinning here would put the content back at the
      // frame's origin while the frame is still the viewport — the same flash
      // mirrored. The parent's box message, posted once it has demoted the
      // frame, is the ack that it is safe to let go.
      if (overlay) {
        pin()

        send({ type: 'v0:sandbox:overlay', open: true, tier, rects: floats(el).rects })

        // Never stay gated on a parent that went quiet: a stuck `pending` would
        // leave an invisible full-viewport frame swallowing the page.
        setTimeout(() => {
          pending = false
        }, 300)
      } else {
        send({ type: 'v0:sandbox:overlay', open: false, tier, rects: [] })

        // …and never stay pinned on one either.
        setTimeout(pin, 300)
      }

      return
    }

    // While promoted the frame is the viewport — reporting a height back would
    // collapse the placeholder the docs page is holding open in the flow. The
    // regions still have to keep up: a menu resizes under its own content.
    if (overlay) {
      send({ type: 'v0:sandbox:rects', tier, rects: found.rects })

      return
    }

    // Not promoted, so anything hanging out of the flow — a hover-revealed menu
    // — has to be made room for, or the frame clips it.
    let height = el.offsetHeight

    for (const rect of found.escaping) {
      height = Math.max(height, Math.ceil(rect.top + rect.height) + PAD)
    }

    // `grown` marks a height that only exists because something is spilling out
    // of the box right now. The docs page still applies it — the frame has to
    // make room — but it must not remember it as what this example rests at.
    send({ type: 'v0:sandbox:size', height, grown: found.escaping.length > 0 })
  }

  useResizeObserver(root, () => measure())

  // Opening an overlay changes no layout the ResizeObserver can see — the class
  // flip that reveals it is the only signal.
  useMutationObserver(root, () => measure(), { attributes: true, subtree: true })

  // A CSS-only reveal (Bulma's `is-hoverable` dropdown) mutates nothing and
  // resizes nothing, so pointer movement is the only signal that it happened.
  // Detection only — the classification above never asks how a measurement was
  // triggered. Deferred a frame because moving from the trigger onto its menu
  // fires pointerout before the pointer lands, and measuring mid-gap would size
  // the frame around a menu that is about to still be there.
  useEventListener(root, ['pointerover', 'pointerout'], () => requestAnimationFrame(() => measure()))

  useEventListener(window, 'message', (event: MessageEvent) => {
    if (event.source !== window.parent) return

    switch (event.data?.type) {
      case 'v0:sandbox:theme': {
        document.documentElement.dataset.theme = event.data.dark ? themes.dark : themes.light
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
  // time it does — ask the parent for the current one. The example is resolved
  // before the app mounts, so this is also the first moment there is a real
  // height to report: measure once here rather than wait for an observer, which
  // would otherwise only fire again if the example happened to change size.
  onMounted(() => {
    ready = true

    send({ type: 'v0:sandbox:ready' })
    measure()
  })
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
