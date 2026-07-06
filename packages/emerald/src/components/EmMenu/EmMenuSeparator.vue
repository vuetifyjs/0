<script lang="ts">
  export interface EmMenuSeparatorProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmMenuSeparator' })
</script>

<template>
  <div class="emerald-menu__separator-wrapper">
    <div
      aria-orientation="horizontal"
      class="emerald-menu__separator"
      role="separator"
    />
  </div>
</template>

<style>
.emerald-menu__separator-wrapper {
  display: flex;
  align-items: center;
  height: var(--emerald-spacing-m);
  padding: 0 var(--emerald-spacing-2xs);
}

.emerald-menu__separator {
  flex: 1;
  border-top: var(--emerald-stroke-s) dashed var(--emerald-divider);
}
</style>
