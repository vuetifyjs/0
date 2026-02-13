<script setup lang="ts">
  import { Breadcrumbs } from '@vuetify/v0'
</script>

<template>
  <Breadcrumbs.Root divider="/">
    <Breadcrumbs.List class="flex items-center gap-2 list-none text-sm">
      <Breadcrumbs.Item>
        <Breadcrumbs.Link class="text-primary hover:underline" href="#">
          Home
        </Breadcrumbs.Link>
      </Breadcrumbs.Item>

      <Breadcrumbs.Divider class="text-on-surface-variant" />

      <Breadcrumbs.Ellipsis class="text-on-surface-variant" />

      <Breadcrumbs.Item>
        <Breadcrumbs.Link class="text-primary hover:underline" href="#">
          Products
        </Breadcrumbs.Link>
      </Breadcrumbs.Item>

      <Breadcrumbs.Divider class="text-on-surface-variant" />

      <Breadcrumbs.Item>
        <Breadcrumbs.Link class="text-primary hover:underline" href="#">
          Electronics
        </Breadcrumbs.Link>
      </Breadcrumbs.Item>

      <Breadcrumbs.Divider class="text-on-surface-variant" />

      <Breadcrumbs.Item>
        <Breadcrumbs.Page class="text-on-surface-variant">
          Smartphones
        </Breadcrumbs.Page>
      </Breadcrumbs.Item>
    </Breadcrumbs.List>
  </Breadcrumbs.Root>
</template>
