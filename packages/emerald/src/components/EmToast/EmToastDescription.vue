<script lang="ts">
  export interface EmToastDescriptionProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmToastDescription' })
</script>

<template>
  <div class="emerald-toast__description">
    <slot />
  </div>
</template>
