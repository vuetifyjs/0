<script setup lang="ts">
  const {
    title,
    description,
    icon,
    active = false,
  } = defineProps<{
    title: string
    description: string
    icon?: string
    active?: boolean
  }>()
</script>

<template>
  <button
    class="relative flex flex-col items-start p-5 rounded-lg border text-left transition-all cursor-pointer hover:shadow-md"
    :class="active ? 'border-primary bg-primary/5 ring-2 ring-primary/30 shadow-md' : 'border-divider bg-surface hover:border-primary'"
  >
    <div
      v-if="active"
      class="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary text-on-primary flex items-center justify-center text-xs"
    >
      &#10003;
    </div>
    <svg v-if="icon" class="w-8 h-8 mb-2" :class="active ? 'text-primary' : 'text-on-surface-variant'" viewBox="0 0 24 24">
      <path :d="icon" fill="currentColor" />
    </svg>
    <h4 class="font-semibold text-on-surface">{{ title }}</h4>
    <p class="text-sm text-on-surface-variant mt-1">{{ description }}</p>
  </button>
</template>
