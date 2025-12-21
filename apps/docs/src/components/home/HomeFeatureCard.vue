<script lang="ts" setup>
  export interface HomeFeatureCardProps {
    icon: string
    title: string
    description: string
  }

  defineProps<HomeFeatureCardProps>()
</script>

<template>
  <div class="p-6 rounded-xl border bg-surface/30 hover:bg-surface/50 transition-colors">
    <div class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 text-on-primary">
      <AppIcon :icon :size="20" />
    </div>

    <h3 class="text-lg font-semibold mb-2">{{ title }}</h3>
    <p class="opacity-60 text-sm leading-relaxed">{{ description }}</p>
  </div>
</template>
