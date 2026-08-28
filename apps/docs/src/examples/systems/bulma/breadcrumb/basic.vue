<script setup lang="ts">
  import { BuBreadcrumb } from '@paper/bulma'
</script>

<template>
  <BuBreadcrumb>
    <BuBreadcrumb.Item href="#">
      Bulma
    </BuBreadcrumb.Item>

    <BuBreadcrumb.Item href="#">
      Documentation
    </BuBreadcrumb.Item>

    <BuBreadcrumb.Item href="#">
      Components
    </BuBreadcrumb.Item>

    <BuBreadcrumb.Item
      current
      href="#"
    >
      Breadcrumb
    </BuBreadcrumb.Item>
  </BuBreadcrumb>
</template>
