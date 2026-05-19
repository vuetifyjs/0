<script lang="ts">
  export interface EmListItemBodyProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmListItemBody' })
</script>

<template>
  <div class="emerald-list__item-body">
    <slot />
  </div>
</template>
