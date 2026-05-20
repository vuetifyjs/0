<script lang="ts">
  export interface EmTagCloseProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmTagClose' })

  const emit = defineEmits<{
    click: [event: MouseEvent]
  }>()

  function onClick (event: MouseEvent) {
    emit('click', event)
  }
</script>

<template>
  <button
    aria-label="Remove tag"
    class="emerald-tag__close"
    type="button"
    @click="onClick"
  >
    <slot />
  </button>
</template>

<style scoped>
.emerald-tag__close {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  padding: 0;
  margin: 0;
  background: transparent;
  border: none;
  border-radius: 9999px;
  cursor: pointer;
  color: inherit;
  opacity: 0.7;
  transition: opacity 120ms ease, background-color 120ms ease;
}

.emerald-tag__close:hover {
  opacity: 1;
  background: rgb(0 0 0 / 0.06);
}

.emerald-tag__close :deep(svg) {
  width: 12px;
  height: 12px;
}
</style>
