<script lang="ts">
  export interface EmToastBodyProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmToastBody' })
</script>

<template>
  <div class="emerald-toast__body">
    <slot />
  </div>
</template>

<style scoped>
.emerald-toast__body {
  display: flex;
  flex: 1 0 0;
  flex-direction: column;
  align-items: flex-start;
  min-width: 0;
}
</style>
