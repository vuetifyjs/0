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
    class="relative flex flex-col items-start p-5 rounded-lg border text-left transition-all cursor-pointer hover:shadow-md"
    :class="active ? 'border-primary bg-primary/5 ring-2 ring-primary/30 shadow-md' : 'border-divider bg-surface hover:border-primary'"
  >
    <div
      v-if="active"
      class="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary text-on-primary flex items-center justify-center text-xs"
    >
      &#10003;
    </div>
    <h4 class="font-semibold text-on-surface">{{ title }}</h4>
    <p class="text-sm text-on-surface-variant mt-1">{{ description }}</p>
  </button>
</template>
