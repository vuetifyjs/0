<script setup lang="ts">
  import { Breadcrumbs } from '@vuetify/v0'
</script>

<template>
  <Breadcrumbs.Root divider="/">
    <Breadcrumbs.List class="flex items-center gap-2 list-none m-0 p-0 text-sm">
      <Breadcrumbs.Item class="list-none m-0">
        <Breadcrumbs.Link class="text-primary hover:underline" href="#">
          Home
        </Breadcrumbs.Link>
      </Breadcrumbs.Item>

      <Breadcrumbs.Divider class="text-on-surface-variant list-none flex items-center m-0" />

      <Breadcrumbs.Item class="list-none m-0">
        <Breadcrumbs.Link class="text-primary hover:underline" href="#">
          Products
        </Breadcrumbs.Link>
      </Breadcrumbs.Item>

      <Breadcrumbs.Divider class="text-on-surface-variant list-none flex items-center m-0" />

      <Breadcrumbs.Item class="list-none m-0">
        <Breadcrumbs.Link class="text-primary hover:underline" href="#">
          Electronics
        </Breadcrumbs.Link>
      </Breadcrumbs.Item>

      <Breadcrumbs.Divider class="text-on-surface-variant list-none flex items-center m-0" />

      <Breadcrumbs.Item class="list-none m-0">
        <Breadcrumbs.Page class="text-on-surface-variant">
          Smartphones
        </Breadcrumbs.Page>
      </Breadcrumbs.Item>
    </Breadcrumbs.List>
  </Breadcrumbs.Root>
</template>
