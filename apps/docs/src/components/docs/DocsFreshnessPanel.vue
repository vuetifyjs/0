<script setup lang="ts">
  // Components
  import AppIcon from '@/components/app/AppIcon.vue'

  // Composables
  import { useFreshness, scoreToColor } from '@/composables/useFreshness'

  // Utilities
  import { toRef } from 'vue'

  const { overall, components, composables, guides } = useFreshness()

  const tint = toRef(() => scoreToColor(overall.value))

  const bars = toRef(() => [
    { key: 'components', label: 'components', score: components.value },
    { key: 'composables', label: 'composables', score: composables.value },
    { key: 'guides', label: 'guides', score: guides.value },
  ])

  const ariaLabel = toRef(() =>
    `Docs freshness: ${overall.value} out of 100. `
    + `Components ${components.value}, composables ${composables.value}, guides ${guides.value}. `
    + 'Click for details.',
  )
</script>

<template>
  <router-link
    :aria-label
    class="block border-t border-divider p-3 hover:bg-surface-variant-50 transition-colors"
    to="/health"
  >
    <div class="flex items-center gap-3 mb-2">
      <span class="inline-flex" :style="{ color: tint }">
        <AppIcon icon="freshness-avocado" :size="28" />
      </span>

      <div class="leading-tight">
        <div class="font-mono font-bold text-xl" :style="{ color: tint }">
          {{ overall }}
        </div>

        <div class="text-[10px] uppercase tracking-wide text-on-surface-variant">
          docs freshness
        </div>
      </div>
    </div>

    <div class="flex flex-col gap-1">
      <router-link
        v-for="bar in bars"
        :key="bar.key"
        :aria-label="`${bar.label} ${bar.score} out of 100`"
        class="flex items-center gap-2 text-[11px]"
        :to="`/health?category=${bar.key}`"
        @click.stop
      >
        <span class="flex-1 text-on-surface-variant">{{ bar.label }}</span>

        <span class="relative flex-1 h-1 bg-divider rounded overflow-hidden">
          <span
            class="absolute inset-y-0 start-0 rounded"
            :style="{ width: `${bar.score}%`, backgroundColor: scoreToColor(bar.score) }"
          />
        </span>

        <span class="font-mono w-7 text-end" :style="{ color: scoreToColor(bar.score) }">
          {{ bar.score }}
        </span>
      </router-link>
    </div>
  </router-link>
</template>
