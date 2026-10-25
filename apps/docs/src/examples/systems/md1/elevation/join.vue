<script setup lang="ts">
  import { Md1Button } from '@paper/md1'
  import { shallowRef } from 'vue'

  const joined = shallowRef(false)
</script>

<template>
  <div class="md1-docs-elevation-join-stack">
    <div class="md1-docs-elevation-join-stage">
      <div
        class="md1-docs-elevation-join"
        :class="joined ? 'md1-elevation-2' : 'md1-elevation-0'"
        :data-joined="joined || undefined"
      >
        <div class="md1-docs-elevation-join-sheet" :class="joined ? 'md1-elevation-0' : 'md1-elevation-2'">
          <p class="md1-docs-elevation-join-text md1-type-subheading">Arrivals</p>
        </div>

        <div class="md1-docs-elevation-join-sheet" :class="joined ? 'md1-elevation-0' : 'md1-elevation-2'">
          <p class="md1-docs-elevation-join-text md1-type-subheading">Departures</p>
        </div>
      </div>
    </div>

    <Md1Button variant="raised" @click="joined = !joined">{{ joined ? 'Split' : 'Join' }}</Md1Button>
  </div>
</template>

<style>
  .md1-docs-elevation-join-stack {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--md1-spacing-2, 16px);
  }

  .md1-docs-elevation-join-stage {
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    width: min(100%, 360px);
    height: 160px;
    background: var(--md1-background, #FAFAFA);
    box-shadow: inset 0 0 0 1px var(--md1-divider, rgba(0, 0, 0, 0.12));
  }

  /*
   * Two sheets at the same elevation close the gap between them and become
   * one: the seam closes, the inner corners square off, and the two shadows
   * hand over to one around the whole. Splitting runs it backwards.
   */
  .md1-docs-elevation-join {
    display: flex;
    gap: var(--md1-spacing-2, 16px);
    border-radius: var(--md1-radius, 2px);
    transition:
      gap var(--md1-duration-standard, 300ms) var(--md1-easing-standard, cubic-bezier(0.4, 0, 0.2, 1)),
      box-shadow var(--md1-duration-standard, 300ms) var(--md1-easing-standard, cubic-bezier(0.4, 0, 0.2, 1));
  }

  .md1-docs-elevation-join[data-joined] {
    gap: 0;
  }

  .md1-docs-elevation-join-sheet {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 128px;
    height: 96px;
    background: var(--md1-surface, #FFFFFF);
    border-radius: var(--md1-radius, 2px);
  }

  .md1-docs-elevation-join[data-joined] .md1-docs-elevation-join-sheet:first-child {
    border-start-end-radius: 0;
    border-end-end-radius: 0;
  }

  .md1-docs-elevation-join[data-joined] .md1-docs-elevation-join-sheet:last-child {
    border-start-start-radius: 0;
    border-end-start-radius: 0;
  }

  .md1-docs-elevation-join-text {
    margin: 0;
  }

  body:not([data-reduced-motion='no-preference']) .md1-docs-elevation-join {
    transition: none;
  }
</style>
