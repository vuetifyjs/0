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

<style>
.emerald-card__footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  padding: 16px 24px;
}
</style>
