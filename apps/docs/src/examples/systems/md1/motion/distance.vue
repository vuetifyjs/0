<script setup lang="ts">
  import { Md1Button, Md1ToggleButtons } from '@paper/md1'
  import { shallowRef } from 'vue'

  const mode = shallowRef('dynamic')
  const moved = shallowRef(false)

  // Dynamic: a short trip takes half the standard duration and a long one the
  // complex duration. Fixed: both take the standard duration, so the short trip drags.
  const tracks = [
    { id: 'short', label: 'Short distance, 48 dp', dynamic: 'calc(var(--md1-duration-standard, 300ms) * 0.5)' },
    { id: 'long', label: 'Long distance, across the track', dynamic: 'var(--md1-duration-complex, 375ms)' },
  ]
</script>

<template>
  <div class="md1-docs-motion-distance">
    <div class="md1-docs-motion-distance-controls">
      <Md1ToggleButtons v-model="mode" label="Duration" mandatory>
        <Md1ToggleButtons.Item value="dynamic">Dynamic</Md1ToggleButtons.Item>

        <Md1ToggleButtons.Item value="fixed">Fixed</Md1ToggleButtons.Item>

        <Md1ToggleButtons.Item value="slow">Slow motion</Md1ToggleButtons.Item>
      </Md1ToggleButtons>

      <Md1Button variant="raised" @click="moved = !moved">Move</Md1Button>
    </div>

    <div
      v-for="track in tracks"
      :key="track.id"
      class="md1-docs-motion-distance-track"
      :data-moved="moved || undefined"
      :data-track="track.id"
    >
      <span class="md1-type-caption md1-docs-motion-distance-label">{{ track.label }}</span>

      <span class="md1-docs-motion-distance-lane">
        <span
          class="md1-docs-motion-distance-puck md1-elevation-2"
          :style="{ transitionDuration: mode === 'fixed' ? 'var(--md1-duration-standard, 300ms)' : (mode === 'slow' ? `calc(${track.dynamic} * 4)` : track.dynamic) }"
        />
      </span>
    </div>
  </div>
</template>

<style>
  .md1-docs-motion-distance {
    display: flex;
    flex-direction: column;
    gap: var(--md1-spacing-2, 16px);
    width: 100%;
    max-width: 480px;
  }

  .md1-docs-motion-distance-controls {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--md1-spacing-2, 16px);
  }

  .md1-docs-motion-distance-label {
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }

  .md1-docs-motion-distance-lane {
    position: relative;
    display: block;
    height: 40px;
    margin-top: var(--md1-spacing-1, 8px);
    border-radius: 20px;
    background: var(--md1-divider, rgba(0, 0, 0, 0.12));
  }

  /* Every trip is on the standard curve: on-screen movement. Only the duration changes. */
  .md1-docs-motion-distance-puck {
    position: absolute;
    inset-block-start: 0;
    inset-inline-start: 0;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: var(--md1-accent, #FF4081);
    transition-property: inset-inline-start;
    transition-timing-function: var(--md1-easing-standard, cubic-bezier(0.4, 0, 0.2, 1));
  }

  .md1-docs-motion-distance-track[data-track='short'][data-moved] .md1-docs-motion-distance-puck {
    inset-inline-start: 48px;
  }

  .md1-docs-motion-distance-track[data-track='long'][data-moved] .md1-docs-motion-distance-puck {
    inset-inline-start: calc(100% - 40px);
  }

  body[data-reduced-motion='reduce'] .md1-docs-motion-distance-puck {
    transition: none;
  }

  @media (prefers-reduced-motion: reduce) {
    body:not([data-reduced-motion='no-preference']) .md1-docs-motion-distance-puck {
      transition: none;
    }
  }
</style>
