<script setup lang="ts">
  // Utilities
  import { toRef } from 'vue'

  export interface AppRainbowTextProps {
    /** Color stops spread across the text — each letter lands on a different hue. */
    colors?: string[]
    /** Seconds to wait before starting the sheen animation (stagger multiple instances). */
    delay?: number
    /** Seconds for one full cycle (a quick sheen sweep, then a pause before the next). */
    duration?: number
  }

  const {
    colors = ['#ff2d55', '#ff9500', '#ffcc00', '#34c759', '#5ac8fa', '#af52de'],
    delay = 2,
    duration = 4,
  } = defineProps<AppRainbowTextProps>()

  // A soft-edged white glint that travels across; sits above the static rainbow.
  const SHEEN = 'linear-gradient(120deg, transparent 40%, rgba(255, 255, 255, 0.85) 50%, transparent 60%)'

  // Layer order: sheen on top, static rainbow underneath. Both clipped to the text.
  const layers = toRef(() => `${SHEEN}, linear-gradient(90deg, ${colors.join(', ')})`)
</script>

<template>
  <span
    class="app-rainbow-text"
    :style="{ backgroundImage: layers, animationDuration: `${duration}s`, animationDelay: `${delay}s` }"
  >
    <slot />
  </span>
</template>

<style scoped>
  .app-rainbow-text {
    background-repeat: no-repeat;
    /* sheen layer is double-width so it can travel; rainbow fills exactly. */
    background-size: 200% 100%, 100% 100%;
    background-position: 120% 0, 0 0;
    background-clip: text;
    -webkit-background-clip: text;
    /* duration is the single source of truth via the inline binding (the `duration` prop). */
    animation-name: app-rainbow-sheen;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
  }

  /* Only drop the real fill where the clip is supported, so unsupported engines keep legible text. */
  @supports (background-clip: text) or (-webkit-background-clip: text) {
    .app-rainbow-text {
      color: transparent;
      -webkit-text-fill-color: transparent;
    }
  }

  /* Sweep the glint across quickly, then hold it off-screen for the rest of the cycle. */
  @keyframes app-rainbow-sheen {
    0% { background-position: 120% 0, 0 0; }
    12% { background-position: -20% 0, 0 0; }
    100% { background-position: -20% 0, 0 0; }
  }

  /* Reduced motion: static per-letter rainbow, no sheen. */
  @media (prefers-reduced-motion: reduce) {
    .app-rainbow-text {
      animation: none;
      background-position: 120% 0, 0 0;
    }
  }
</style>
