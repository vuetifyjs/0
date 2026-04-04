<script setup lang="ts">
  const {
    title,
    description,
    icon,
    disabled = false,
    locked = false,
  } = defineProps<{
    title: string
    description: string
    icon: string
    disabled?: boolean
    locked?: boolean
  }>()
</script>

<template>
  <button
    class="flex flex-col items-start gap-3 p-6 rounded-lg border bg-surface text-left transition-all"
    :class="[
      disabled
        ? 'opacity-50 cursor-not-allowed border-divider'
        : 'border-divider hover:border-primary cursor-pointer',
    ]"
    :disabled
  >
    <div class="flex items-center gap-3 w-full">
      <svg class="w-6 h-6 text-primary" viewBox="0 0 24 24">
        <path :d="icon" fill="currentColor" />
      </svg>
      <span v-if="locked" class="text-xs text-on-surface-variant border border-divider rounded px-2 py-0.5 ml-auto">
        Vuetify One
      </span>
    </div>
    <h3 class="text-lg font-semibold text-on-surface">{{ title }}</h3>
    <p class="text-sm text-on-surface-variant">{{ description }}</p>
  </button>
</template>
