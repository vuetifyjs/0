<script setup lang="ts">
  import { Button } from '@vuetify/v0'
  import BreadcrumbTrail from './BreadcrumbTrail.vue'
  import { useTrail } from './useTrail'

  const { crumbs, widths, width, resize } = useTrail()
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex items-center gap-2">
      <span class="text-xs font-medium text-on-surface-variant">Container width</span>

      <div class="flex gap-1">
        <Button.Root
          v-for="w in widths"
          :key="w.value"
          class="px-3 py-1 rounded-lg border border-divider text-xs text-on-surface data-[active]:bg-primary data-[active]:text-on-primary data-[active]:border-primary"
          :data-active="width === w.value || undefined"
          @click="resize(w.value)"
        >
          {{ w.label }}
        </Button.Root>
      </div>
    </div>

    <BreadcrumbTrail :crumbs :width />
  </div>
</template>
