<script setup lang="ts">
  import { BuBreadcrumb, BuBreadcrumbItem } from '@paper/bulma'
</script>

<template>
  <BuBreadcrumb>
    <BuBreadcrumbItem href="#">
      Bulma
    </BuBreadcrumbItem>

    <BuBreadcrumbItem href="#">
      Documentation
    </BuBreadcrumbItem>

    <BuBreadcrumbItem href="#">
      Components
    </BuBreadcrumbItem>

    <BuBreadcrumbItem
      current
      href="#"
    >
      Breadcrumb
    </BuBreadcrumbItem>
  </BuBreadcrumb>
</template>
