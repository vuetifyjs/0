<script lang="ts">
  export interface EmMenuItemProps {
    disabled?: boolean
    active?: boolean
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmMenuItem' })

  const { disabled = false, active = false } = defineProps<EmMenuItemProps>()

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
    :aria-disabled="disabled || undefined"
    class="emerald-menu__item"
    :data-active="active || undefined"
    :data-disabled="disabled || undefined"
    :disabled="disabled || undefined"
    role="menuitem"
    type="button"
    @click="onClick"
  >
    <slot />
  </button>
</template>

<style>
.emerald-menu__item {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 36px;
  padding: 8px 12px;
  background: transparent;
  border: none;
  border-left: 0.5px solid rgb(var(--emerald-neutral-channels, 26 28 30) / 0.1);
  border-radius: 0 6px 6px 0;
  font-family: inherit;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--emerald-primary-950);
  text-align: left;
  cursor: pointer;
  user-select: none;
  transition: background-color 120ms ease, color 120ms ease;
}

.emerald-menu__item:hover:not([data-disabled]):not([data-active]) {
  background: var(--emerald-primary-50);
}

.emerald-menu__item[data-active] {
  background: var(--emerald-primary-100);
  border-left-color: var(--emerald-primary-500);
  color: var(--emerald-primary-500);
  font-weight: 500;
}

.emerald-menu__item[data-disabled] {
  opacity: 0.5;
  cursor: not-allowed;
}

.emerald-menu__item:focus-visible {
  outline: 2px solid var(--emerald-primary-500);
  outline-offset: -2px;
}
</style>
