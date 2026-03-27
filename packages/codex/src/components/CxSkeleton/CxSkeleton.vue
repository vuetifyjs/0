<script lang="ts">
  export interface CxSkeletonProps {
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
  defineOptions({ name: 'CxSkeleton' })

  const {
    lines = 3,
    height = 'h-4',
    widths = ['w-full'],
    gap = 'gap-2',
    static: isStatic = false,
    direction = 'col',
  } = defineProps<CxSkeletonProps>()
</script>

<template>
  <div
    class="codex-skeleton"
    :class="[direction === 'row' ? 'codex-skeleton--row' : 'codex-skeleton--col', gap]"
    role="status"
  >
    <span class="sr-only">Loading...</span>

    <div
      v-for="i in lines"
      :key="i"
      aria-hidden="true"
      class="codex-skeleton__line"
      :class="[
        height,
        widths[(i - 1) % widths.length],
        !isStatic && 'codex-skeleton__line--animated',
      ]"
    />
  </div>
</template>

<style scoped>
  .codex-skeleton {
    display: flex;
  }

  .codex-skeleton--col {
    flex-direction: column;
  }

  .codex-skeleton--row {
    flex-direction: row;
  }

  .codex-skeleton__line {
    border-radius: 0.25rem;
  }

  .codex-skeleton__line--animated {
    animation: codex-skeleton-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }

  @keyframes codex-skeleton-pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
</style>
