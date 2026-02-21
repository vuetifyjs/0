<script setup lang="ts">
  // Components
  import AppBurst from '@/components/app/AppBurst.vue'

  // Utilities
  import { onMounted, useTemplateRef } from 'vue'

  defineProps<{
    title: string
    description: string
  }>()

  const emit = defineEmits<{
    back: []
    complete: []
  }>()

  const burstRef = useTemplateRef<InstanceType<typeof AppBurst>>('burst')

  onMounted(() => {
    setTimeout(() => burstRef.value?.trigger(), 300)
  })
</script>

<template>
  <div class="p-4 bg-surface border border-divider rounded-xl shadow-xl max-w-xs">
    <div class="flex justify-center mb-2">
      <AppBurst ref="burst" disabled emoji="🎉" :size="64" />
    </div>

    <h2 class="text-lg font-semibold text-on-surface mb-1 text-center">
      {{ title }}
    </h2>

    <p class="text-sm text-on-surface-variant text-center mb-8">
      {{ description }}
    </p>

    <div class="flex gap-2">
      <div class="ml-auto flex gap-2">
        <button
          class="px-3 py-1.5 text-sm text-on-surface-variant hover:text-on-surface"
          @click="emit('back')"
        >
          Back
        </button>

        <button
          class="px-3 py-1.5 text-sm rounded-lg bg-primary text-on-primary hover:bg-primary/90 transition-colors"
          @click="emit('complete')"
        >
          Complete
        </button>
      </div>
    </div>
  </div>
</template>
