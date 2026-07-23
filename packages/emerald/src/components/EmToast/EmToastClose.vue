<script lang="ts">
  export interface EmToastCloseProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmToastClose' })

  const emit = defineEmits<{
    click: [event: MouseEvent]
  }>()

  function onClick (event: MouseEvent) {
    emit('click', event)
  }
</script>

<template>
  <button
    aria-label="Close toast"
    class="emerald-toast__close"
    type="button"
    @click="onClick"
  >
    <slot />
  </button>
</template>

<style scoped>
.emerald-toast__close {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--emerald-icon-l);
  height: var(--emerald-icon-l);
  padding: 0;
  margin: 0;
  border: none;
  border-radius: var(--emerald-radius-xs);
  background: transparent;
  color: var(--emerald-on-surface);
  cursor: pointer;
}

.emerald-toast__close:hover {
  background: var(--emerald-neutral-200);
}

.emerald-toast__close:focus-visible {
  outline: none;
  box-shadow: var(--emerald-shadow-focus);
}

.emerald-toast__close :slotted(*) {
  width: var(--emerald-icon-s, 18px);
  height: var(--emerald-icon-s, 18px);
}
</style>
