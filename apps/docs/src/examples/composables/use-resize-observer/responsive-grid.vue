<script setup lang="ts">
  import { useElementSize } from '@vuetify/v0'
  import { computed, useTemplateRef } from 'vue'

  const containerRef = useTemplateRef<HTMLElement>('container')
  const { width, height } = useElementSize(containerRef)

  const columns = computed(() => {
    if (width.value >= 600) return 3
    if (width.value >= 400) return 2
    return 1
  })

  const cards = [
    { title: 'Analytics', icon: 'i-lucide-bar-chart-2', color: 'bg-primary' },
    { title: 'Users', icon: 'i-lucide-users', color: 'bg-secondary' },
    { title: 'Revenue', icon: 'i-lucide-dollar-sign', color: 'bg-success' },
    { title: 'Orders', icon: 'i-lucide-shopping-cart', color: 'bg-warning' },
    { title: 'Messages', icon: 'i-lucide-mail', color: 'bg-info' },
    { title: 'Settings', icon: 'i-lucide-settings', color: 'bg-accent' },
  ]
</script>

<template>
  <div class="flex flex-col gap-4">
    <div
      ref="container"
      class="relative min-h-64 p-4 border-2 border-dashed border-divider rounded-lg resize-x overflow-auto"
      style="min-width: 200px; max-width: 100%"
    >
      <div
        class="absolute top-2 right-2 px-2 py-1 rounded text-xs font-mono bg-surface-variant text-on-surface-variant z-10"
      >
        {{ Math.round(width) }} x {{ Math.round(height) }}
      </div>

      <div
        class="grid gap-3 transition-all duration-300"
        :style="{ gridTemplateColumns: `repeat(${columns}, 1fr)` }"
      >
        <div
          v-for="card in cards"
          :key="card.title"
          class="p-4 rounded-lg bg-surface border border-divider shadow-sm transition-transform duration-200 hover:scale-[1.02]"
        >
          <div class="flex items-center gap-3">
            <div
              class="w-10 h-10 rounded-lg flex items-center justify-center text-white"
              :class="card.color"
            >
              <div class="w-5 h-5" :class="card.icon" />
            </div>
            <span class="font-medium text-on-surface">{{ card.title }}</span>
          </div>
        </div>
      </div>
    </div>

    <p class="text-xs text-on-surface-variant text-center">
      Drag the right edge to resize. Columns: {{ columns }}
    </p>
  </div>
</template>
