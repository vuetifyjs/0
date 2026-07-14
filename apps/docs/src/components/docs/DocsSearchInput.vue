<script setup lang="ts">
  const { placeholder = 'Search…' } = defineProps<{
    placeholder?: string
  }>()

  const model = defineModel<string>({ default: '' })
</script>

<template>
  <div class="relative">
    <AppIcon
      class="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none"
      icon="search"
      :size="16"
    />

    <input
      v-model="model"
      class="w-full pl-9 pr-3 py-2 text-sm bg-surface-tint border border-divider rounded-lg outline-none focus:border-primary transition-colors placeholder:text-on-surface-variant"
      :placeholder
      type="text"
    >
  </div>
</template>
