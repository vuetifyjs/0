<script setup lang="ts">
  // Utilities
  import { useSlots } from 'vue'

  defineProps<{
    label: string
    description?: string
  }>()

  const model = defineModel<boolean>({ required: true })
  const slots = useSlots()

  function onKeydown (e: KeyboardEvent) {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault()
      model.value = !model.value
    }
  }
</script>

<template>
  <label class="flex items-center justify-between gap-3 px-3 py-2 rounded-lg bg-surface-tint/50 cursor-pointer">
    <div :class="slots.prepend ? 'flex items-center gap-2' : ''">
      <slot name="prepend" />
      <span class="text-sm">{{ label }}</span>
      <p v-if="description && !slots.prepend" class="text-xs text-on-surface-variant/60">{{ description }}</p>
    </div>
    <button
      :aria-checked="model"
      :aria-label="`Toggle ${label.toLowerCase()}`"
      :class="[
        'relative w-11 h-6 rounded-full transition-colors shrink-0',
        model ? 'bg-primary' : 'bg-surface-variant',
      ]"
      role="switch"
      type="button"
      @click="model = !model"
      @keydown="onKeydown"
    >
      <span
        :class="[
          'absolute top-1 left-0 w-4 h-4 rounded-full bg-white shadow transition-transform',
          model ? 'translate-x-6' : 'translate-x-1',
        ]"
      />
    </button>
  </label>
</template>
