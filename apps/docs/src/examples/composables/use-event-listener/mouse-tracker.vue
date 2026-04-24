<script setup lang="ts">
  import { useEventListener } from '@vuetify/v0'
  import { shallowRef, useTemplateRef } from 'vue'

  const area = useTemplateRef<HTMLElement>('area')
  const x = shallowRef(0)
  const y = shallowRef(0)
  const clicks = shallowRef(0)
  const inside = shallowRef(false)

  useEventListener(area, 'mousemove', (e: MouseEvent) => {
    const rect = area.value?.getBoundingClientRect()
    if (!rect) return
    x.value = Math.round(e.clientX - rect.left)
    y.value = Math.round(e.clientY - rect.top)
  })

  useEventListener(area, 'click', () => {
    clicks.value++
  })

  useEventListener(area, ['mouseenter', 'mouseleave'], (e: MouseEvent) => {
    inside.value = e.type === 'mouseenter'
  })
</script>

<template>
  <div class="flex flex-col gap-4">
    <div
      ref="area"
      class="relative h-48 rounded-lg border-2 border-dashed cursor-crosshair select-none overflow-hidden transition-colors"
      :class="inside ? 'border-primary bg-primary/5' : 'border-divider bg-surface'"
    >
      <div
        v-if="inside"
        class="absolute w-px h-full bg-primary/30 pointer-events-none"
        :style="{ left: `${x}px` }"
      />

      <div
        v-if="inside"
        class="absolute w-full h-px bg-primary/30 pointer-events-none"
        :style="{ top: `${y}px` }"
      />

      <div
        class="absolute px-2 py-1 rounded text-xs font-mono bg-surface-variant text-on-surface-variant pointer-events-none"
        :style="{ left: `${x + 12}px`, top: `${y + 12}px` }"
      >
        {{ x }}, {{ y }}
      </div>

      <div v-if="!inside" class="flex items-center justify-center h-full text-on-surface-variant text-sm">
        Move your mouse here
      </div>
    </div>

    <div class="flex items-center gap-6 text-sm">
      <div class="flex items-center gap-2">
        <span class="w-2 h-2 rounded-full" :class="inside ? 'bg-success' : 'bg-surface-variant'" />
        <span class="text-on-surface-variant">Pointer: <strong class="text-on-surface">{{ inside ? 'inside' : 'outside' }}</strong></span>
      </div>

      <div class="text-on-surface-variant">
        Clicks: <strong class="text-on-surface">{{ clicks }}</strong>
      </div>
    </div>
  </div>
</template>
