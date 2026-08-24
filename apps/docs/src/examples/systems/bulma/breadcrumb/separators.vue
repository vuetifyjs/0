<script setup lang="ts">
  import { BuBreadcrumb, BuBreadcrumbItem } from '@paper/bulma'
</script>

<template>
  <p class="is-size-7 has-text-grey mb-2">arrow</p>

  <BuBreadcrumb
    class="mb-5"
    separator="arrow"
  >
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

  <p class="is-size-7 has-text-grey mb-2">bullet</p>

  <BuBreadcrumb separator="bullet">
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
