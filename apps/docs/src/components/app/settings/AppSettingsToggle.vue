<script setup lang="ts">
  // Utilities
  import { useSlots } from 'vue'

  defineProps<{
    label: string
    description?: string
  }>()

  const model = defineModel<boolean>({ required: true })
  const slots = useSlots()
</script>

<template>
  <label class="flex items-center justify-between gap-3 px-3 py-2 rounded-lg bg-surface-variant cursor-pointer">
    <div :class="slots.prepend ? 'flex items-center gap-2' : ''">
      <slot name="prepend" />

      <div>
        <span class="text-sm">{{ label }}</span>
        <p v-if="description" class="text-xs text-on-surface-variant/60">{{ description }}</p>
      </div>
    </div>

    <AppSwitch v-model="model" :label="`Toggle ${label.toLowerCase()}`" />
  </label>
</template>
