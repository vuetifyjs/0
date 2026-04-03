<script setup lang="ts">
  import { Toggle } from '@vuetify/v0'
  import { ref } from 'vue'

  const formatting = ref<string[]>([])

  const options = [
    { value: 'bold', label: 'B' },
    { value: 'italic', label: 'I' },
    { value: 'underline', label: 'U' },
    { value: 'strikethrough', label: 'S' },
  ]
</script>

<template>
  <div class="flex flex-col gap-4">
    <Toggle.Group v-model="formatting" class="inline-flex border rounded border-divider" multiple>
      <Toggle.Root
        v-for="option in options"
        :key="option.value"
        class="px-3 py-2 font-medium border-r last:border-r-0 border-divider data-[state=on]:bg-primary data-[state=on]:text-on-primary"
        :value="option.value"
      >
        {{ option.label }}
      </Toggle.Root>
    </Toggle.Group>

    <span class="text-sm text-on-surface-variant">
      Active: {{ formatting.join(', ') || 'none' }}
    </span>
  </div>
</template>
