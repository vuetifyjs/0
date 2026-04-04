<script setup lang="ts">
  import { mdiFormatListBulletedSquare, mdiRobot, mdiShoeprint } from '@mdi/js'

  // Utilities
  import { useRouter } from 'vue-router'

  const router = useRouter()
</script>

<template>
  <div class="min-h-screen bg-background text-on-background">
    <div class="max-w-2xl mx-auto px-6 py-24">
      <h1 class="text-3xl font-bold mb-2">v0 Framework Builder</h1>
      <p class="text-on-surface-variant mb-12">
        Pick the composables, components, and plugins you need — then try them in the playground.
      </p>

      <div class="flex flex-col gap-4">
        <ModeCard
          description="Walk through what you're building step by step. We'll recommend features based on your project."
          :icon="mdiShoeprint"
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
  </div>
</template>
