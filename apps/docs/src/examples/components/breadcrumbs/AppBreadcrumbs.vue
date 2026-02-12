<script setup lang="ts">
  import { computed } from 'vue'
  import { Breadcrumbs } from '@vuetify/v0'
  import { useBreadcrumbItems } from './useBreadcrumbItems'

  export interface BreadcrumbItem {
    text: string
    href?: string
  }

  const props = defineProps<{
    items?: BreadcrumbItem[]
  }>()

  const breadcrumbs = useBreadcrumbItems()
  const items = computed(() => props.items ?? breadcrumbs.value)
</script>

<template>
  <Breadcrumbs.Root>
    <Breadcrumbs.List class="flex items-center gap-2 list-none m-0 p-0 text-sm">
      <template v-for="(item, index) in items" :key="item.text">
        <Breadcrumbs.Divider
          v-if="index > 0"
          class="text-on-surface-variant list-none shrink-0 flex items-center m-0"
        >
          <svg class="size-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M9 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
          </svg>
        </Breadcrumbs.Divider>

        <Breadcrumbs.Ellipsis
          v-if="index === 1"
          class="text-on-surface-variant list-none shrink-0 m-0"
        />

        <Breadcrumbs.Item class="list-none shrink-0 m-0" :text="item.text">
          <Breadcrumbs.Page
            v-if="!item.href"
            class="text-on-surface-variant whitespace-nowrap"
          >
            {{ item.text }}
          </Breadcrumbs.Page>

          <Breadcrumbs.Link
            v-else
            class="text-primary hover:underline whitespace-nowrap"
            :href="item.href"
          >
            {{ item.text }}
          </Breadcrumbs.Link>
        </Breadcrumbs.Item>
      </template>
    </Breadcrumbs.List>
  </Breadcrumbs.Root>
</template>
