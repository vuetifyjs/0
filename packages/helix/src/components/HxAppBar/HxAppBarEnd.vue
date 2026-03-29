<script lang="ts">
  export interface HxAppBarEndProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'HxAppBarEnd' })
</script>

<template>
  <div class="helix-app-bar__end">
    <slot />
  </div>
</template>

<style scoped>
  .helix-app-bar__end {
    display: flex;
    align-items: center;
  }
</style>
