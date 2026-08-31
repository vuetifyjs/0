<script setup lang="ts">
  import { Breadcrumbs } from '../Breadcrumbs/index'
</script>

<template>
  <!--
    Narrow root so Overflow selects the Ellipsis; without constraint capacity is
    Infinity, Ellipsis stays hidden, and Activator never becomes a live disclosure.
  -->
  <Breadcrumbs.Root style="width: 6rem; overflow: hidden">
    <Breadcrumbs.List style="display: flex; gap: 4px; overflow: hidden">
      <Breadcrumbs.Item text="Home">
        <Breadcrumbs.Link href="/">Home</Breadcrumbs.Link>
      </Breadcrumbs.Item>

      <Breadcrumbs.Divider />

      <Breadcrumbs.Ellipsis>
        <Breadcrumbs.Activator />
      </Breadcrumbs.Ellipsis>

      <Breadcrumbs.Divider />

      <Breadcrumbs.Item text="Products">
        <Breadcrumbs.Link href="/products">Products</Breadcrumbs.Link>
      </Breadcrumbs.Item>

      <Breadcrumbs.Divider />

      <Breadcrumbs.Item text="Electronics">
        <Breadcrumbs.Link href="/electronics">Electronics</Breadcrumbs.Link>
      </Breadcrumbs.Item>

      <Breadcrumbs.Divider />

      <Breadcrumbs.Item text="Shoes">
        <Breadcrumbs.Page>Shoes</Breadcrumbs.Page>
      </Breadcrumbs.Item>
    </Breadcrumbs.List>
  </Breadcrumbs.Root>
</template>
