<script setup lang="ts">
  import { Md1Icon, Md1Switch, Md1ToggleButtons } from '@paper/md1'
  import { ref, shallowRef, toRef } from 'vue'

  import type { Md1IconName } from '@paper/md1'

  const ROLES: Md1IconName[] = ['settings', 'photo', 'email', 'lock']

  const glyph = shallowRef<Md1IconName>('settings')
  const layers = ref<string[]>(['grid', 'keylines', 'live'])
  const dense = shallowRef(false)

  // The trim area in dp: 24, or 20 for dense layouts. The live area sits
  // inside it with 2 dp all round, 20 x 20 or 16 x 16.
  const trim = toRef(() => dense.value ? 20 : 24)
  const live = toRef(() => trim.value - 4)
  const centre = toRef(() => trim.value / 2)

  // Keyline shapes on the 24 dp grid, centred: square 18, circle 20,
  // vertical rectangle 16 x 20, horizontal rectangle 20 x 16. The dense grid
  // scales them with its live area, 16 / 20.
  const scale = toRef(() => live.value / 20)

  const keylines = toRef(() => {
    const c = centre.value
    const k = scale.value

    return {
      square: { x: c - 9 * k, y: c - 9 * k, size: 18 * k },
      circle: { r: 10 * k },
      vertical: { x: c - 8 * k, y: c - 10 * k, width: 16 * k, height: 20 * k },
      horizontal: { x: c - 10 * k, y: c - 8 * k, width: 20 * k, height: 16 * k },
    }
  })

  // One line per dp, drawn on the 800% stage.
  const lines = toRef(() => Array.from({ length: trim.value - 1 }, (_, index) => index + 1))

  // Composition: each keyline shape with a glyph drawn on it.
  const COMPOSITION = [
    { name: 'check-box', shape: 'square', caption: 'Square, 18 dp' },
    { name: 'account-circle', shape: 'circle', caption: 'Circle, 20 dp' },
    { name: 'lock', shape: 'vertical', caption: 'Vertical rectangle, 16 x 20 dp' },
    { name: 'email', shape: 'horizontal', caption: 'Horizontal rectangle, 20 x 16 dp' },
  ] as const satisfies readonly { name: Md1IconName, shape: string, caption: string }[]
</script>

<template>
  <div class="md1-docs-icon-grid-stack">
    <div class="md1-docs-icon-grid-controls">
      <Md1ToggleButtons v-model="glyph" label="Glyph" mandatory>
        <Md1ToggleButtons.Item v-for="role in ROLES" :key="role" :aria-label="role" :value="role">
          <Md1Icon :name="role" />
        </Md1ToggleButtons.Item>
      </Md1ToggleButtons>

      <Md1ToggleButtons v-model="layers" label="Layers" multiple>
        <Md1ToggleButtons.Item value="grid">Grid</Md1ToggleButtons.Item>

        <Md1ToggleButtons.Item value="keylines">Keylines</Md1ToggleButtons.Item>

        <Md1ToggleButtons.Item value="live">Live area</Md1ToggleButtons.Item>
      </Md1ToggleButtons>

      <Md1Switch v-model="dense" label="Dense, 20 dp" />
    </div>

    <div class="md1-docs-icon-grid-scales">
      <figure class="md1-docs-icon-grid-figure">
        <div class="md1-docs-icon-grid-stage" :data-dense="dense || undefined">
          <Md1Icon class="md1-docs-icon-grid-glyph" :name="glyph" :size="dense ? 's' : 'm'" />

          <svg
            aria-hidden="true"
            class="md1-docs-icon-grid-overlay"
            :viewBox="`0 0 ${trim} ${trim}`"
          >
            <path
              v-if="layers.includes('live')"
              class="md1-docs-icon-grid-padding"
              :d="`M0 0H${trim}V${trim}H0Z M2 2V${trim - 2}H${trim - 2}V2Z`"
              fill-rule="evenodd"
            />

            <g v-if="layers.includes('grid')" class="md1-docs-icon-grid-lines">
              <line
                v-for="line in lines"
                :key="`x${line}`"
                vector-effect="non-scaling-stroke"
                :x1="line"
                :x2="line"
                :y1="0"
                :y2="trim"
              />

              <line
                v-for="line in lines"
                :key="`y${line}`"
                vector-effect="non-scaling-stroke"
                :x1="0"
                :x2="trim"
                :y1="line"
                :y2="line"
              />
            </g>

            <g v-if="layers.includes('keylines')" class="md1-docs-icon-grid-keylines">
              <line
                vector-effect="non-scaling-stroke"
                x1="0"
                :x2="trim"
                y1="0"
                :y2="trim"
              />

              <line
                vector-effect="non-scaling-stroke"
                x1="0"
                :x2="trim"
                :y1="trim"
                y2="0"
              />

              <line
                vector-effect="non-scaling-stroke"
                :x1="centre"
                :x2="centre"
                y1="0"
                :y2="trim"
              />

              <line
                vector-effect="non-scaling-stroke"
                x1="0"
                :x2="trim"
                :y1="centre"
                :y2="centre"
              />

              <rect
                :height="keylines.square.size"
                vector-effect="non-scaling-stroke"
                :width="keylines.square.size"
                :x="keylines.square.x"
                :y="keylines.square.y"
              />

              <circle :cx="centre" :cy="centre" :r="keylines.circle.r" vector-effect="non-scaling-stroke" />

              <rect v-bind="keylines.vertical" vector-effect="non-scaling-stroke" />

              <rect v-bind="keylines.horizontal" vector-effect="non-scaling-stroke" />
            </g>

            <rect
              v-if="layers.includes('live')"
              class="md1-docs-icon-grid-live"
              :height="live"
              vector-effect="non-scaling-stroke"
              :width="live"
              x="2"
              y="2"
            />
          </svg>
        </div>

        <figcaption class="md1-docs-note">800% scale: {{ trim }} x {{ trim }} dp trim area, {{ live }} x {{ live }} dp live area, 2 dp padding</figcaption>
      </figure>

      <figure class="md1-docs-icon-grid-figure">
        <div class="md1-docs-icon-grid-actual">
          <span class="md1-docs-icon-grid-trim" :data-dense="dense || undefined">
            <Md1Icon class="md1-docs-icon-grid-ink" :name="glyph" :size="dense ? 's' : 'm'" />
          </span>
        </div>

        <figcaption class="md1-docs-note">100% scale</figcaption>
      </figure>
    </div>

    <div class="md1-docs-icon-grid-composition">
      <figure v-for="item in COMPOSITION" :key="item.name" class="md1-docs-icon-grid-figure">
        <div class="md1-docs-icon-grid-tile">
          <Md1Icon class="md1-docs-icon-grid-glyph" :name="item.name" />

          <svg aria-hidden="true" class="md1-docs-icon-grid-overlay" viewBox="0 0 24 24">
            <rect
              v-if="item.shape === 'square'"
              class="md1-docs-icon-grid-shape"
              height="18"
              vector-effect="non-scaling-stroke"
              width="18"
              x="3"
              y="3"
            />

            <circle
              v-else-if="item.shape === 'circle'"
              class="md1-docs-icon-grid-shape"
              cx="12"
              cy="12"
              r="10"
              vector-effect="non-scaling-stroke"
            />

            <rect
              v-else-if="item.shape === 'vertical'"
              class="md1-docs-icon-grid-shape"
              height="20"
              vector-effect="non-scaling-stroke"
              width="16"
              x="4"
              y="2"
            />

            <rect
              v-else
              class="md1-docs-icon-grid-shape"
              height="16"
              vector-effect="non-scaling-stroke"
              width="20"
              x="2"
              y="4"
            />
          </svg>
        </div>

        <figcaption class="md1-docs-note">{{ item.caption }}</figcaption>
      </figure>
    </div>
  </div>
