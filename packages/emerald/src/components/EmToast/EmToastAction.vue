<script lang="ts">
  export interface EmToastActionProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmToastAction' })

  const emit = defineEmits<{
    click: [event: MouseEvent]
  }>()

  function onClick (event: MouseEvent) {
    emit('click', event)
  }
</script>

<template>
  <button
    class="emerald-toast__action"
    type="button"
    @click="onClick"
  >
    <slot />
  </button>
</template>

<style scoped>
.emerald-toast__action {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 24px;
  padding: 0 8px;
  margin: 0;
  background: transparent;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  color: inherit;
  font-family: inherit;
  font-weight: 600;
  font-size: 12px;
  line-height: normal;
  letter-spacing: -0.12px;
  transition: background-color 120ms ease, opacity 120ms ease;
  align-self: center;
}

.emerald-toast__action:hover {
  background: rgb(0 0 0 / 0.05);
}

.emerald-toast__action:active {
  background: rgb(0 0 0 / 0.08);
}

.emerald-toast__action:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 2px;
}
</style>
