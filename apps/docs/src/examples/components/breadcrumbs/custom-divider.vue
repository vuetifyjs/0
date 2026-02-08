<script setup lang="ts">
  import { Breadcrumbs } from '@vuetify/v0'
</script>

<template>
  <Breadcrumbs.Root>
    <Breadcrumbs.List class="flex items-center gap-2 list-none m-0 p-0 text-sm">
      <Breadcrumbs.Item class="list-none m-0">
        <Breadcrumbs.Link class="text-primary hover:underline" href="#">
          Home
        </Breadcrumbs.Link>
      </Breadcrumbs.Item>

      <Breadcrumbs.Divider class="text-on-surface-variant list-none flex items-center m-0">
        <svg class="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M9 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
        </svg>
      </Breadcrumbs.Divider>

      <Breadcrumbs.Item class="list-none m-0">
        <Breadcrumbs.Link class="text-primary hover:underline" href="#">
          Settings
        </Breadcrumbs.Link>
      </Breadcrumbs.Item>

      <Breadcrumbs.Divider class="text-on-surface-variant list-none flex items-center m-0">
        <svg class="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M9 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
        </svg>
      </Breadcrumbs.Divider>

      <Breadcrumbs.Item class="list-none m-0">
        <Breadcrumbs.Page class="text-on-surface-variant">
          Profile
        </Breadcrumbs.Page>
      </Breadcrumbs.Item>
    </Breadcrumbs.List>
  </Breadcrumbs.Root>
</template>
