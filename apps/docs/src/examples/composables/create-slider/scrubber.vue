<script setup lang="ts">
  import ScrubberConsumer from './ScrubberConsumer.vue'
  import ScrubberProvider from './ScrubberProvider.vue'
</script>

<template>
  <ScrubberProvider v-slot="{ onPointerdown, trackRef }">
    <div
      :ref="trackRef"
      class="max-w-md mx-auto rounded-xl bg-surface-variant pa-6 touch-none"
      @pointerdown="onPointerdown"
    >
      <ScrubberConsumer />
    </div>
  </ScrubberProvider>
</template>
