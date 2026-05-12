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
    click: [event: MouseEvent]
  }>()

  function onClick (event: MouseEvent) {
    if (disabled) return
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
    @click="onClick"
  >
    <slot />
  </li>
</template>
