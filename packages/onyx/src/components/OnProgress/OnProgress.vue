<script lang="ts">
  // Framework
  import { Progress } from '@vuetify/v0'

  export type OnProgressSize = 'sm' | 'md'

  export interface OnProgressProps {
    indeterminate?: boolean
    max?: number
    size?: OnProgressSize
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'OnProgress' })

  const {
    indeterminate = false,
    max = 100,
    size = 'md',
  } = defineProps<OnProgressProps>()

  const model = defineModel<number>()
</script>

<template>
  <Progress.Root v-model="model" class="onyx-progress" :data-size="size" :max>
    <Progress.Track class="onyx-progress__track">
      <Progress.Fill v-if="!indeterminate" class="onyx-progress__fill" />
      <div v-else aria-hidden="true" class="onyx-progress__indeterminate" />
    </Progress.Track>
  </Progress.Root>
</template>

<!-- Unscoped: Progress.Track/Fill are compound children from v0's own file scope;
     scoped data-v never reaches their roots (mirrors the OnButton/Button.Root case). -->
<style>
  .onyx-progress {
    display: block;
    width: 100%;
  }

  /* A channel cut into the stone — the intaglio recipe at track scale. */
  .onyx-progress__track {
    background: var(--onyx-band-recess), var(--onyx-intaglio, #090605);
    border-radius: 9999px;
    box-shadow: var(--onyx-girdle-recess);
    height: 8px;
    overflow: hidden;
    position: relative;
    width: 100%;
  }

  .onyx-progress[data-size='sm'] .onyx-progress__track {
    height: 4px;
  }

  .onyx-progress__fill {
    background: var(--onyx-primary, #dac593);
    border-radius: 9999px;
    height: 100%;
    transition: width var(--onyx-motion-base, 200ms) var(--onyx-motion-easing, cubic-bezier(0.16, 1, 0.3, 1));
  }

  .onyx-progress__indeterminate {
    animation: onyx-progress-slide 1.5s ease-in-out infinite;
    background: var(--onyx-primary, #dac593);
    border-radius: 9999px;
    height: 100%;
    left: 0;
    position: absolute;
    top: 0;
    width: 40%;
  }

  @keyframes onyx-progress-slide {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(250%); }
  }

  @media (prefers-reduced-motion: reduce) {
    .onyx-progress__indeterminate {
      animation-duration: 4s;
    }
  }
</style>
