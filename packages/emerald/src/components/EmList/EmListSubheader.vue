<script lang="ts">
  export interface EmListSubheaderProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmListSubheader' })
</script>

<template>
  <li class="emerald-list__subheader" role="presentation">
    <slot />
  </li>
</template>
