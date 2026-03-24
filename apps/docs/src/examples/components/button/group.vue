<script setup lang="ts">
  import { Button } from '@vuetify/v0'
  import { ref } from 'vue'

  const alignment = ref<string>()
</script>

<template>
  <Button.Group
    v-model="alignment"
    class="inline-flex rounded-md border border-divider overflow-hidden"
    label="Text alignment"
  >
    <Button.Root
      v-for="option in ['left', 'center', 'right']"
      :key="option"
      class="px-3 py-2 text-sm font-medium bg-surface hover:bg-surface-tint data-[selected]:bg-primary data-[selected]:text-on-primary transition-colors border-r border-divider last:border-r-0"
      :value="option"
    >
      {{ option[0].toUpperCase() + option.slice(1) }}
    </Button.Root>
  </Button.Group>

  <p class="mt-3 text-sm text-on-surface-variant">
    Selected: {{ alignment ?? 'none' }}
  </p>
</template>
