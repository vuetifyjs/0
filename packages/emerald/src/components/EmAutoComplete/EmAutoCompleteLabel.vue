<script lang="ts">
  export interface EmAutoCompleteLabelProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmAutoCompleteLabel' })
</script>

<template>
  <div class="emerald-auto-complete__label" role="presentation">
    <slot />
  </div>
</template>

<style>
.emerald-auto-complete__label {
  display: flex;
  align-items: center;
  min-height: 36px;
  padding-block: var(--emerald-spacing-xs);
  padding-inline: 0 var(--emerald-spacing-s);
  font-family: inherit;
  font-size: var(--emerald-text-b1-size);
  font-weight: 700;
  line-height: var(--emerald-text-b1-height);
  color: var(--emerald-secondary);
  opacity: 0.7;
  user-select: none;
}
</style>
