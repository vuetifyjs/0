<script setup lang="ts">
  import { BuBreadcrumb } from '@paper/bulma'
</script>

<template>
  <BuBreadcrumb>
    <BuBreadcrumb.Item href="#">
      <span class="icon is-small">
        <i
          aria-hidden="true"
          class="fas fa-home"
        />
      </span>

      <span>Bulma</span>
    </BuBreadcrumb.Item>

    <BuBreadcrumb.Item href="#">
      <span class="icon is-small">
        <i
          aria-hidden="true"
          class="fas fa-book"
        />
      </span>

      <span>Documentation</span>
    </BuBreadcrumb.Item>

    <BuBreadcrumb.Item
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
    </BuBreadcrumb.Item>
  </BuBreadcrumb>
</template>
