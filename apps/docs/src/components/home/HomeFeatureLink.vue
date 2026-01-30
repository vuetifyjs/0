<script setup lang="ts">
  // Components
  import DocsCard from '@/components/docs/DocsCard.vue'

  // Utilities
  import { toRef } from 'vue'

  export interface HomeFeatureLinkProps {
    icon: string
    title: string
    description: string
    cta: string
    to: string
  }

  const props = defineProps<HomeFeatureLinkProps>()

  const isInternal = toRef(() => props.to.startsWith('/'))
</script>

<template>
  <DocsCard
    class="group flex items-center gap-5 rounded-xl"
    hoverable
    :href="isInternal ? undefined : to"
    :to="isInternal ? to : undefined"
  >
    <div class="w-12 h-12 shrink-0 rounded-lg bg-primary flex items-center justify-center text-on-primary group-hover:bg-primary transition-colors">
      <AppIcon class="!opacity-100" :icon :size="22" />
    </div>

    <div class="flex-1 min-w-0">
      <div class="flex items-center gap-3">
        <h3 class="font-semibold group-hover:text-primary transition-colors">
          {{ title }}
        </h3>
        <span class="text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
          {{ cta }}
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M9 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
          </svg>
        </span>
      </div>
      <p class="opacity-60 text-sm">
        {{ description }}
      </p>
    </div>
  </DocsCard>
</template>
