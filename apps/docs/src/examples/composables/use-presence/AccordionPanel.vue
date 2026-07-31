<script setup lang="ts">
  import { usePresence } from '@vuetify/v0'

  const { open = false } = defineProps<{
    open?: boolean
  }>()

  const { isMounted, isLeaving, state, done } = usePresence({
    present: () => open,
    immediate: false,
  })

  function onAnimationEnd () {
    if (isLeaving.value) done()
  }
</script>

<template>
  <div
    v-if="isMounted"
    class="accordion-panel border-t border-divider"
    :data-state="state"
    @animationend="onAnimationEnd"
  >
    <div class="px-4 py-3 bg-background text-on-surface-variant text-sm">
      <slot />
      <p class="mt-2 text-xs text-on-surface-variant">presence state: {{ state }}</p>
    </div>
  </div>
</template>

<style scoped>
  .accordion-panel {
    overflow: hidden;
  }

  .accordion-panel[data-state="mounted"] {
    opacity: 0;
  }

  .accordion-panel[data-state="present"] {
    animation: accordion-enter 240ms ease-out;
  }

  .accordion-panel[data-state="leaving"] {
    animation: accordion-leave 200ms ease-in;
  }

  @keyframes accordion-enter {
    from { opacity: 0; max-height: 0; }
    to { opacity: 1; max-height: 320px; }
  }

  @keyframes accordion-leave {
    from { opacity: 1; max-height: 320px; }
    to { opacity: 0; max-height: 0; }
  }
</style>
