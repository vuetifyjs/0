<script lang="ts">
  // Framework
  import { useId } from '@vuetify/v0'

  // Composables
  import { useMenuContext } from './context'

  // Utilities
  import { onScopeDispose, toRef, useTemplateRef } from 'vue'

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

  const id = useId()
  const root = useTemplateRef<HTMLButtonElement>('root')
  const menu = useMenuContext()

  if (menu) {
    const unregister = menu.register({
      id,
      el: () => root.value,
      disabled: () => disabled,
    })

    onScopeDispose(unregister)
  }

  const tabindex = toRef(() => {
    if (disabled) return -1
    if (!menu) return 0

    return menu.focus.isTabbable(id) ? 0 : -1
  })

  function onClick (event: MouseEvent) {
    if (disabled) return
    emit('click', event)
  }
</script>

<template>
  <button
    ref="root"
    class="emerald-menu__item"
    :data-active="active || undefined"
    :data-disabled="disabled || undefined"
    :disabled="disabled || undefined"
    role="menuitem"
    :tabindex
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
  gap: var(--emerald-spacing-xs);
  min-height: 36px;
  padding: var(--emerald-spacing-xs) var(--emerald-spacing-s);
  background: var(--emerald-background);
  border: none;
  border-inline-start: var(--emerald-stroke-s) solid var(--emerald-divider);
  border-start-end-radius: var(--emerald-radius-xs);
  border-end-end-radius: var(--emerald-radius-xs);
  font-family: inherit;
  font-size: var(--emerald-text-b1-size);
  font-weight: var(--emerald-text-b1-weight);
  line-height: var(--emerald-text-b1-height);
  color: var(--emerald-on-surface);
  text-align: start;
  cursor: pointer;
  user-select: none;
  transition: background-color 120ms ease, border-color 120ms ease;
}

.emerald-menu__item:hover:not([data-disabled]):not([data-active]) {
  background: var(--emerald-neutral-200);
  border-inline-start-color: var(--emerald-neutral-600);
}

.emerald-menu__item[data-active] {
  background: var(--emerald-primary-100);
  border-inline-start-color: var(--emerald-primary-600);
}

.emerald-menu__item[data-disabled] {
  color: var(--emerald-neutral-400);
  cursor: not-allowed;
}

.emerald-menu__item:focus-visible {
  outline: var(--emerald-stroke-m) solid var(--emerald-primary-600);
  outline-offset: -2px;
}
</style>
