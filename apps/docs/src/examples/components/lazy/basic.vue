<script setup lang="ts">
  import { Lazy } from '@vuetify/v0'
</script>

<template>
  <div class="flex flex-col gap-4">
    <p class="text-sm text-secondary">
      Scroll down to see the lazy-loaded content appear.
    </p>

    <div class="h-48 overflow-y-auto border border-outline rounded-lg p-4">
      <div class="h-32" />

      <Lazy.Root class="min-h-24">
        <Lazy.Placeholder>
          <div
            aria-label="Loading content"
            class="h-24 rounded-lg bg-surface-tint motion-safe:animate-pulse flex items-center justify-center"
            role="status"
          >
            <span aria-hidden="true" class="text-secondary text-sm">Loading...</span>
          </div>
        </Lazy.Placeholder>

        <Lazy.Content>
          <div class="h-24 rounded-lg bg-primary/10 flex items-center justify-center">
            <span class="text-primary font-medium">Content loaded!</span>
          </div>
        </Lazy.Content>
      </Lazy.Root>

      <div class="h-32" />
    </div>
  </div>
</template>
