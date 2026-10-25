<script setup lang="ts">
  import { Md1Fab, Md1Switch } from '@paper/md1'
  import { shallowRef } from 'vue'

  const moved = shallowRef(false)
</script>

<template>
  <div class="md1-docs-layout-paper-stack">
    <Md1Switch v-model="moved" label="Move the upper sheet" />

    <div class="md1-docs-layout-paper">
      <figure class="md1-docs-layout-paper-figure">
        <!-- A seam: two sheets share a whole edge at the same depth, so they move as one. -->
        <div class="md1-docs-layout-paper-stage">
          <div class="md1-docs-layout-paper-pair" :data-moved="moved || undefined">
            <div class="md1-docs-layout-paper-sheet md1-elevation-2" />

            <div class="md1-docs-layout-paper-sheet md1-docs-layout-paper-sheet-alt md1-elevation-2" />
          </div>
        </div>

        <figcaption class="md1-docs-layout-paper-caption">Seam: one depth, moving together</figcaption>
      </figure>

      <figure class="md1-docs-layout-paper-figure">
        <!-- A step: overlapping sheets at different depths, each moving on its own. -->
        <div class="md1-docs-layout-paper-stage">
          <div class="md1-docs-layout-paper-sheet md1-docs-layout-paper-sheet-alt md1-docs-layout-paper-base md1-elevation-1" />

          <div class="md1-docs-layout-paper-sheet md1-docs-layout-paper-top md1-elevation-4" :data-moved="moved || undefined" />
        </div>

        <figcaption class="md1-docs-layout-paper-caption">Step: two depths, moving apart</figcaption>
      </figure>

      <figure class="md1-docs-layout-paper-figure">
        <!-- A FAB may straddle a step when it acts on the content that makes the step. -->
        <div class="md1-docs-layout-paper-stage">
          <div class="md1-docs-layout-paper-sheet md1-docs-layout-paper-sheet-alt md1-docs-layout-paper-base md1-elevation-1" />

          <div class="md1-docs-layout-paper-sheet md1-docs-layout-paper-top md1-elevation-4" data-fab-host :data-moved="moved || undefined">
            <Md1Fab aria-label="Add" icon="add" position="seam" />
          </div>
        </div>

        <figcaption class="md1-docs-layout-paper-caption">A FAB straddling a step</figcaption>
      </figure>
    </div>
  </div>
</template>

<style>
  .md1-docs-layout-paper-stack {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--md1-spacing-2, 16px);
    width: 100%;
  }

  .md1-docs-layout-paper {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: var(--md1-spacing-3, 24px);
  }

  .md1-docs-layout-paper-figure {
    margin: 0;
  }

  .md1-docs-layout-paper-stage {
    position: relative;
    width: 200px;
    height: 200px;
    overflow: hidden;
    padding: var(--md1-spacing-1, 8px);
    background: var(--md1-background, #FAFAFA);
  }

  .md1-docs-layout-paper-sheet {
    box-sizing: border-box;
    border-radius: var(--md1-radius, 2px);
    background: var(--md1-surface, #FFFFFF);
  }

  /* The second sheet of a pair takes the next surface tone so the edge between them reads. */
  .md1-docs-layout-paper-sheet-alt {
    background: #EEEEEE;
  }

  [data-theme='md1-dark'] .md1-docs-layout-paper-sheet-alt {
    background: #616161;
  }

  .md1-docs-layout-paper-pair {
    display: flex;
    height: 100%;
    transition: translate var(--md1-duration-standard, 300ms) var(--md1-easing-standard, cubic-bezier(0.4, 0, 0.2, 1));
  }

  .md1-docs-layout-paper-pair > .md1-docs-layout-paper-sheet {
    flex: 1 1 0;
    border-radius: 0;
  }

  .md1-docs-layout-paper-pair[data-moved] {
    translate: 0 -48px;
  }

  .md1-docs-layout-paper-base {
    position: absolute;
    inset: var(--md1-spacing-1, 8px);
  }

  .md1-docs-layout-paper-top {
    position: absolute;
    inset: var(--md1-spacing-1, 8px) var(--md1-spacing-1, 8px) 50%;
    transition: translate var(--md1-duration-standard, 300ms) var(--md1-easing-standard, cubic-bezier(0.4, 0, 0.2, 1));
  }

  .md1-docs-layout-paper-top[data-moved] {
    translate: 0 -48px;
  }

  .md1-docs-layout-paper-caption {
    margin-top: var(--md1-spacing-1, 8px);
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-caption-size, 12px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
    text-align: center;
  }
</style>
