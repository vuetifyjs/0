<script setup lang="ts">
  import { Toggle } from '@vuetify/v0'
  import { ref } from 'vue'

  const bold = ref(false)
</script>

<template>
  <div class="flex items-center gap-4">
    <Toggle.Root
      v-model="bold"
      class="inline-flex items-center gap-2 px-3 py-2 border rounded font-medium border-divider data-[state=on]:bg-primary data-[state=on]:text-on-primary data-[state=on]:border-primary"
    >
      <Toggle.Indicator class="text-sm">✓</Toggle.Indicator>
      Bold
    </Toggle.Root>

    <span class="text-sm text-on-surface-variant">
      State: {{ bold ? 'on' : 'off' }}
    </span>
  </div>
</template>
