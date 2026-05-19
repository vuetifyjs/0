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
