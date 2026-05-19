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
