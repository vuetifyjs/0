<script setup lang="ts">
  import { easing, Md1Button } from '@paper/md1'

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
      timing: `var(--md1-easing-${name}, ${easing[name]})`,
      path: `M 0 100 C ${x1 * 100} ${100 - y1 * 100}, ${x2 * 100} ${100 - y2 * 100}, 100 0`,
      handles: `M 0 100 L ${x1 * 100} ${100 - y1 * 100} M 100 0 L ${x2 * 100} ${100 - y2 * 100}`,
    }
  })

  const played = shallowRef(false)
</script>

<template>
  <div class="md1-docs-motion-easing">
    <Md1Button variant="raised" @click="played = !played">{{ played ? 'Reset' : 'Play' }}</Md1Button>

    <div v-for="curve in curves" :key="curve.name" class="md1-docs-motion-easing-row">
      <svg aria-hidden="true" class="md1-docs-motion-easing-plot" viewBox="-4 -4 108 108">
        <rect class="md1-docs-motion-easing-frame" height="100" width="100" />

        <path class="md1-docs-motion-easing-handles" :d="curve.handles" />

        <path class="md1-docs-motion-easing-curve" :d="curve.path" />
      </svg>

      <div class="md1-docs-motion-easing-text">
        <span class="md1-type-body-2">{{ curve.name }}</span>

        <span class="md1-type-caption">{{ curve.use }}</span>

        <div class="md1-docs-motion-easing-track">
          <span
            class="md1-docs-motion-easing-dot"
            :data-played="played || undefined"
            :style="{ transitionTimingFunction: curve.timing }"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style>
  .md1-docs-motion-easing {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--md1-spacing-2, 16px);
    color: var(--md1-text-primary, rgba(0, 0, 0, 0.87));
  }

  .md1-docs-motion-easing-row {
    display: flex;
    align-items: center;
    gap: var(--md1-spacing-2, 16px);
    width: 100%;
  }

  .md1-docs-motion-easing-plot {
    flex: none;
    width: 72px;
    height: 72px;
    overflow: visible;
  }

  .md1-docs-motion-easing-frame {
    fill: none;
    stroke: var(--md1-divider, rgba(0, 0, 0, 0.12));
  }

  .md1-docs-motion-easing-handles {
    fill: none;
    stroke: var(--md1-text-disabled, rgba(0, 0, 0, 0.38));
    stroke-dasharray: 2 3;
  }

  .md1-docs-motion-easing-curve {
    fill: none;
    stroke: var(--md1-text-primary, rgba(0, 0, 0, 0.87));
    stroke-width: 3;
  }

  .md1-docs-motion-easing-text {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 4px;
    min-width: 0;
  }

  .md1-docs-motion-easing-track {
    position: relative;
    height: 16px;
    margin-top: 4px;
    border-bottom: 1px solid var(--md1-divider, rgba(0, 0, 0, 0.12));
  }

  /* 1200 ms is a docs-only slow motion so the shape of each curve can be followed; the tokens carry no duration. */
  .md1-docs-motion-easing-dot {
    position: absolute;
    top: 0;
    left: 0;
    width: 16px;
    height: 16px;
    background: var(--md1-accent, #FF4081);
    border-radius: 50%;
    transition-property: left;
    transition-duration: 1200ms;
  }

  .md1-docs-motion-easing-dot[data-played] {
    left: calc(100% - 16px);
  }

  @media (prefers-reduced-motion: reduce) {
    .md1-docs-motion-easing-dot {
      transition-duration: 0ms;
    }
  }
</style>
