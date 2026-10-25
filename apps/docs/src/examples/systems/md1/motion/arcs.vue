<script setup lang="ts">
  import { easing, Md1Button, Md1Toolbar } from '@paper/md1'
  import { shallowRef } from 'vue'

  // Evaluate a CSS cubic-bezier(x1, y1, x2, y2) at time t, so the example can draw the path the dot takes.
  function curve (points: readonly number[], t: number) {
    const [x1 = 0, y1 = 0, x2 = 1, y2 = 1] = points

    function axis (a: number, b: number, s: number) {
      return 3 * a * s * (1 - s) ** 2 + 3 * b * s ** 2 * (1 - s) + s ** 3
    }

    // Solve x(s) = t by bisection; the curve is monotonic in x.
    let low = 0
    let high = 1

    for (let step = 0; step < 24; step++) {
      const mid = (low + high) / 2

      if (axis(x1, x2, mid) < t) low = mid
      else high = mid
    }

    return axis(y1, y2, (low + high) / 2)
  }

  function parse (value: string) {
    return value.replace(/[^\d.,]/g, '').split(',').map(Number)
  }

  const decelerate = parse(easing.decelerate)
  const standard = parse(easing.standard)

  // The leading axis decelerates and the other follows the standard curve, which starts later:
  // moving up, the horizontal axis leads (shallow, then steep); moving down, the vertical axis leads (steep, then shallow).
  function path (lead: 'x' | 'y') {
    const points: string[] = []

    for (let step = 0; step <= 40; step++) {
      const t = step / 40
      const x = curve(lead === 'x' ? decelerate : standard, t)
      const y = curve(lead === 'y' ? decelerate : standard, t)

      points.push(`${(x * 160 + 20).toFixed(1)},${(lead === 'x' ? 180 - y * 160 : 20 + y * 160).toFixed(1)}`)
    }

    return `M${points.join(' L')}`
  }

  const arcs = [
    { id: 'up', label: 'Diagonally upward', path: path('x') },
    { id: 'down', label: 'Diagonally downward', path: path('y') },
  ]

  const moved = shallowRef(false)
  const hidden = shallowRef(false)
</script>

<template>
  <div class="md1-docs-motion-arcs-stack">
    <Md1Button variant="raised" @click="moved = !moved">{{ moved ? 'Back' : 'Move' }}</Md1Button>

    <div class="md1-docs-motion-arcs">
      <figure v-for="arc in arcs" :key="arc.id" class="md1-docs-motion-arcs-figure">
        <div class="md1-docs-motion-arcs-stage" :data-arc="arc.id" :data-moved="moved || undefined">
          <svg aria-hidden="true" class="md1-docs-motion-arcs-path" viewBox="0 0 200 200">
            <path :d="arc.path" />
          </svg>

          <!-- Two layers, one per axis, each on its own curve: the sum of the two is the arc. -->
          <span class="md1-docs-motion-arcs-x">
            <span class="md1-docs-motion-arcs-y">
              <span class="md1-docs-motion-arcs-dot md1-elevation-2" />
            </span>
          </span>
        </div>

        <figcaption class="md1-docs-motion-arcs-caption">{{ arc.label }}</figcaption>
      </figure>

      <figure class="md1-docs-motion-arcs-figure">
        <div class="md1-docs-motion-arcs-stage md1-docs-motion-arcs-screen">
          <p class="md1-type-body-1 md1-docs-motion-arcs-copy">The bar steps off the screen and comes back through the same edge.</p>

          <div class="md1-docs-motion-arcs-bar" :data-hidden="hidden || undefined">
            <Md1Toolbar>
              <Md1Toolbar.Actions>
                <Md1Button aria-label="Archive" icon="inbox" />

                <Md1Button aria-label="Delete" icon="delete" />
              </Md1Toolbar.Actions>
            </Md1Toolbar>
          </div>
        </div>

        <figcaption class="md1-docs-motion-arcs-caption">
          <Md1Button @click="hidden = !hidden">{{ hidden ? 'Return' : 'Leave' }}</Md1Button>
        </figcaption>
      </figure>
    </div>
  </div>
</template>