</template>

<style>
  .md1-docs-icon-grid-stack {
    display: flex;
    flex-direction: column;
    gap: var(--md1-spacing-3, 24px);
  }

  .md1-docs-icon-grid-controls {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: var(--md1-spacing-2, 16px);
  }

  .md1-docs-icon-grid-scales,
  .md1-docs-icon-grid-composition {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    justify-content: center;
    gap: var(--md1-spacing-3, 24px);
  }

  .md1-docs-icon-grid-scales {
    align-items: center;
  }

  .md1-docs-icon-grid-figure {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--md1-spacing-1, 8px);
    margin: 0;
    text-align: center;
  }

  /* 800%: the 24 dp trim area at 192 px, the 20 dp dense one at 160 px. */
  .md1-docs-icon-grid-stage,
  .md1-docs-icon-grid-tile {
    position: relative;
    width: 192px;
    height: 192px;
    background: var(--md1-surface, #FFFFFF);
    box-shadow: inset 0 0 0 1px var(--md1-divider, rgba(0, 0, 0, 0.12));
  }

  .md1-docs-icon-grid-stage[data-dense] {
    width: 160px;
    height: 160px;
  }

  /* 400% for the composition tiles. */
  .md1-docs-icon-grid-tile {
    width: 96px;
    height: 96px;
  }

  /* The glyph fills its stage; the icon's own size token is retuned on the icon itself. */
  .md1-docs-icon-grid-stage .md1-docs-icon-grid-glyph {
    --md1-icon-size: 192px;
  }

  .md1-docs-icon-grid-stage[data-dense] .md1-docs-icon-grid-glyph {
    --md1-icon-size: 160px;
  }

  .md1-docs-icon-grid-tile .md1-docs-icon-grid-glyph {
    --md1-icon-size: 96px;
  }

  .md1-docs-icon-grid-glyph {
    position: absolute;
    inset: 0;
    color: var(--md1-icon-active, rgba(0, 0, 0, 0.54));
  }

  .md1-docs-icon-grid-overlay {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    overflow: visible;
    fill: none;
  }

  .md1-docs-icon-grid-lines line {
    stroke: var(--md1-divider, rgba(0, 0, 0, 0.12));
    stroke-width: 1;
  }

  .md1-docs-icon-grid-keylines :is(line, rect, circle),
  .md1-docs-icon-grid-shape {
    stroke: var(--md1-accent, #FF4081);
    stroke-width: 1;
    stroke-opacity: 0.8;
  }

  .md1-docs-icon-grid-keylines line {
    stroke-opacity: 0.4;
  }

  /* The padding between the live and trim areas, tinted; the live area's edge in the accent. */
  .md1-docs-icon-grid-padding {
    fill: var(--md1-accent, #FF4081);
    fill-opacity: 0.16;
  }

  .md1-docs-icon-grid-live {
    stroke: var(--md1-accent, #FF4081);
    stroke-dasharray: 4 3;
    stroke-width: 1;
  }

  .md1-docs-icon-grid-actual {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 48px;
  }

  /* The trim area at 100%, outlined so its 24 or 20 dp edge is visible. */
  .md1-docs-icon-grid-trim {
    display: inline-flex;
    outline: 1px dashed var(--md1-divider, rgba(0, 0, 0, 0.12));
  }

  .md1-docs-icon-grid-ink {
    color: var(--md1-icon-active, rgba(0, 0, 0, 0.54));
  }

  .md1-docs-note {
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-caption-size, 12px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
