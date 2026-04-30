<script setup lang="ts">
  import { Overflow } from '@vuetify/v0'

  const tags = [
    'TypeScript', 'Vue', 'React', 'Svelte', 'Angular',
    'Solid', 'Qwik', 'Astro', 'Nuxt', 'Next.js',
  ]
</script>

<template>
  <Overflow.Root
    class="flex items-center gap-2 overflow-hidden border border-divider rounded-lg p-3"
    :gap="8"
  >
    <Overflow.Item
      v-for="tag in tags"
      :key="tag"
      as="span"
      class="px-2.5 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary whitespace-nowrap shrink-0"
      :value="tag"
    >
      {{ tag }}
    </Overflow.Item>

    <Overflow.Indicator
      v-slot="{ count }"
      as="span"
      class="px-2.5 py-1 text-xs font-medium rounded-full bg-surface-variant text-on-surface-variant whitespace-nowrap shrink-0"
    >
      +{{ count }} more
    </Overflow.Indicator>
  </Overflow.Root>
</template>
