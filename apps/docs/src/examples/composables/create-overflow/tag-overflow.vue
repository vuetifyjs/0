<script setup lang="ts">
  import { createOverflow } from '@vuetify/v0'
  import { useTemplateRef } from 'vue'

  const tags = [
    'TypeScript', 'Vue', 'React', 'Svelte', 'Angular',
    'Solid', 'Qwik', 'Astro', 'Nuxt', 'Next.js',
    'Remix', 'SvelteKit',
  ]

  const container = useTemplateRef<HTMLElement>('container')
  const overflow = createOverflow({
    container,
    gap: 8,
    reserved: 60,
  })

  const visible = tags.length

  function onRef (index: number, el: Element | null) {
    overflow.measure(index, el ?? undefined)
  }
</script>

<template>
  <div class="space-y-4">
    <div
      ref="container"
      class="flex items-center gap-2 overflow-hidden border border-divider rounded-lg p-3 transition-all"
    >
      <span
        v-for="(tag, index) in tags.slice(0, overflow.capacity.value)"
        :key="tag"
        :ref="(el: unknown) => onRef(index, el as Element)"
        class="px-2.5 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary whitespace-nowrap shrink-0"
      >
        {{ tag }}
      </span>

      <span
        v-if="overflow.isOverflowing.value"
        class="px-2.5 py-1 text-xs font-medium rounded-full bg-surface-variant text-on-surface-variant whitespace-nowrap shrink-0"
      >
        +{{ visible - overflow.capacity.value }} more
      </span>
    </div>

    <div class="border border-divider rounded-lg p-3 bg-surface-variant/30 text-xs space-y-1">
      <p>
        <span class="text-on-surface-variant">capacity: </span>
        <span class="text-on-surface font-medium">{{ overflow.capacity.value }}</span>
        <span class="text-on-surface-variant"> / {{ visible }} items</span>
      </p>

      <p>
        <span class="text-on-surface-variant">overflowing: </span>

        <span
          class="font-medium"
          :class="overflow.isOverflowing.value ? 'text-warning' : 'text-success'"
        >
          {{ overflow.isOverflowing.value }}
        </span>
      </p>

      <p>
        <span class="text-on-surface-variant">container width: </span>
        <span class="text-on-surface font-medium">{{ Math.round(overflow.width.value) }}px</span>
      </p>
    </div>
  </div>
</template>
