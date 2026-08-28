<script setup lang="ts">
  import { BuBreadcrumb } from '@paper/bulma'
</script>

<template>
  <p class="is-size-7 has-text-grey mb-2">arrow</p>

  <BuBreadcrumb
    class="mb-5"
    separator="arrow"
  >
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

  <p class="is-size-7 has-text-grey mb-2">bullet</p>

  <BuBreadcrumb separator="bullet">
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
