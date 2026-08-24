<script setup lang="ts">
  import { BuBreadcrumb, BuBreadcrumbItem } from '@paper/bulma'
</script>

<template>
  <BuBreadcrumb>
    <BuBreadcrumbItem href="#">
      <span class="icon is-small">
        <i
          aria-hidden="true"
          class="fas fa-home"
        />
      </span>
      <span>Bulma</span>
    </BuBreadcrumbItem>

    <BuBreadcrumbItem href="#">
      <span class="icon is-small">
        <i
          aria-hidden="true"
          class="fas fa-book"
        />
      </span>
      <span>Documentation</span>
    </BuBreadcrumbItem>

    <BuBreadcrumbItem
      current
      href="#"
    >
      <span class="icon is-small">
        <i
          aria-hidden="true"
          class="fas fa-thumbs-up"
        />
      </span>
      <span>Breadcrumb</span>
    </BuBreadcrumbItem>
  </BuBreadcrumb>
</template>
