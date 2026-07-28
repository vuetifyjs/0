<script setup lang="ts">
  import { Breadcrumbs } from '../Breadcrumbs/index'
</script>

<template>
  <Breadcrumbs.Root>
    <Breadcrumbs.List>
      <Breadcrumbs.Item text="Home">
        <Breadcrumbs.Link href="/">Home</Breadcrumbs.Link>
      </Breadcrumbs.Item>

      <Breadcrumbs.Divider />

      <Breadcrumbs.Item text="Products">
        <Breadcrumbs.Link href="/products">Products</Breadcrumbs.Link>
      </Breadcrumbs.Item>

      <Breadcrumbs.Divider />

      <Breadcrumbs.Item text="Shoes">
        <Breadcrumbs.Page>Shoes</Breadcrumbs.Page>
      </Breadcrumbs.Item>
    </Breadcrumbs.List>
  </Breadcrumbs.Root>
</template>
