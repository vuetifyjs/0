<script setup lang="ts">
  const {
    title,
    description,
    icon,
    disabled = false,
    locked = false,
    recommended = false,
  } = defineProps<{
    title: string
    description: string
    icon: string
    disabled?: boolean
    locked?: boolean
    recommended?: boolean
  }>()
</script>

<template>
  <button
    class="flex flex-col items-start gap-3 p-6 rounded-lg border bg-surface text-left transition-all min-h-80"
    :class="[
      locked
        ? 'opacity-60 cursor-not-allowed border-divider'
        : disabled
          ? 'opacity-50 cursor-not-allowed border-divider'
          : recommended
            ? 'border-primary/30 ring-2 ring-primary/30 hover:shadow-lg hover:border-primary/50 cursor-pointer'
            : 'border-divider hover:shadow-lg hover:border-primary/50 cursor-pointer',
    ]"
    :disabled="disabled || locked"
  >
    <div class="flex items-center gap-3 w-full">
      <svg class="w-6 h-6 text-primary" viewBox="0 0 24 24">
        <path :d="icon" fill="currentColor" />
      </svg>
      <span v-if="recommended" class="text-xs text-primary font-semibold bg-primary/10 rounded px-2 py-0.5 ml-auto">
        Recommended
      </span>
      <span v-if="locked" class="text-xs text-on-surface-variant border border-divider rounded px-2 py-0.5 ml-auto">
        Vuetify One
      </span>
    </div>
    <h3 class="text-lg font-semibold text-on-surface">{{ title }}</h3>
    <p class="text-sm text-on-surface-variant">{{ description }}</p>
  </button>
</template>
