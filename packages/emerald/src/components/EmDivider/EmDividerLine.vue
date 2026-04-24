<script lang="ts">
  export interface EmDividerLineProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmDividerLine' })
</script>

<template>
  <span aria-hidden="true" class="emerald-divider__line" />
</template>

<style>
.emerald-divider__line {
  flex: 1 0 0;
  align-self: stretch;
}

.emerald-divider[data-orientation="horizontal"] .emerald-divider__line {
  border-top: 1px solid rgb(var(--emerald-neutral-channels, 26 28 30) / 0.1);
  height: 1px;
  min-width: 1px;
}

.emerald-divider[data-orientation="horizontal"][data-variant="dashed"] .emerald-divider__line {
  border-top-style: dashed;
}

.emerald-divider[data-orientation="vertical"] .emerald-divider__line {
  border-left: 1px solid rgb(var(--emerald-neutral-channels, 26 28 30) / 0.1);
  width: 1px;
  min-height: 1px;
}

.emerald-divider[data-orientation="vertical"][data-variant="dashed"] .emerald-divider__line {
  border-left-style: dashed;
}
</style>
