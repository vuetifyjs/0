<script setup lang="ts">
  import { mdiCompass, mdiFormatListBulletedSquare, mdiRobot } from '@mdi/js'

  // Utilities
  import { useRouter } from 'vue-router'

  import { useBuilderStore } from '@/stores/builder'

  const store = useBuilderStore()
  const router = useRouter()
</script>

<template>
  <div class="py-32">
    <h1 class="text-4xl md:text-5xl font-bold mb-2">v0 <span class="text-primary">Framework</span> Builder</h1>
    <p class="text-on-surface-variant mb-2">
      Pick the composables, components, and plugins you need — then try them in the playground.
    </p>
    <p class="text-sm text-on-surface-variant/70 mb-12">
      {{ store.catalog.length }} features available
    </p>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <ModeCard
        description="Walk through what you're building step by step. We'll recommend features based on your project."
        :icon="mdiCompass"
        recommended
        title="Guided"
        @click="router.push('/guided')"
      />

      <ModeCard
        description="Browse the full catalog and select exactly what you need. For developers who know the library."
        :icon="mdiFormatListBulletedSquare"
        title="Free Pick"
        @click="router.push('/free')"
      />

      <ModeCard
        description="Describe your project and let AI assemble the right framework for you."
        :icon="mdiRobot"
        locked
        title="AI Builder"
        @click="router.push('/ai')"
      />
    </div>
  </div>
</template>
