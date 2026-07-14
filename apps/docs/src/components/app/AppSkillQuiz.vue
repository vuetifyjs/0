<script setup lang="ts">
  // Components
  import DocsQuestion from '@/components/docs/DocsQuestion.vue'

  // Composables
  import { useLevelFilterContext } from '@/composables/useLevelFilter'

  // Types
  import type { Level } from '@/composables/useLevelFilter'

  const { track = 'vue', count = 10 } = defineProps<{ track?: string, count?: number }>()

  const levelFilter = useLevelFilterContext()

  function onApply (level: Level) {
    levelFilter.clear()
    levelFilter.toggle(level)
  }
</script>

<template>
  <section id="skill-quiz" class="scroll-mt-24">
    <DocsQuestion
      :count
      purpose="placement"
      :track
      @apply="onApply"
    />
  </section>
</template>
