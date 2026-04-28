<script setup lang="ts">
  import { Input, Overflow } from '@vuetify/v0'
  import { shallowRef } from 'vue'

  const tags = [
    'TypeScript', 'Vue', 'React', 'Svelte', 'Angular',
    'Solid', 'Qwik', 'Astro', 'Nuxt', 'Next.js',
  ]

  const width = shallowRef('80')
</script>

<template>
  <div class="space-y-4">
    <Input.Root v-model="width" type="range">
      <label class="block text-xs font-medium text-on-surface-variant mb-1">
        Container width: {{ width }}%
      </label>

      <Input.Control
        class="w-full accent-primary"
        max="100"
        min="20"
      />
    </Input.Root>

    <Overflow.Root
      class="flex items-center gap-2 overflow-hidden border border-divider rounded-lg p-3 transition-all"
      :gap="8"
      :style="{ width: `${width}%` }"
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
  </div>
</template>