<style>
  .md1-docs-motion-arcs-stack {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--md1-spacing-2, 16px);
    width: 100%;
  }

  .md1-docs-motion-arcs {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: var(--md1-spacing-3, 24px);
  }

  .md1-docs-motion-arcs-figure {
    margin: 0;
  }

  .md1-docs-motion-arcs-stage {
    position: relative;
    width: 200px;
    height: 200px;
    overflow: hidden;
    border-radius: var(--md1-radius, 2px);
    background: var(--md1-surface, #FFFFFF);
    box-shadow: var(--md1-elevation-1);
  }

  .md1-docs-motion-arcs-path {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    fill: none;
    stroke: var(--md1-divider, rgba(0, 0, 0, 0.12));
    stroke-width: 2;
    stroke-dasharray: 4 4;
  }

  /* The dot's centre starts at (20, 180) going up and (20, 20) going down, and travels 160 dp on each axis. */
  .md1-docs-motion-arcs-x,
  .md1-docs-motion-arcs-y {
    position: absolute;
    inset: 0;
    transition-duration: var(--md1-duration-standard, 300ms);
    transition-property: translate;
  }

  .md1-docs-motion-arcs-dot {
    position: absolute;
    inset-block-start: 8px;
    inset-inline-start: 8px;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: var(--md1-accent, #FF4081);
  }

  .md1-docs-motion-arcs-stage[data-arc='up'] .md1-docs-motion-arcs-dot {
    inset-block-start: 168px;
  }

  .md1-docs-motion-arcs-stage[data-moved] .md1-docs-motion-arcs-x {
    translate: 160px 0;
  }

  .md1-docs-motion-arcs-stage[data-arc='up'][data-moved] .md1-docs-motion-arcs-y {
    translate: 0 -160px;
  }

  .md1-docs-motion-arcs-stage[data-arc='down'][data-moved] .md1-docs-motion-arcs-y {
    translate: 0 160px;
  }

  /*
   * Ascending, the horizontal axis leads; descending, the vertical one does.
   * Each figure ascends one way and descends on the way back, so the curves swap with the direction.
   */
  .md1-docs-motion-arcs-stage:is([data-arc='up'][data-moved], [data-arc='down']:not([data-moved])) .md1-docs-motion-arcs-x,
  .md1-docs-motion-arcs-stage:is([data-arc='up']:not([data-moved]), [data-arc='down'][data-moved]) .md1-docs-motion-arcs-y {
    transition-timing-function: var(--md1-easing-decelerate, cubic-bezier(0, 0, 0.2, 1));
  }

  .md1-docs-motion-arcs-stage:is([data-arc='up'][data-moved], [data-arc='down']:not([data-moved])) .md1-docs-motion-arcs-y,
  .md1-docs-motion-arcs-stage:is([data-arc='up']:not([data-moved]), [data-arc='down'][data-moved]) .md1-docs-motion-arcs-x {
    transition-timing-function: var(--md1-easing-standard, cubic-bezier(0.4, 0, 0.2, 1));
  }

  .md1-docs-motion-arcs-screen {
    background: var(--md1-background, #FAFAFA);
  }

  .md1-docs-motion-arcs-copy {
    margin: 0;
    padding: var(--md1-spacing-2, 16px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }

  /* Leaving for now: the sharp curve. Coming back through the same edge: the deceleration curve. */
  .md1-docs-motion-arcs-bar {
    position: absolute;
    inset-inline: 0;
    inset-block-end: 0;
    transition: translate var(--md1-duration-standard, 300ms) var(--md1-easing-decelerate, cubic-bezier(0, 0, 0.2, 1));
  }

  .md1-docs-motion-arcs-bar[data-hidden] {
    translate: 0 100%;
    transition-timing-function: var(--md1-easing-sharp, cubic-bezier(0.4, 0, 0.6, 1));
  }

  .md1-docs-motion-arcs-caption {
    display: flex;
    justify-content: center;
    min-height: 36px;
    margin-top: var(--md1-spacing-1, 8px);
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-caption-size, 12px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
    text-align: center;
  }

  body[data-reduced-motion='reduce'] :is(.md1-docs-motion-arcs-x, .md1-docs-motion-arcs-y, .md1-docs-motion-arcs-bar) {
    transition: none;
  }

  @media (prefers-reduced-motion: reduce) {
    body:not([data-reduced-motion='no-preference']) :is(.md1-docs-motion-arcs-x, .md1-docs-motion-arcs-y, .md1-docs-motion-arcs-bar) {
      transition: none;
    }
  }
</style>
