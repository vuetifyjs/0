<script setup lang="ts">
  import { easing, QuButton } from '@paper/quantum'

  import { shallowRef } from 'vue'

  const uses: Record<keyof typeof easing, string> = {
    standard: 'On-screen movement and every surface transformation',
    decelerate: 'Entering the screen at full velocity',
    accelerate: 'Leaving the screen for good',
    sharp: 'Leaving the screen, may return',
  }

  // The four control points of each token, read back from the cubic-bezier() string the package ships.
  const curves = (Object.keys(easing) as (keyof typeof easing)[]).map(name => {
    const [x1, y1, x2, y2] = (easing[name].match(/[\d.]+/g) ?? []).map(Number)

    return {
      name,
      use: uses[name],
      timing: `var(--quantum-easing-${name}, ${easing[name]})`,
      path: `M 0 100 C ${x1 * 100} ${100 - y1 * 100}, ${x2 * 100} ${100 - y2 * 100}, 100 0`,
      handles: `M 0 100 L ${x1 * 100} ${100 - y1 * 100} M 100 0 L ${x2 * 100} ${100 - y2 * 100}`,
    }
  })

  const played = shallowRef(false)
</script>

<template>
  <div class="quantum-docs-motion-easing">
    <QuButton variant="raised" @click="played = !played">{{ played ? 'Reset' : 'Play' }}</QuButton>

    <div v-for="curve in curves" :key="curve.name" class="quantum-docs-motion-easing-row">
      <svg aria-hidden="true" class="quantum-docs-motion-easing-plot" viewBox="-4 -4 108 108">
        <rect class="quantum-docs-motion-easing-frame" height="100" width="100" />

        <path class="quantum-docs-motion-easing-handles" :d="curve.handles" />

        <path class="quantum-docs-motion-easing-curve" :d="curve.path" />
      </svg>

      <div class="quantum-docs-motion-easing-text">
        <span class="quantum-type-body-2">{{ curve.name }}</span>

        <span class="quantum-type-caption">{{ curve.use }}</span>

        <div class="quantum-docs-motion-easing-track">
          <span
            class="quantum-docs-motion-easing-dot"
            :data-played="played || undefined"
            :style="{ transitionTimingFunction: curve.timing }"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style>
  .quantum-docs-motion-easing {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--quantum-spacing-2, 16px);
    color: var(--quantum-text-primary, rgba(0, 0, 0, 0.87));
  }

  .quantum-docs-motion-easing-row {
    display: flex;
    align-items: center;
    gap: var(--quantum-spacing-2, 16px);
    width: 100%;
  }

  .quantum-docs-motion-easing-plot {
    flex: none;
    width: 72px;
    height: 72px;
    overflow: visible;
  }

  .quantum-docs-motion-easing-frame {
    fill: none;
    stroke: var(--quantum-divider, rgba(0, 0, 0, 0.12));
  }

  .quantum-docs-motion-easing-handles {
    fill: none;
    stroke: var(--quantum-text-disabled, rgba(0, 0, 0, 0.38));
    stroke-dasharray: 2 3;
  }

  .quantum-docs-motion-easing-curve {
    fill: none;
    stroke: var(--quantum-text-primary, rgba(0, 0, 0, 0.87));
    stroke-width: 3;
  }

  .quantum-docs-motion-easing-text {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 4px;
    min-width: 0;
  }

  .quantum-docs-motion-easing-track {
    position: relative;
    height: 16px;
    margin-top: 4px;
    border-bottom: 1px solid var(--quantum-divider, rgba(0, 0, 0, 0.12));
  }

  /* 1200 ms is a docs-only slow motion so the shape of each curve can be followed; the tokens carry no duration. */
  .quantum-docs-motion-easing-dot {
    position: absolute;
    top: 0;
    left: 0;
    width: 16px;
    height: 16px;
    background: var(--quantum-accent, #FF4081);
    border-radius: 50%;
    transition-property: left;
    transition-duration: 1200ms;
  }

  .quantum-docs-motion-easing-dot[data-played] {
    left: calc(100% - 16px);
  }

  @media (prefers-reduced-motion: reduce) {
    .quantum-docs-motion-easing-dot {
      transition-duration: 0ms;
    }
  }
</style>
