<script lang="ts">
  export interface EmCardFooterProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmCardFooter' })
</script>

<template>
  <div class="emerald-card__footer">
    <slot />
  </div>
</template>

<style scoped>
.emerald-card__footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--emerald-spacing-xs);
}
</style>
