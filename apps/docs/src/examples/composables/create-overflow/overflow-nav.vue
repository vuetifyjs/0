<script setup lang="ts">
  import { Button } from '@vuetify/v0'
  import { shallowRef } from 'vue'

  import OverflowNav from './OverflowNav.vue'

  const presets = [
    { label: 'Full', value: 0 },
    { label: '640px', value: 640 },
    { label: '480px', value: 480 },
    { label: '360px', value: 360 },
    { label: '280px', value: 280 },
  ]

  const width = shallowRef(0)
</script>

<template>
  <div class="space-y-4">
    <div class="flex flex-wrap items-center gap-2">
      <span class="text-xs text-on-surface-variant">Container width</span>

      <Button.Root
        v-for="preset in presets"
        :key="preset.value"
        class="rounded-md px-2.5 py-1 text-xs transition-colors"
        :class="width === preset.value
          ? 'bg-primary text-on-primary'
          : 'bg-surface-variant text-on-surface hover:bg-surface-variant/70'"
        @click="width = preset.value"
      >
        {{ preset.label }}
      </Button.Root>
    </div>

    <div
      class="transition-[max-width] duration-300"
      :style="{ maxWidth: width ? `${width}px` : '100%' }"
    >
      <OverflowNav />
    </div>

    <p class="text-xs text-on-surface-variant">
      Shrink the container to watch trailing destinations collapse into the overflow menu, then widen it to see them return.
    </p>
  </div>
</template>
