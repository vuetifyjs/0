<script setup lang="ts">
  import { icons } from '../icons'

  defineOptions({ name: 'OnyxIcons' })
</script>

<template>
  <p :style="{ color: 'var(--onyx-muted-foreground, #71717a)', maxWidth: '640px' }">
    Every icon in Onyx is inline SVG path data — no icon font, no npm dependency. Each
    glyph is a 24×24 stroke path rendered with <code>fill="none"</code> and
    <code>stroke="currentColor"</code>, so it inherits color and scales with
    <code>font-size</code> like text.
  </p>

  <div class="grid gap-3 mt-6" style="grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));">
    <OnCard v-for="(d, name) in icons" :key="name" class="flex flex-col items-center gap-2 p-4">
      <svg
        aria-hidden="true"
        fill="none"
        height="24"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        viewBox="0 0 24 24"
        width="24"
      >
        <path :d />
      </svg>

      <span style="font-size: 12px; line-height: 16px; min-height: 32px; text-align: center; color: var(--onyx-muted-foreground, #71717a);">{{ name }}</span>
    </OnCard>
  </div>
</template>
