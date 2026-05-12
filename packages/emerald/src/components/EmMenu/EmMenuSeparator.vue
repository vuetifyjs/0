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
  padding: 8px;
}

.emerald-menu__separator {
  flex: 1;
  height: 0.5px;
  background: rgb(var(--emerald-neutral-channels, 26 28 30) / 0.1);
}
</style>
