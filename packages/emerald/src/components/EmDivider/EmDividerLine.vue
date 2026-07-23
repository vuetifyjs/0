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
  align-self: center;
}

.emerald-divider[data-orientation="horizontal"] .emerald-divider__line {
  border-top: var(--emerald-stroke-s) solid var(--emerald-divider);
  height: 1px;
  min-width: 1px;
}

.emerald-divider[data-orientation="horizontal"][data-variant="dashed"] .emerald-divider__line {
  border-top-style: dashed;
}

.emerald-divider[data-orientation="vertical"] .emerald-divider__line {
  border-left: var(--emerald-stroke-s) solid var(--emerald-divider);
  width: 1px;
  min-height: 1px;
}

.emerald-divider[data-orientation="vertical"][data-variant="dashed"] .emerald-divider__line {
  border-left-style: dashed;
}
</style>
