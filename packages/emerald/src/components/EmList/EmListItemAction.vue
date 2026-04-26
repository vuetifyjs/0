<script lang="ts">
  export interface EmListItemActionProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmListItemAction' })
</script>

<template>
  <span aria-hidden="true" class="emerald-list__item-action">
    <slot />
  </span>
</template>
