<script lang="ts">
  export interface EmListItemProps {
    interactive?: boolean
    disabled?: boolean
    active?: boolean
    indent?: boolean
    header?: boolean
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmListItem' })

  const {
    interactive = false,
    disabled = false,
    active = false,
    indent = false,
    header = false,
  } = defineProps<EmListItemProps>()

  const emit = defineEmits<{
    click: [event: MouseEvent | KeyboardEvent]
  }>()

  function onClick (event: MouseEvent) {
    if (disabled) return
    emit('click', event)
  }

  function onKeydown (event: KeyboardEvent) {
    if (disabled || !interactive) return
    if (event.key !== 'Enter' && event.key !== ' ') return

    event.preventDefault()
    emit('click', event)
  }
</script>

<template>
  <li
    class="emerald-list__item"
    :class="{ 'emerald-list__item-header': header }"
    :data-active="active || undefined"
    :data-disabled="disabled || undefined"
    :data-indent="(indent && !active && !header) || undefined"
    :data-interactive="interactive || undefined"
    :tabindex="interactive && !disabled ? 0 : undefined"
    @click="onClick"
    @keydown="onKeydown"
  >
    <slot />
  </li>
</template>
