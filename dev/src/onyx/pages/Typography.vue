<script setup lang="ts">
  import { fontFamily, fontSize } from '@paper/onyx'

  defineOptions({ name: 'OnyxTypography' })

  const sizes = Object.entries(fontSize) as [string, [string, { lineHeight: string }]][]
</script>

<template>
  <p :style="{ color: 'var(--onyx-muted-foreground, #71717a)', maxWidth: '640px' }">
    Onyx sets <code>{{ fontFamily.sans }}</code> for UI text and
    <code>{{ fontFamily.mono }}</code> for code — a system stack, no custom webfonts, matching
    the shadcn/ui default.
  </p>

  <OnCard class="onyx-typography__scale mt-6">
    <div v-for="[name, [size, { lineHeight }]] in sizes" :key="name" class="onyx-typography__row flex items-center gap-6 p-4">
      <div class="flex items-center gap-3" style="width: 180px; flex-shrink: 0;">
        <code>{{ name }}</code>
        <span style="color: var(--onyx-muted-foreground, #71717a); font-size: 12px;">{{ size }} / {{ lineHeight }}</span>
      </div>

      <span :style="{ fontSize: size, lineHeight }">The quick brown fox jumps over the lazy dog</span>
    </div>
  </OnCard>
</template>

<!-- Unscoped: page-local reference table, layout scaffolding only. -->
<style>
  .onyx-typography__row {
    border-bottom: var(--onyx-stroke-s, 1px) solid var(--onyx-border, #e4e4e7);
  }

  .onyx-typography__row:last-child {
    border-bottom: none;
  }
</style>
