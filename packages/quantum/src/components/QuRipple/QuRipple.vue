<script lang="ts">
  // Framework
  import { useEventListener } from '@vuetify/v0'

  // Composables
  import { useRipple } from '../../composables/useRipple'

  // Utilities
  import { toRef, useTemplateRef } from 'vue'

  export interface QuRippleProps {
    /** The 48 px circle centred on the host and never clipped: the icon toggle's ink (buttons page). */
    unbounded?: boolean
    /** Every ink starts at the host centre, whatever the press position. */
    center?: boolean
  }

  /** A host in any of these states gives no press feedback; v0 roots mark all three. */
  const INERT = '[disabled], [aria-disabled="true"], [data-disabled]'

  /** The keys that activate a native button. Both draw the centred ink the spec gives keyboard presses. */
  const KEYS = new Set([' ', 'Enter'])
</script>

<script setup lang="ts">
  defineOptions({ name: 'QuRipple' })

  const { unbounded = false, center = false } = defineProps<QuRippleProps>()

  const root = useTemplateRef<HTMLElement>('root')

  // The interactive root hosting the ripple: QuRipple is always its first child.
  const host = toRef(() => root.value?.parentElement ?? null)

  const ripple = useRipple({
    unbounded: () => unbounded,
    center: () => center,
  })

  function inert (el: HTMLElement): boolean {
    return el.matches(INERT)
  }

  function onPointerdown (event: PointerEvent) {
    const el = host.value

    if (!el || event.button !== 0 || inert(el)) return

    const rect = el.getBoundingClientRect()

    // The ink layer fills the host's padding box, so the origin steps inside the border.
    ripple.start(
      { width: rect.width, height: rect.height },
      { x: event.clientX - rect.left - el.clientLeft, y: event.clientY - rect.top - el.clientTop },
    )
  }

  function onKeydown (event: KeyboardEvent) {
    const el = host.value

    if (!el || event.repeat || event.target !== el || !KEYS.has(event.key) || inert(el)) return

    const rect = el.getBoundingClientRect()

    ripple.start({ width: rect.width, height: rect.height })
  }

  function onKeyup (event: KeyboardEvent) {
    if (KEYS.has(event.key)) ripple.end()
  }

  function onRelease () {
    ripple.end()
  }

  useEventListener(host, 'pointerdown', onPointerdown)
  useEventListener(host, ['pointerup', 'pointercancel', 'pointerleave'], onRelease)
  useEventListener(host, 'keydown', onKeydown)
  useEventListener(host, 'keyup', onKeyup)
  // Enter on a button that moves focus (a dialog activator) never sees its keyup here.
  useEventListener(host, 'blur', onRelease)
</script>

<template>
  <span
    ref="root"
    aria-hidden="true"
    class="quantum-ripple"
    :data-unbounded="unbounded || undefined"
  >
    <span
      v-for="ink in ripple.inks.value"
      :key="ink.id"
      class="quantum-ripple__ink"
      :data-state="ink.state"
      :style="{
        left: `${ink.x - ink.size / 2}px`,
        top: `${ink.y - ink.size / 2}px`,
        width: `${ink.size}px`,
        height: `${ink.size}px`,
      }"
      @animationend="ripple.settle(ink.id)"
    />
  </span>
</template>

<!--
  Unscoped, like every Quantum stylesheet. The host owns `position: relative`
  (the ripple is absolutely positioned against it) and positions the children
  it wants painted above the ink; QuRipple sets nothing on the host.
-->
<style>
  .quantum-ripple {
    position: absolute;
    inset: 0;
    overflow: hidden;
    border-radius: inherit;
    /* The spec's pressed overlay is an absolute grey, so the ink does not take the host's ink colour. */
    color: var(--quantum-pressed, rgba(153, 153, 153, 0.4));
    pointer-events: none;
  }

  .quantum-ripple[data-unbounded] {
    overflow: visible;
  }

  /* The resting values are the landed state: an ink with no animation is the static pressed fill. */
  .quantum-ripple__ink {
    position: absolute;
    border-radius: 50%;
    background: currentColor;
    transform: scale(1);
    opacity: 1;
  }

  .quantum-ripple__ink[data-state='in'] {
    animation: quantum-ripple-in var(--quantum-ripple-duration, var(--quantum-duration-standard, 300ms)) var(--quantum-easing-standard, cubic-bezier(0.4, 0, 0.2, 1)) forwards;
  }

  .quantum-ripple__ink[data-state='out'] {
    animation: quantum-ripple-out var(--quantum-duration-leave, 195ms) var(--quantum-easing-standard, cubic-bezier(0.4, 0, 0.2, 1)) forwards;
  }

  @keyframes quantum-ripple-in {
    from {
      transform: scale(0);
      opacity: 0;
    }

    30% {
      opacity: 1;
    }

    to {
      transform: scale(1);
      opacity: 1;
    }
  }

  @keyframes quantum-ripple-out {
    to {
      opacity: 0;
    }
  }

  /*
   * Reduced motion: the ink is the static pressed fill and QuRipple removes it
   * on release without waiting for an animation. The plugin's body attribute
   * wins over the OS query, so `mode: 'never'` keeps the reaction.
   */
  body[data-reduced-motion='reduce'] .quantum-ripple__ink {
    animation: none;
  }

  @media (prefers-reduced-motion: reduce) {
    body:not([data-reduced-motion='no-preference']) .quantum-ripple__ink {
      animation: none;
    }
  }
</style>
