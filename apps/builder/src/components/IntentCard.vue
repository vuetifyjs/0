<script setup lang="ts">
  const {
    title,
    description,
    active = false,
  } = defineProps<{
    title: string
    description: string
    active?: boolean
  }>()
</script>

<template>
  <button
    class="flex flex-col items-start p-4 rounded-lg border text-left transition-all cursor-pointer"
    :class="active ? 'border-primary bg-surface-tint' : 'border-divider bg-surface hover:border-primary'"
  >
    <h4 class="font-semibold text-on-surface">{{ title }}</h4>
    <p class="text-sm text-on-surface-variant mt-1">{{ description }}</p>
  </button>
</template>
