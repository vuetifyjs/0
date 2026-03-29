<script lang="ts">
  export interface HxSkeletonProps {
    /** Number of skeleton lines to render */
    lines?: number
    /** Height class (e.g., 'h-4', 'h-6') */
    height?: string
    /** Width pattern for lines (cycles through if fewer than lines) */
    widths?: string[]
    /** Gap between lines */
    gap?: string
    /** Disable animation */
    static?: boolean
    /** Layout direction */
    direction?: 'row' | 'col'
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'HxSkeleton' })

  const {
    lines = 3,
    height = 'h-4',
    widths = ['w-full'],
    gap = 'gap-2',
    static: isStatic = false,
    direction = 'col',
  } = defineProps<HxSkeletonProps>()
</script>

<template>
  <div
    class="helix-skeleton"
    :class="[direction === 'row' ? 'helix-skeleton--row' : 'helix-skeleton--col', gap]"
    role="status"
  >
    <span class="helix-sr-only">Loading...</span>

    <div
      v-for="i in lines"
      :key="i"
      aria-hidden="true"
      class="helix-skeleton__line"
      :class="[
        height,
        widths[(i - 1) % widths.length],
        !isStatic && 'helix-skeleton__line--animated',
      ]"
    />
  </div>
</template>

<style scoped>
  .helix-skeleton {
    display: flex;
  }

  .helix-skeleton--col {
    flex-direction: column;
  }

  .helix-skeleton--row {
    flex-direction: row;
  }

  .helix-skeleton__line {
    border-radius: 0.25rem;
    background-color: var(--v0-surface-variant);
  }

  .helix-skeleton__line--animated {
    animation: helix-skeleton-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }

  @keyframes helix-skeleton-pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }

  .helix-sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }
</style>
