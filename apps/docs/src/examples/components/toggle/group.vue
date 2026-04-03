<script setup lang="ts">
  import { Toggle } from '@vuetify/v0'
  import { ref } from 'vue'

  const alignment = ref('left')

  const options = [
    { value: 'left', label: 'Left' },
    { value: 'center', label: 'Center' },
    { value: 'right', label: 'Right' },
  ]
</script>

<template>
  <div class="flex flex-col gap-4">
    <Toggle.Group v-model="alignment" class="inline-flex border rounded border-divider" mandatory>
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
      Alignment: {{ alignment }}
    </span>
  </div>
</template>
