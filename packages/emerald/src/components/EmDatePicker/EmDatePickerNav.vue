<script lang="ts">
  export interface EmDatePickerNavProps {
    disabled?: boolean
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmDatePickerNav' })

  const { disabled = false } = defineProps<EmDatePickerNavProps>()

  const emit = defineEmits<{
    click: [event: MouseEvent]
  }>()

  function onClick (event: MouseEvent) {
    if (disabled) return

    emit('click', event)
  }
</script>

<template>
  <button
    class="emerald-date-picker__nav"
    :data-disabled="disabled || undefined"
    :disabled="disabled || undefined"
    type="button"
    @click="onClick"
  >
    <slot />
  </button>
</template>

<style scoped>
.emerald-date-picker__nav {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  width: 24px;
  height: 24px;
  padding: var(--emerald-spacing-2xs);
  border: none;
  border-radius: var(--emerald-radius-xs);
  background: transparent;
  color: inherit;
  cursor: pointer;
}

.emerald-date-picker__nav:hover:not([data-disabled]) {
  background: var(--emerald-neutral-200);
}

.emerald-date-picker__nav:focus-visible {
  outline: none;
  box-shadow: var(--emerald-shadow-focus);
}

.emerald-date-picker__nav[data-disabled] {
  color: var(--emerald-neutral-400);
  cursor: not-allowed;
}

.emerald-date-picker__nav :slotted(svg) {
  width: 16px;
  height: 16px;
}
</style>
