<script setup lang="ts">
  import { Breadcrumbs } from '@vuetify/v0'
  import type { Crumb } from './useTrail'

  const { crumbs, width } = defineProps<{
    crumbs: Crumb[]
    width?: number
  }>()
</script>

<template>
  <div
    class="border border-divider border-dashed rounded-lg p-4 overflow-hidden transition-all duration-300"
    :style="{ maxWidth: width ? `${width}px` : undefined }"
  >
    <Breadcrumbs.Root v-slot="{ isOverflowing }">
      <Breadcrumbs.List class="flex items-center gap-2 list-none m-0 p-0 text-sm">
        <template v-for="(crumb, index) in crumbs" :key="crumb.text">
          <Breadcrumbs.Divider
            v-if="index > 0"
            class="text-on-surface-variant shrink-0 flex items-center m-0"
          >
            <svg class="size-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M9 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
            </svg>
          </Breadcrumbs.Divider>

          <Breadcrumbs.Ellipsis
            v-if="index === 1"
            class="text-on-surface-variant shrink-0 m-0"
          />

          <Breadcrumbs.Item class="shrink-0 m-0" :text="crumb.text">
            <Breadcrumbs.Page
              v-if="!crumb.href"
              class="text-on-surface-variant whitespace-nowrap"
            >
              {{ crumb.text }}
            </Breadcrumbs.Page>

            <Breadcrumbs.Link
              v-else
              class="text-primary hover:underline whitespace-nowrap"
              :href="crumb.href"
            >
              {{ crumb.text }}
            </Breadcrumbs.Link>
          </Breadcrumbs.Item>
        </template>
      </Breadcrumbs.List>

      <p class="mt-3 text-xs text-on-surface-variant">
        {{ isOverflowing ? 'Trail collapsed to fit the container' : 'Full trail visible' }}
      </p>
    </Breadcrumbs.Root>
  </div>
</template>
