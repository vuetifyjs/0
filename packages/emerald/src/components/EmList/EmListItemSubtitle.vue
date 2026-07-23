<script lang="ts">
  export interface EmListItemSubtitleProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmListItemSubtitle' })
</script>

<template>
  <span class="emerald-list__item-subtitle">
    <slot />
  </span>
</template>
